// Vercel serverless function — the push side of KalkulatorZakat.jsx's
// Zakat Maal haul tracker. Zakat maal is only actually due once wealth has
// stayed above nisab for a full Hijri (lunar) year (~354 days, HAUL_DAYS
// in lib/zakatHaul.js), not just whenever it crosses the threshold — this
// checks daily for anyone whose haul just completed and hasn't been
// notified for this specific cycle yet.
//
// Triggered once a day by Vercel's own native Cron Jobs (vercel.json,
// offset 15 minutes after check-campaign-deadlines so they don't collide)
// — same reasoning as that function: a once-a-day check is enough for
// something measured in months, no need for the external cron-job.org
// pinger send-prayer-notifications.js relies on for its 5x-daily cadence.
//
// Auth: same dual pattern as check-campaign-deadlines.js — Vercel's own
// `Authorization: Bearer <CRON_SECRET>` cron header, or `?secret=`/
// `x-cron-secret` for manual/testing calls.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const HAUL_DAYS = 354;

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
  if (req.headers.authorization === `Bearer ${secret}`) return true;
  const provided = req.query.secret || req.headers['x-cron-secret'];
  return provided === secret;
}

function daysSince(dateStr) {
  const start = new Date(`${dateStr}T00:00:00Z`);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initAdmin();
    const db = getFirestore();
    const messaging = getMessaging();

    // zakatHaul is only ever set on users who've actually started a haul
    // countdown (KalkulatorZakat.jsx's "Tandai Mulai Haul Hari Ini") — most
    // users never touch this field, so filtering it out here keeps the
    // scan cheap rather than reading every single user doc.
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

    return res.status(200).json({ ok: true, notified, errors });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
