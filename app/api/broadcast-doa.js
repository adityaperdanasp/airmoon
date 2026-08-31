// Vercel serverless function — pushes a real notification to every user's
// device when someone posts a new doa (per the founder's own ask: "masuk
// ke hp banyak orang", chosen over a feed-only option). Called by
// lib/doa.js's createDoa() right after the doa doc itself is written
// client-side — this endpoint only handles the broadcast side, never the
// post itself, and its failure must never be treated as the post failing
// (see createDoa's own try/catch around this call).
//
// A light per-poster cooldown (users/{uid}.lastDoaBroadcastAt) guards
// against one person spamming a push notification to literally every
// installed device back-to-back — the doa itself still gets posted and
// shows in the feed even when the cooldown blocks the broadcast, this
// only throttles the "ping everyone's phone" side effect.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between broadcasts from the same poster
const MULTICAST_CHUNK = 500; // Firebase Admin's own per-call limit

function initAdmin() {
  if (getApps().length) return;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  initializeApp({ credential: cert(serviceAccount) });
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { doaId, text, uid } = req.body || {};
  if (!doaId || !text || !uid) {
    return res.status(400).json({ error: 'doaId, text, dan uid wajib diisi.' });
  }

  try {
    initAdmin();
    const db = getFirestore();

    const posterRef = db.collection('users').doc(uid);
    const posterSnap = await posterRef.get();
    const lastBroadcastAt = posterSnap.data()?.lastDoaBroadcastAt?.toMillis?.() || 0;
    if (Date.now() - lastBroadcastAt < COOLDOWN_MS) {
      return res.status(200).json({ ok: true, skipped: 'cooldown' });
    }

    const usersSnap = await db.collection('users').get();
    const tokens = [];
    for (const docSnap of usersSnap.docs) {
      const t = docSnap.data().fcmTokens || [];
      tokens.push(...t);
    }
    if (!tokens.length) {
      return res.status(200).json({ ok: true, skipped: 'no tokens' });
    }

    const messaging = getMessaging();
    const preview = text.length > 100 ? text.slice(0, 100) + '…' : text;
    let successCount = 0;
    for (const batch of chunk(tokens, MULTICAST_CHUNK)) {
      // Data-only, same reasoning as send-prayer-notifications.js — keeps
      // display fully in our own hands (web service worker + native app)
      // instead of the OS auto-showing it with default sound/channel.
      const result = await messaging.sendEachForMulticast({
        tokens: batch,
        data: { tag: `doa-${doaId}`, doaId, title: '🤲 Doa baru dari sesama muslim', body: preview },
      });
      successCount += result.successCount;
    }

    await posterRef.set({ lastDoaBroadcastAt: FieldValue.serverTimestamp() }, { merge: true });

    return res.status(200).json({ ok: true, tokenCount: tokens.length, successCount });
  } catch (err) {
    console.error('broadcast-doa error:', err);
    return res.status(500).json({ error: err.message || 'Gagal broadcast.' });
  }
}
