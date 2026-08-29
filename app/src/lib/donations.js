import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Live-updating list of every campaign an admin has approved (see
// api/approve-masjid.js — that's the only place `donations/{id}` docs get
// created now; firestore.rules blocks client `create` entirely). Sorted
// newest-first client-side rather than via `orderBy` in the query itself,
// specifically to avoid needing a composite index for `where + orderBy` on
// different fields — fine at this campaign count, revisit if this list
// ever gets long enough that an unindexed sort becomes a real cost.
export function watchActiveDonations(callback) {
  const q = query(collection(db, 'donations'), where('status', '==', 'active'));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(rows);
  });
}

// Sandbox vs Production Snap.js is a different <script> URL entirely (not
// just a different key) — VITE_MIDTRANS_IS_PRODUCTION flips both this and
// the server-side base URL in api/create-midtrans-transaction.js together.
// Not set yet, so this loads the sandbox script for now. Shared here
// (rather than duplicated in Donasi.jsx and Home.jsx, both of which have
// their own donate buttons) so the script is only ever injected once.
const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
const MIDTRANS_SNAP_URL = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true'
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

let snapScriptPromise = null;
export function loadSnapScript() {
  if (window.snap) return Promise.resolve();
  if (!snapScriptPromise) {
    snapScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = MIDTRANS_SNAP_URL;
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
      script.onload = resolve;
      script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap.'));
      document.head.appendChild(script);
    });
  }
  return snapScriptPromise;
}

// Starts a real Midtrans Snap payment for a donate-button tap. Returns the
// Snap `token` to hand to `window.snap.pay()` — the actual crediting of
// `collected` and the personal contributions record both only happen
// server-side once Midtrans confirms the payment via a signature-verified
// webhook (api/midtrans-notify.js), never here and never from a client
// callback, since a client can't be trusted to honestly report "it
// worked" (closing the Snap popup early, or calling this with a fabricated
// success). See CLAUDE.md's payment-flow note for the full reasoning.
export async function createMidtransTransaction(donation, amount, user) {
  const res = await fetch('https://airmoon.vercel.app/api/create-midtrans-transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      donationId: donation.id,
      amount,
      uid: user?.uid || null,
      name: user?.displayName || undefined,
      email: user?.email || undefined,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal memulai pembayaran.');
  return data; // { token, orderId }
}

// Live-updating list of a user's own contributions, newest first.
export function watchMyContributions(uid, callback) {
  const q = query(collection(db, 'users', uid, 'contributions'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}
