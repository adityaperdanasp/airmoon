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
// user doc so re-running this every minute doesn't double-send.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { pickPrayerMessage } from './_lib/prayerMessages.js';

const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABEL = { Fajr: 'Subuh', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya' };

// Minutes a prayer stays "due" after its exact time — catches cron runs
// that don't land on the exact minute, without needing a 1-minute cron.
const WINDOW_MINUTES = 10;

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

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

        const { timings, meta } = alJson.data;
        const { dateKey, minutes: nowMin } = nowInTimezone(meta.timezone);
        const lastNotified = u.lastNotified || {};

        for (const key of PRAYER_ORDER) {
          const prayerMin = minutesSinceMidnight(timings[key]);
          const due = nowMin >= prayerMin && nowMin < prayerMin + WINDOW_MINUTES;
          const alreadySent = lastNotified.date === dateKey && lastNotified.prayer === key;
          if (!due || alreadySent) continue;

          const label = PRAYER_LABEL[key];
          const prayerIndex = PRAYER_ORDER.indexOf(key);
          const result = await messaging.sendEachForMulticast({
            tokens,
            notification: {
              title: `Waktunya Sholat ${label}`,
              body: pickPrayerMessage(dateKey, prayerIndex, label),
            },
            data: { tag: `adzan-${key}` },
          });

          await docSnap.ref.update({ lastNotified: { date: dateKey, prayer: key } });

          // Prune tokens FCM reports as dead (uninstalled app, expired
          // subscription) so this array doesn't grow unbounded with junk.
          const deadTokens = result.responses
            .map((r, i) => (!r.success ? tokens[i] : null))
            .filter(Boolean);
          if (deadTokens.length) {
            await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
          }

          sent.push({ uid: docSnap.id, prayer: key, successCount: result.successCount });
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
