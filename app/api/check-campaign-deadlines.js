// Vercel serverless function — admin alert for "this campaign's deadline
// has passed". Triggered once a day by Vercel's own native Cron Jobs
// (see the `crons` entry in vercel.json) rather than the external
// cron-job.org pinger send-prayer-notifications.js needs — a daily check
// is exactly what a one-time deadline needs, and Vercel's own Cron Jobs
// (daily-only on the Hobby plan) are enough for that, so no third-party
// scheduler is needed here.
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
import { sendTelegramNotification } from './_lib/telegram.js';

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

    return res.status(200).json({ checked: snap.size, notified });
  } catch (err) {
    console.error('check-campaign-deadlines error:', err);
    return res.status(500).json({ error: err.message || 'Gagal cek deadline campaign.' });
  }
}
