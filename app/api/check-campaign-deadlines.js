// Vercel serverless function — the daily admin/user checks that don't need
// anything finer-grained than once a day: (1) campaign deadlines that just
// passed (admin Telegram alert), (2) zakat maal haul countdowns that just
// completed, (3) the Friday Al-Kahf reminder, and (4) the monthly donation
// pledge reminder — (2), (3), and (4) are real FCM pushes to the user
// themselves. All four live in one function/one cron entry deliberately —
// the Hobby plan caps a deployment at 12 Serverless Functions total, and
// this repo was already at that cap, so a separate daily-cron function for
// any one of these alone would have pushed a `vercel --prod` deploy over
// the limit (hit for real, 2026-09-02: "No more than 12 Serverless
// Functions can be added..."). None of the four is time-sensitive enough
// to need its own schedule, so merging them costs nothing.
//
// Triggered once a day by Vercel's own native Cron Jobs (see the `crons`
// entry in vercel.json) rather than the external cron-job.org pinger
// send-prayer-notifications.js needs — a daily check is enough for both a
// one-time deadline and a haul measured in months, and Vercel's own Cron
// Jobs (daily-only on the Hobby plan) cover that fine.
//
// Auth accepts two forms so this works both from Vercel's own scheduler
// and from manual/testing calls: Vercel automatically sends
// `Authorization: Bearer <CRON_SECRET>` for cron-invoked functions when an
// env var literally named CRON_SECRET exists on the project (its own
// documented convention, specifically so the secret never has to be
// written into vercel.json, which is committed to the repo) — falls back
// to the same `?secret=`/`x-cron-secret` pattern send-prayer-
// notifications.js already uses for anyone testing this by hand.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { sendTelegramNotification } from './_lib/telegram.js';

const HAUL_DAYS = 354; // a Hijri (lunar) year, not the Gregorian 365 this app's dates otherwise run on

function daysSince(dateStr) {
  const start = new Date(`${dateStr}T00:00:00Z`);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
}

// Zakat maal is only due once wealth has stayed above nisab for a full
// haul — see lib/zakatHaul.js (client) for the countdown UI this backs.
async function checkZakatHaul(db) {
  const messaging = getMessaging();
  const snap = await db.collection('users').where('zakatHaul', '!=', null).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const haul = u.zakatHaul;
      const tokens = u.fcmTokens || [];
      if (!haul?.startDate || !tokens.length) continue;

      const elapsed = daysSince(haul.startDate);
      const alreadyNotifiedThisCycle = haul.lastNotifiedCycle === haul.startDate;
      if (elapsed < HAUL_DAYS || alreadyNotifiedThisCycle) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'zakat-haul',
          title: '🌙 Sudah 1 Haul',
          body: 'Harta kamu sudah mengendap 1 tahun di atas nisab — saatnya cek & bayar zakat maal.',
        },
      });

      await docSnap.ref.update({ 'zakatHaul.lastNotifiedCycle': haul.startDate });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Sunnah Jumat reminder — surah Al-Kahf. Only fires when this cron's own
// run date (Asia/Jakarta, matching how the rest of this app reasons about
// "today" — see lib/prayerApi.js/nowInTimezone in send-prayer-
// notifications.js) is a Friday; every other day of the week this is a
// no-op. lastJumatReminderDate makes it idempotent per calendar date
// rather than per-run, so a manual re-trigger the same Friday doesn't
// double-send.
function todayInJakarta() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return { dateKey: `${get('year')}-${get('month')}-${get('day')}`, weekday: get('weekday') };
}

