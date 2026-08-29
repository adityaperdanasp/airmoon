// Vercel serverless function — Midtrans calls this server-to-server the
// moment a payment's status changes (paid, expired, denied, ...). This is
// the ONLY place `donations/{id}.collected` gets incremented for a real
// payment, and the ONLY place a `users/{uid}/contributions` record gets
// created for one — never from the client, and never from
// create-midtrans-transaction.js, specifically so a real donation can't be
// faked by calling an endpoint directly or closing the Snap popup early.
//
// Signature verification (per Midtrans docs) is what makes this endpoint
// trustworthy despite having no auth header: sha512(order_id + status_code
// + gross_amount + ServerKey) must match what Midtrans sent. Without this
// check, anyone who found this URL could POST a fake "settlement" body and
// credit themselves an arbitrary amount.

import { createHash } from 'crypto';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

function isPaid(body) {
  if (body.transaction_status === 'capture') return body.fraud_status === 'accept';
  return body.transaction_status === 'settlement';
}

function isFinalFailure(body) {
  return ['expire', 'cancel', 'deny'].includes(body.transaction_status);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    return res.status(500).json({ error: 'MIDTRANS_SERVER_KEY belum diset di Vercel.' });
  }

  const body = req.body || {};
  const { order_id, status_code, gross_amount, signature_key } = body;
  if (!order_id || !status_code || !gross_amount || !signature_key) {
    return res.status(400).json({ error: 'Payload tidak lengkap.' });
  }

  const expectedSignature = createHash('sha512')
    .update(order_id + status_code + gross_amount + serverKey)
    .digest('hex');
  if (signature_key !== expectedSignature) {
    console.error('Midtrans webhook: invalid signature for order', order_id);
    return res.status(403).json({ error: 'Invalid signature.' });
  }

  try {
    initAdmin();
    const db = getFirestore();
    const txnRef = db.collection('paymentTransactions').doc(order_id);
    const txnSnap = await txnRef.get();
    if (!txnSnap.exists) {
      return res.status(404).json({ error: 'Transaksi tidak dikenal.' });
    }
    const txn = txnSnap.data();

    // Idempotency: Midtrans retries notifications, and a transaction can
    // legitimately receive multiple callbacks (pending -> settlement) —
    // only ever apply the "paid" credit once per order_id.
    if (txn.status === 'paid') {
      return res.status(200).json({ ok: true, note: 'already processed' });
    }

    if (isPaid(body)) {
      await db.collection('donations').doc(txn.donationId).set(
        { collected: FieldValue.increment(txn.amount) },
        { merge: true }
      );
      if (txn.uid) {
        await db.collection('users').doc(txn.uid).collection('contributions').add({
          donationId: txn.donationId,
          donationTitle: txn.donationTitle,
          amount: txn.amount,
          orderId: order_id,
          createdAt: FieldValue.serverTimestamp(),
        });
      }
      await txnRef.set({ status: 'paid', midtransStatus: body.transaction_status }, { merge: true });
    } else if (isFinalFailure(body)) {
      await txnRef.set({ status: 'failed', midtransStatus: body.transaction_status }, { merge: true });
    } else {
      // e.g. still "pending" for an unpaid VA — just record the latest
      // known status, no credit yet.
      await txnRef.set({ midtransStatus: body.transaction_status }, { merge: true });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('midtrans-notify error:', err);
    return res.status(500).json({ error: err.message || 'Gagal memproses notifikasi.' });
  }
}
