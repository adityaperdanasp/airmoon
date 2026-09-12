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
//
// Also confirms "Sahabat airmoon" supporter purchases (2026-09-12,
// report.type === 'supporter') — sets isSupporter on the payer's profile
// instead of crediting a donation's `collected` field.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { appendLedgerRow } from './_lib/sheetsLedger.js';
import { notifyDonorsIfFunded } from './_lib/notifyDonorsFunded.js';

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

// Hadiahkan Sahabat airmoon (2026-09-12) — resolves a gift recipient's
// email to their uid via the Identity Toolkit REST API using the service
// account's own OAuth access token (from the admin app's credential we
// already initialize above), deliberately NOT `firebase-admin/auth`'s
// getUserByEmail(): that import pulls in jwks-rsa → the ESM-only `jose`
// package and crashed a different Vercel function in production with
// ERR_REQUIRE_ESM (see send-prayer-notifications.js's own note on the
// same issue) — this stays a plain fetch, no new import.
async function resolveUidByEmail(email) {
  const { credential } = getApps()[0].options;
  const { access_token: accessToken } = await credential.getAccessToken();
  const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ email: [email] }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.users?.[0]?.localId || null;
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

    const isSupporter = report.type === 'supporter';

    let giftRecipientNotFound = false;
    if (isSupporter) {
      // No `collected` to credit and no campaign to check "funded" against
      // — this just flips a status flag on the payer's own profile (or,
      // for a gifted purchase, the recipient's).
      // `supporterSince` only set the first time, so a repeat "Dukung
      // lagi" purchase later doesn't reset how long they've been one.
      let recipientUid = report.uid;
      if (report.giftRecipientEmail) {
        const resolved = await resolveUidByEmail(report.giftRecipientEmail);
        if (resolved) {
          recipientUid = resolved;
        } else {
          giftRecipientNotFound = true; // fall back to crediting the gifter, flagged in the response page below
        }
      }
      const userRef = db.collection('users').doc(recipientUid);
      const userSnap = await userRef.get();
      const update = { isSupporter: true };
      if (!userSnap.data()?.supporterSince) update.supporterSince = FieldValue.serverTimestamp();
      if (report.giftRecipientEmail && recipientUid !== report.uid) update.supporterGiftedBy = report.uid;
      await userRef.set(update, { merge: true });
    } else {
      await db.collection('donations').doc(report.donationId).set(
        { collected: FieldValue.increment(report.amount) },
        { merge: true }
      );
    }

    if (report.uid) {
      await db.collection('users').doc(report.uid).collection('contributions').add({
        donationId: report.donationId || null,
        donationTitle: report.donationTitle,
        amount: report.amount,
        manualPaymentId: id,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    await ref.set({ status: 'confirmed', confirmedAt: FieldValue.serverTimestamp() }, { merge: true });

    try {
      await appendLedgerRow({
        name: report.name || report.email || 'Anonim',
        method: report.method === 'gopay' ? 'GoPay' : 'Mandiri',
        amount: report.amount,
        campaign: report.donationTitle,
        reference: id,
      });
    } catch (err) {
      // Same reasoning as midtrans-notify.js -- a Sheets hiccup shouldn't
      // block the confirmation itself, which already succeeded above.
      console.error('appendLedgerRow failed:', err);
    }
    if (!isSupporter) {
      try {
        await notifyDonorsIfFunded(db, report.donationId);
      } catch (err) {
        console.error('notifyDonorsIfFunded failed:', err);
      }
    }

    return res.status(200).send(
      isSupporter
        ? page(
            'Terima kasih ✅',
            giftRecipientNotFound
              ? `Rp ${report.amount.toLocaleString('id-ID')} sudah dikonfirmasi, TAPI email hadiah "${report.giftRecipientEmail}" gak ketemu akunnya — status Sahabat airmoon dikasih ke akun si pengirim dulu, cek manual ya.`
              : report.giftRecipientEmail
              ? `Hadiah Sahabat airmoon buat ${report.giftRecipientEmail} udah aktif. Rp ${report.amount.toLocaleString('id-ID')} sudah dikonfirmasi — jazakallahu khairan!`
              : `Kamu resmi jadi Sahabat airmoon. Rp ${report.amount.toLocaleString('id-ID')} sudah dikonfirmasi — jazakallahu khairan!`
          )
        : page('Dikonfirmasi ✅', `Rp ${report.amount.toLocaleString('id-ID')} untuk "${report.donationTitle}" sudah ditambahkan ke angka terkumpul.`)
    );
  } catch (err) {
    console.error('confirm-manual-payment error:', err);
    return res.status(500).send(page('Error', err.message || 'Gagal memproses konfirmasi.'));
  }
}
