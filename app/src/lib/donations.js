import { collection, query, where, orderBy, onSnapshot, doc, setDoc } from 'firebase/firestore';
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

// Interim manual-transfer path (GoPay/Mandiri, the founder's own
// accounts) while waiting on Midtrans Production approval — see
// api/report-manual-payment.js for why this never credits `collected`
// itself, just files a pending report and pings the founder on Telegram
// to confirm after actually checking their bank/GoPay app.
export async function reportManualPayment(donation, amount, method, user) {
  const res = await fetch('https://airmoon.vercel.app/api/report-manual-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      donationId: donation.id,
      amount,
      method,
      uid: user?.uid || null,
      name: user?.displayName || undefined,
      email: user?.email || undefined,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal melapor transfer.');
  return data;
}

// Live-updating list of a user's own contributions, newest first.
export function watchMyContributions(uid, callback) {
  const q = query(collection(db, 'users', uid, 'contributions'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

// "Pengingat Donasi Bulanan" — deliberately a REMINDER, not real recurring
// billing. Actually auto-charging someone's card every month needs a
// tokenized/saved payment method and Midtrans's own subscription API,
// neither of which this app has — building a fake "berlangganan otomatis"
// label on top of a plain reminder would misrepresent what happens with
// someone's money. What this really does: save a monthly target amount,
// and once a month (folded into check-campaign-deadlines.js's existing
// daily cron, same 12-function Hobby-plan reasoning as the zakat haul/
// Jumat reminders) send a push nudging the user back to Donasi — they
// still tap through and confirm the actual payment themselves every time,
// same Midtrans Snap/manual-transfer flow as any other donation.
export function watchMonthlyPledge(uid, callback) {
  if (!uid) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(snap.data()?.monthlyPledge || null));
}

export async function setMonthlyPledge(uid, amount) {
  await setDoc(doc(db, 'users', uid), { monthlyPledge: { amount, active: true, createdAt: new Date().toISOString() } }, { merge: true });
}

export async function cancelMonthlyPledge(uid) {
  await setDoc(doc(db, 'users', uid), { monthlyPledge: null }, { merge: true });
}
