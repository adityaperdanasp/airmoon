// Vercel serverless function — the link the founder taps from the
// Telegram notification (see report-manual-payment.js), AFTER actually
// checking their own bank/GoPay app and seeing the money really arrived.
// This is the only place a manual-transfer report actually credits
// `collected` and creates a contributions record — a plain GET so it
// works from any device just by tapping the link, no login needed on
// that device (the confirmSecret in the URL is what authorizes it,
// scoped to this one report, generated server-side, never guessable).
//
// Returns a plain HTML page (not JSON) since a human opens this directly
// in a browser from Telegram, not a fetch() call.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

function page(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>body{font-family:system-ui,sans-serif;max-width:420px;margin:60px auto;padding:0 20px;text-align:center;color:#1a1a1a}
h1{font-size:20px}p{color:#555;line-height:1.5}</style></head>
<body><h1>${title}</h1><p>${body}</p></body></html>`;
}

export default async function handler(req, res) {
  const { id, secret } = req.query;
  if (!id || !secret) {
    return res.status(400).send(page('Link tidak lengkap', 'ID atau secret hilang dari link ini.'));
  }

  try {
    initAdmin();
    const db = getFirestore();
    const ref = db.collection('manualPayments').doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return res.status(404).send(page('Tidak ditemukan', 'Laporan transfer ini tidak ada di database.'));
    }
    const report = snap.data();

    if (report.confirmSecret !== secret) {
      return res.status(403).send(page('Ditolak', 'Secret tidak cocok — link ini bukan buat laporan ini.'));
    }

    if (report.status === 'confirmed') {
      return res.status(200).send(page('Sudah dikonfirmasi', `Laporan ini sudah dikonfirmasi sebelumnya. Rp ${report.amount.toLocaleString('id-ID')} untuk "${report.donationTitle}".`));
    }

    await db.collection('donations').doc(report.donationId).set(
      { collected: FieldValue.increment(report.amount) },
      { merge: true }
    );
    if (report.uid) {
      await db.collection('users').doc(report.uid).collection('contributions').add({
        donationId: report.donationId,
        donationTitle: report.donationTitle,
        amount: report.amount,
        manualPaymentId: id,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    await ref.set({ status: 'confirmed', confirmedAt: FieldValue.serverTimestamp() }, { merge: true });

    return res.status(200).send(
      page('Dikonfirmasi ✅', `Rp ${report.amount.toLocaleString('id-ID')} untuk "${report.donationTitle}" sudah ditambahkan ke angka terkumpul.`)
    );
  } catch (err) {
    console.error('confirm-manual-payment error:', err);
    return res.status(500).send(page('Error', err.message || 'Gagal memproses konfirmasi.'));
  }
}
