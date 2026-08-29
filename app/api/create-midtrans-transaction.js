// Vercel serverless function — starts a real Midtrans Snap payment for a
// donation tap (+10rb/+25rb/+50rb in Donasi.jsx). Returns a Snap `token`
// the frontend hands to `window.snap.pay()`.
//
// This replaces the old flow where tapping a donate button directly
// incremented `donations/{id}.collected` client-side (see lib/donations.js
// history) — that was always a placeholder, no real money ever moved. Now
// `collected` only gets incremented by api/midtrans-notify.js, once
// Midtrans actually confirms the payment succeeded (server-to-server
// webhook, signature-verified) — never from this endpoint or the client,
// since a client-reported "it worked" can't be trusted (someone could
// close the Snap popup before paying and still fire a success callback).
//
// Sandbox vs Production is which base URL/keys are configured — nothing
// else in this code changes when the founder eventually gets Production
// keys. MIDTRANS_IS_PRODUCTION=true switches both.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

const IS_PROD = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const SNAP_BASE = IS_PROD ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return res.status(500).json({ error: 'MIDTRANS_SERVER_KEY belum diset di Vercel.' });
  }

  const { donationId, amount, uid, name, email } = req.body || {};
  const amountNum = Number(amount);
  if (!donationId || !Number.isFinite(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: 'donationId dan amount (angka positif) wajib diisi.' });
  }

  try {
    initAdmin();
    const db = getFirestore();

    const donationSnap = await db.collection('donations').doc(donationId).get();
    if (!donationSnap.exists) {
      return res.status(404).json({ error: 'Campaign tidak ditemukan.' });
    }
    const donation = donationSnap.data();

    // order_id has to be unique per attempt — Midtrans rejects a reused
    // one. Using our own Firestore-generated id (not a random string) so
    // the webhook can look this exact doc back up by order_id later.
    const txnRef = db.collection('paymentTransactions').doc();
    const orderId = txnRef.id;

    const midtransRes = await fetch(`${SNAP_BASE}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(serverKey + ':').toString('base64'),
      },
      body: JSON.stringify({
        transaction_details: { order_id: orderId, gross_amount: amountNum },
        item_details: [{ id: donationId, price: amountNum, quantity: 1, name: donation.title.slice(0, 50) }],
        customer_details: { first_name: name || 'Donatur airmoon', email: email || undefined },
      }),
    });

    const midtransData = await midtransRes.json();
    if (!midtransRes.ok || !midtransData.token) {
      console.error('Midtrans error:', midtransData);
      return res.status(502).json({ error: midtransData.error_messages?.join(', ') || 'Gagal membuat transaksi Midtrans.' });
    }

    // Pending record the webhook will look up by order_id (== this doc's
    // id) once Midtrans notifies us of the actual outcome.
    await txnRef.set({
      donationId,
      donationTitle: donation.title,
      amount: amountNum,
      uid: uid || null,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ token: midtransData.token, orderId });
  } catch (err) {
    console.error('create-midtrans-transaction error:', err);
    return res.status(500).json({ error: err.message || 'Gagal membuat transaksi.' });
  }
}