async function checkJumatReminder(db) {
  const { dateKey, weekday } = todayInJakarta();
  if (weekday !== 'Fri') return { skipped: 'not-friday' };

  const messaging = getMessaging();
  const snap = await db.collection('users').where('notifEnabled', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const tokens = u.fcmTokens || [];
      if (!tokens.length || u.lastJumatReminderDate === dateKey) continue;

      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'jumat-al-kahf',
          title: '📖 Selamat Hari Jumat',
          body: 'Yuk sempatkan baca Surah Al-Kahf hari ini — sunnah Rasulullah ﷺ tiap Jumat.',
        },
      });

      await docSnap.ref.update({ lastJumatReminderDate: dateKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

// Monthly donation reminder (2026-09-04) — see lib/donations.js's
// watchMonthlyPledge for why this is a reminder push, not real recurring
// billing. Idempotent per calendar month via lastPledgeReminderMonth
// (Asia/Jakarta, same helper as the Jumat check below) rather than "30
// days since last reminder", so it can't drift later into the month on
// every run the way a rolling day-count would.
async function checkMonthlyPledgeReminders(db) {
  const { dateKey } = todayInJakarta();
  const monthKey = dateKey.slice(0, 7); // YYYY-MM
  const messaging = getMessaging();
  const snap = await db.collection('users').where('monthlyPledge.active', '==', true).get();
  const notified = [];
  const errors = [];

  for (const docSnap of snap.docs) {
    try {
      const u = docSnap.data();
      const pledge = u.monthlyPledge;
      const tokens = u.fcmTokens || [];
      if (!tokens.length || !pledge?.amount || u.lastPledgeReminderMonth === monthKey) continue;

      const amountStr = `Rp ${Number(pledge.amount).toLocaleString('id-ID')}`;
      const result = await messaging.sendEachForMulticast({
        tokens,
        data: {
          tag: 'pledge-reminder',
          title: '🔔 Waktunya Donasi Bulanan',
          body: `Yuk lanjutkan sedekah rutin kamu bulan ini — ${amountStr}.`,
        },
      });

      await docSnap.ref.update({ lastPledgeReminderMonth: monthKey });

      const deadTokens = result.responses.map((r, i) => (!r.success ? tokens[i] : null)).filter(Boolean);
      if (deadTokens.length) {
        await docSnap.ref.update({ fcmTokens: FieldValue.arrayRemove(...deadTokens) });
      }

      notified.push({ uid: docSnap.id, successCount: result.successCount });
    } catch (err) {
      errors.push({ uid: docSnap.id, error: err.message });
    }
  }

  return { notified, errors };
}

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 belum diset di Vercel.');
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

function isAuthorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (req.headers.authorization === `Bearer ${secret}`) return true; // Vercel's own cron invocation
  const provided = req.query.secret || req.headers['x-cron-secret'];
  return provided === secret;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initAdmin();
    const db = getFirestore();
    const now = new Date();

    const snap = await db.collection('donations').where('status', '==', 'active').get();
    const notified = [];

    for (const docSnap of snap.docs) {
      const d = docSnap.data();
      if (!d.deadline || d.deadlineNotified) continue;

      const deadlineDate = new Date(d.deadline);
      if (Number.isNaN(deadlineDate.getTime()) || deadlineDate > now) continue;

      const collected = d.collected || 0;
      const target = d.target || 0;
      const percent = target > 0 ? Math.round((collected / target) * 100) : 0;

      await sendTelegramNotification(
        `⏰ Deadline campaign udah lewat!\n\n` +
          `${d.title}\n` +
          `Terkumpul: Rp ${collected.toLocaleString('id-ID')} dari target Rp ${target.toLocaleString('id-ID')} (${percent}%)\n` +
          `Batas waktu: ${deadlineDate.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n` +
          `Yuk cek & tindak lanjuti (perpanjang, tutup, atau arsipkan) campaign ini.`
      );

      await docSnap.ref.update({ deadlineNotified: true });
      notified.push({ id: docSnap.id, title: d.title });
    }

    const haulResult = await checkZakatHaul(db);
    const jumatResult = await checkJumatReminder(db);
    const pledgeResult = await checkMonthlyPledgeReminders(db);

    return res.status(200).json({
      checked: snap.size,
      notified,
      zakatHaul: haulResult,
      jumatReminder: jumatResult,
      pledgeReminder: pledgeResult,
    });
  } catch (err) {
    console.error('check-campaign-deadlines error:', err);
    return res.status(500).json({ error: err.message || 'Gagal cek deadline campaign.' });
  }
}
