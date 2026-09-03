// Vercel serverless function — the "someone decides when" half of prayer-
// time push notifications. Meant to be hit by an external scheduler (a
// free cron pinger, since Vercel's own Cron Jobs are daily-only on the
// Hobby plan — nowhere near fine-grained enough for 5x-daily prayer
// triggers) every 1-5 minutes. Protected by CRON_SECRET so it can't be
// abused/spammed by anyone who finds the URL.
//
// For each user with notifications enabled: fetch prayer times for their
// stored location (via /api/aladhan, same IPv6-avoidance reasoning as the
// client), compare against "now" in that location's own timezone, and send
// through FCM once per prayer per day — tracked via lastNotified on the
// user doc so re-running this every minute doesn't double-send. Also
// carries three more per-user, per-local-time checks added later that fit
// naturally into this same loop since it already has each user's own
// timezone-resolved "now" and Aladhan response on hand: the Ramadan Imsak
// reminder and the Dzikir Petang streak-break reminder (2026-09-03), and
// the Amalan Harian incomplete reminder (2026-09-04). None needed its own
// scheduler — all three ride this function's existing 1-5 minute cadence.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { getAuth } from 'firebase-admin/auth';
import { pickPrayerMessage } from './_lib/prayerMessages.js';

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABEL = { Fajr: 'Subuh', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };
const RAMADAN_HIJRI_MONTH = 9; // matches lib/ramadan.js's RAMADAN_MONTH
// Duplicated from lib/amalanHarian.js's SHOLAT_KEYS — that file is a
// client-side ES module using the client Firestore SDK, can't be imported
// into this Admin SDK context, so just the 5-item key list is copied here
// (same small-duplication precedent as RAMADAN_HIJRI_MONTH above).
const AMALAN_SHOLAT_KEYS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
const AMALAN_TOTAL_ITEMS = AMALAN_SHOLAT_KEYS.length + 3; // + Dzikir Pagi, Dzikir Petang, Tilawah

// Minutes a prayer stays "due" after its exact time — catches cron runs
// that don't land on the exact minute, without needing a 1-minute cron.
const WINDOW_MINUTES = 10;

// How long after this user's own local Maghrib to check whether Dzikir
// Petang is still undone — long enough that most people who were going to
// do it right after Maghrib already have, short enough it's still evening
// when the nudge arrives.
const STREAK_REMINDER_DELAY_MINUTES = 90;

// How long after this user's own local Isha to check whether today's
// Amalan Harian checklist is still incomplete — deliberately later than
// STREAK_REMINDER_DELAY_MINUTES (90) so the two reminders don't land in
// the same instant for someone who'd get both.
const AMALAN_REMINDER_DELAY_MINUTES = 150;

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 belum diset di Vercel.');
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

function minutesSinceMidnight(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function nowInTimezone(timezone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: minutesSinceMidnight(`${get('hour')}:${get('minute')}`),
  };
}

// Prunes tokens FCM reports as dead (uninstalled app, expired
// subscription) so fcmTokens doesn't grow unbounded with junk — shared by
// all three notification checks below rather than repeated per-check.
async function pruneDeadTokens(docRef, tokens, result) {
  const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
  if (deadTokens.length) {
    await docRef.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
  }
}

