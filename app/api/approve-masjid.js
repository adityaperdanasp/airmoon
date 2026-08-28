// Vercel serverless function — the publish half of "Daftarkan Masjid".
// Called by a Google Apps Script bound to the review Sheet (an onEdit
// trigger) the moment an admin sets a submission row's Status column to
// "Approved". Creates the real `donations/{id}` campaign doc via the
// Admin SDK, which bypasses firestore.rules entirely — that's deliberate:
// firestore.rules no longer allows clients to create a donation doc at
// all, so this endpoint (reachable only with MASJID_APPROVE_SECRET) is now
// the one path a new campaign can come from. See CLAUDE.md's "Daftarkan
// Masjid" note for the full pipeline (Form → Sheet → this).
//
// Reuses the same FIREBASE_SERVICE_ACCOUNT_B64 already set in Vercel for
// send-prayer-notifications.js — no separate Google credential needed for
// this half of the flow (the Form/Sheet/Drive half needs none either,
// since Google Forms writes to Sheets/Drive natively).

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 belum diset di Vercel.');
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

// Accepts a fairly loose shape since the caller is an Apps Script reading
// whatever columns the Google Form happened to create in the Sheet — the
// exact column headers depend on how the form's questions were worded, so
// the script maps them to this fixed set of keys before calling here
// rather than this endpoint guessing header names.
function validatePayload(body) {
  const required = ['title', 'plnId', 'target'];
  const missing = required.filter((k) => !body[k]);
  if (missing.length) throw new Error(`Field wajib belum ada: ${missing.join(', ')}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = req.headers['x-approve-secret'] || req.body?.secret;
  if (!process.env.MASJID_APPROVE_SECRET || secret !== process.env.MASJID_APPROVE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    initAdmin();
    const db = getFirestore();
    const body = req.body || {};
    validatePayload(body);

    const target = Number(body.target);
    if (!Number.isFinite(target) || target <= 0) {
      return res.status(400).json({ error: 'target harus angka positif.' });
    }

    const docData = {
      title: String(body.title).trim(),
      plnId: String(body.plnId).trim(),
      target,
      collected: 0,
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
    };
    // All optional — only stored if the sheet row actually had them.
    if (body.deadline) docData.deadline = String(body.deadline);
    if (body.locationUrl) docData.locationUrl = String(body.locationUrl);
    if (body.photoUrl) docData.photoUrl = String(body.photoUrl);
    if (body.meterPhotoUrl) docData.meterPhotoUrl = String(body.meterPhotoUrl);
    if (body.waPic) docData.waPic = String(body.waPic);
    if (body.submissionRow) docData.submissionRow = body.submissionRow; // for tracing back to the Sheet row

    const ref = await db.collection('donations').add(docData);
    return res.status(200).json({ ok: true, id: ref.id });
  } catch (err) {
    console.error('approve-masjid error:', err);
    return res.status(500).json({ error: err.message || 'Gagal publish campaign.' });
  }
}
