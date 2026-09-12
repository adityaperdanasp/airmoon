// Vercel serverless function — interim manual-transfer path (GoPay/
// Mandiri, the founder's own accounts) while waiting on Midtrans
// Production approval. A donor picks this instead of Snap, sees the
// account details, transfers for real outside the app, then reports it
// here. This does NOT credit `collected` — it can't, since a client
// self-reporting "I paid" is exactly the thing this whole payment
// pipeline was built to not trust (see midtrans-notify.js's own header
// comment). It just creates a pending record and pings the founder on
// Telegram with a confirm link (api/confirm-manual-payment.js) they tap
// after actually checking their own bank/GoPay app.
//
// Also backs the "Sahabat airmoon" supporter tier (2026-09-12,
// `type: 'supporter'`) — same manual-transfer/Telegram-confirm shape,
// just no `donationId` (there's no campaign being credited, only a
// status flag on the payer's own profile once confirm-manual-payment.js
// processes it).

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { randomBytes } from 'crypto';

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('Telegram not configured — skipping notify.');
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) console.error('Telegram send failed:', await res.text());
  } catch (err) {
    console.error('Telegram send error:', err);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { donationId, amount, method, uid, name, email, type, giftRecipientEmail } = req.body || {};
  const isSupporter = type === 'supporter';
  const amountNum = Number(amount);
  if ((!isSupporter && !donationId) || !Number.isFinite(amountNum) || amountNum <= 0 || !['gopay', 'mandiri'].includes(method)) {
    return res.status(400).json({ error: 'donationId, amount (angka positif), dan method (gopay/mandiri) wajib diisi.' });
  }
  if (!uid) {
    return res.status(400).json({ error: 'Masuk dulu buat lapor transfer.' });
  }

  try {
    initAdmin();
    const db = getFirestore();

    let donationTitle = 'Dukungan Sahabat airmoon';
    if (!isSupporter) {
      const donationSnap = await db.collection('donations').doc(donationId).get();
      if (!donationSnap.exists) {
        return res.status(404).json({ error: 'Campaign tidak ditemukan.' });
      }
      donationTitle = donationSnap.data().title;
    }

    const confirmSecret = randomBytes(16).toString('hex');
    const ref = await db.collection('manualPayments').add({
      type: isSupporter ? 'supporter' : 'donation',
      donationId: donationId || null,
      donationTitle,
      amount: amountNum,
      method,
      uid,
      name: name || null,
      email: email || null,
      giftRecipientEmail: isSupporter && giftRecipientEmail ? String(giftRecipientEmail).trim().toLowerCase() : null,
      status: 'pending',
      confirmSecret,
      createdAt: FieldValue.serverTimestamp(),
    });

    const confirmUrl = `https://airmoon.vercel.app/api/confirm-manual-payment?id=${ref.id}&secret=${confirmSecret}`;
    const giftLine = isSupporter && giftRecipientEmail ? `\n🎁 Hadiah buat: ${giftRecipientEmail}` : '';
    await sendTelegramMessage(
      `🔔 Ada laporan transfer manual\n\n${isSupporter ? 'Jenis: Sahabat airmoon (supporter)' : `Campaign: ${donationTitle}`}\nJumlah: Rp ${amountNum.toLocaleString('id-ID')}\nVia: ${method === 'gopay' ? 'GoPay' : 'Mandiri'}\nDari: ${name || email || uid}${giftLine}\n\nCek dulu rekening/GoPay lo — kalau uangnya beneran udah masuk, baru tap link ini buat konfirmasi:\n${confirmUrl}`
    );

    return res.status(200).json({ ok: true, id: ref.id });
  } catch (err) {
    console.error('report-manual-payment error:', err);
    return res.status(500).json({ error: err.message || 'Gagal melapor transfer.' });
  }
}