// Self-service "Tes Notifikasi" (2026-09-04) — a different auth model
// than the cron-secret-gated path below: verifies the CALLER's own
// Firebase ID token instead, so any signed-in user can trigger exactly
// one push to their own device(s) on demand, no CRON_SECRET involved.
// Folded into this file rather than a 13th api/*.js file — same
// Hobby-plan 12-function-cap reasoning as check-campaign-deadlines.js's
// own multi-check merging. Real value: this app now has 5 notification
// categories + a lead-time setting + a master switch — a lot of
// configuration to get right with no fast way to confirm it's actually
// working short of waiting for a real prayer time.
async function handleTestNotification(req, res) {
  const authHeader = req.headers.authorization || '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) return res.status(401).json({ error: 'Missing ID token' });

  try {
    initAdmin();
    const decoded = await getAuth().verifyIdToken(idToken);
    const db = getFirestore();
    const userSnap = await db.collection('users').doc(decoded.uid).get();
    const tokens = userSnap.data()?.fcmTokens || [];
    if (!tokens.length) {
      return res.status(400).json({ error: 'Belum ada perangkat terdaftar buat notifikasi — aktifkan dulu di Jadwal Sholat.' });
    }

    const messaging = getMessaging();
    const result = await messaging.sendEachForMulticast({
      tokens,
      data: { tag: 'test-notification', title: '🔔 Tes Notifikasi', body: 'Kalau kamu lihat ini, notifikasi airmoon udah aktif dengan benar!' },
    });
    return res.status(200).json({ ok: true, successCount: result.successCount, totalTokens: tokens.length });
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Token gak valid.' });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.method === 'POST' && req.body?.action === 'test') {
    return handleTestNotification(req, res);
  }

  const secret = req.query.secret || req.headers['x-cron-secret'];
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initAdmin();
    const db = getFirestore();
    const messaging = getMessaging();

    const snap = await db.collection('users').where('notifEnabled', '==', true).get();
    const sent = [];
    const errors = [];

    for (const docSnap of snap.docs) {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      const loc = u.notifLocation;
      if (!tokens.length || !loc?.lat || !loc?.lng) continue;
      // Granular per-category opt-out (2026-09-04) — see lib/notifPrefs.js.
      // Missing/undefined reads as enabled, so an existing user who's
      // never opened the new settings section sees no behavior change.
      const adzanEnabled = u.notifPrefs?.adzan !== false;
      const pengingatEnabled = u.notifPrefs?.pengingat !== false;
      if (!adzanEnabled && !pengingatEnabled) continue; // nothing this loop can send would be wanted
      // How many minutes before the exact prayer time to fire — was always
      // 0 before this (see lib/notifications.js's LEAD_MINUTE_OPTIONS).
      // Only applies to the 5 daily prayers, not Imsak (which already has
      // its own fixed "~10 min before Fajr" convention independent of
      // this setting).
      const leadMinutes = Number(u.notifLeadMinutes) || 0;

      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const alRes = await fetch(
          `https://airmoon.vercel.app/api/aladhan?type=timings&timestamp=${timestamp}&lat=${loc.lat}&lng=${loc.lng}`
        );
        const alJson = await alRes.json();
        if (!alRes.ok) {
          errors.push({ uid: docSnap.id, error: 'aladhan fetch failed' });
          continue;
        }

        const { timings, meta, date } = alJson.data;
        const { dateKey, minutes: nowMin } = nowInTimezone(meta.timezone);
        const lastNotified = u.lastNotified || {};

        for (const key of adzanEnabled ? PRAYER_ORDER : []) {
          const prayerMin = minutesSinceMidnight(timings[key]) - leadMinutes;
          const due = nowMin >= prayerMin && nowMin < prayerMin + WINDOW_MINUTES;
          const alreadySent = lastNotified.date === dateKey && lastNotified.prayer === key;
          if (!due || alreadySent) continue;

          const label = PRAYER_LABEL[key];
          const prayerIndex = PRAYER_ORDER.indexOf(key);
          // Data-only (no top-level `notification` field) on purpose: a
          // `notification` payload gets auto-displayed by the OS/browser
          // using its own default sound/channel *before* our own code ever
          // runs, on both Android's native FCM and web push — which is
          // exactly what stops the native app's custom azan-sound
          // notification channel (and would stop any future per-message
          // customization) from ever taking effect. Data-only guarantees
          // firebase-messaging-sw.js's onBackgroundMessage (web) and the
          // native app's FirebaseMessagingService.onMessageReceived always
          // run, so they can build the notification themselves.
          const result = await messaging.sendEachForMulticast({
            tokens,
            data: {
              tag: `adzan-${key}`,
              title: leadMinutes > 0 ? `${leadMinutes} Menit Lagi Sholat ${label}` : `Waktunya Sholat ${label}`,
              body: pickPrayerMessage(dateKey, prayerIndex, label),
            },
          });

          await docSnap.ref.update({ lastNotified: { date: dateKey, prayer: key } });
          await pruneDeadTokens(docSnap.ref, tokens, result);
          sent.push({ uid: docSnap.id, prayer: key, successCount: result.successCount });
        }

        // Ramadan Imsak reminder — Aladhan's own `timings.Imsak` (already
        // in the response fetched above, no extra API call) is the
        // standard "sahur ends soon" moment, conventionally ~10 min before
        // Fajr. Gated on the Hijri month from this same response so it
        // only ever fires during Ramadan, reusing the exact same
        // due-window + lastNotified dedup pattern as the prayer loop above
        // (Imsak always falls chronologically before Fajr, so there's no
        // same-day ambiguity sharing one lastNotified field with it).
        const hijriMonth = date?.hijri?.month?.number;
        if (adzanEnabled && hijriMonth === RAMADAN_HIJRI_MONTH && timings.Imsak) {
          const imsakMin = minutesSinceMidnight(timings.Imsak);
          const due = nowMin >= imsakMin && nowMin < imsakMin + WINDOW_MINUTES;
          const alreadySent = lastNotified.date === dateKey && lastNotified.prayer === 'Imsak';
          if (due && !alreadySent) {
            const result = await messaging.sendEachForMulticast({
              tokens,
              data: {
                tag: 'imsak',
                title: '🌙 Waktu Imsak',
                body: 'Waktu sahur segera berakhir — siap-siap untuk Subuh.',
              },
            });
            await docSnap.ref.update({ lastNotified: { date: dateKey, prayer: 'Imsak' } });
            await pruneDeadTokens(docSnap.ref, tokens, result);
            sent.push({ uid: docSnap.id, prayer: 'Imsak', successCount: result.successCount });
          }
        }

        // Dzikir Petang streak-break reminder — fires once, Config
        // STREAK_REMINDER_DELAY_MINUTES after this user's own local
        // Maghrib, only for someone who already has an active streak
        // worth protecting (current > 0) and hasn't marked today done yet.
        // Reuses the same fcmTokens/notifEnabled population as prayer
        // notifications rather than a separate opt-in — matching the same
        // reasoning already applied to the zakat haul and Jumat reminders
        // in api/check-campaign-deadlines.js.
        const petangStreak = u.dzikirStreak?.petang;
        if (pengingatEnabled && petangStreak?.current > 0 && timings.Maghrib) {
          const streakWindowStart = minutesSinceMidnight(timings.Maghrib) + STREAK_REMINDER_DELAY_MINUTES;
          const due = nowMin >= streakWindowStart && nowMin < streakWindowStart + WINDOW_MINUTES;
          const alreadyDoneToday = petangStreak.lastDate === dateKey;
          const alreadyReminded = petangStreak.lastReminderDate === dateKey;
          if (due && !alreadyDoneToday && !alreadyReminded) {
            const result = await messaging.sendEachForMulticast({
              tokens,
              data: {
                tag: 'dzikir-streak',
                title: '🔥 Jangan Putus Rentetan Dzikir',
                body: `Rentetan ${petangStreak.current} hari kamu bisa putus kalau belum Dzikir Petang hari ini.`,
              },
            });
            await docSnap.ref.update({ 'dzikirStreak.petang.lastReminderDate': dateKey });
            await pruneDeadTokens(docSnap.ref, tokens, result);
            sent.push({ uid: docSnap.id, prayer: 'DzikirStreak', successCount: result.successCount });
          }
        }

        // Amalan Harian incomplete reminder (2026-09-04) — one gentle
        // evening nudge if today's checklist (5 sholat + Dzikir Pagi/
        // Petang + Tilawah, same shape as components/AmalanHarianCard.jsx)
        // isn't fully done yet, instead of the app only ever passively
        // waiting for someone to open it and notice on their own.
        // lastAmalanReminderDate is set every time this window is checked
        // (whether or not a push actually goes out) so a user who finishes
        // everything before the window doesn't get re-queried the rest of
        // the day.
        if (pengingatEnabled && timings.Isha) {
          const amalanWindowStart = minutesSinceMidnight(timings.Isha) + AMALAN_REMINDER_DELAY_MINUTES;
          const due = nowMin >= amalanWindowStart && nowMin < amalanWindowStart + WINDOW_MINUTES;
          const alreadyReminded = u.lastAmalanReminderDate === dateKey;
          if (due && !alreadyReminded) {
            const amalanSnap = await docSnap.ref.collection('amalanHarian').doc(dateKey).get();
            const amalan = amalanSnap.exists ? amalanSnap.data() : { sholat: {}, tilawah: false };
            const sholatDone = AMALAN_SHOLAT_KEYS.filter((k) => amalan.sholat?.[k]).length;
            const dzikirPagiDone = u.dzikirStreak?.pagi?.lastDate === dateKey;
            const dzikirPetangDone = u.dzikirStreak?.petang?.lastDate === dateKey;
            const totalDone = sholatDone + (dzikirPagiDone ? 1 : 0) + (dzikirPetangDone ? 1 : 0) + (amalan.tilawah ? 1 : 0);

            await docSnap.ref.update({ lastAmalanReminderDate: dateKey });

            if (totalDone < AMALAN_TOTAL_ITEMS) {
              const result = await messaging.sendEachForMulticast({
                tokens,
                data: {
                  tag: 'amalan-belum-selesai',
                  title: '📋 Amalan Hari Ini Belum Selesai',
                  body: `${totalDone}/${AMALAN_TOTAL_ITEMS} amalan harian selesai — masih ada waktu buat lengkapin sebelum hari ini berakhir.`,
                },
              });
              await pruneDeadTokens(docSnap.ref, tokens, result);
              sent.push({ uid: docSnap.id, prayer: 'AmalanReminder', successCount: result.successCount });
            }
          }
        }
      } catch (err) {
        errors.push({ uid: docSnap.id, error: err.message });
      }
    }

    return res.status(200).json({ checked: snap.size, sent, errors });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Gagal mengirim notifikasi.' });
  }
}
