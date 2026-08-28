import { doc, setDoc, increment, collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from 'firebase/firestore';
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

export async function contribute(donationId, amount) {
  const ref = doc(db, 'donations', donationId);
  // firestore.rules only allows a signed-in client to touch this one field
  // on an existing campaign doc — everything else (title, target,
  // deadline, creating a brand new campaign) is admin-only now.
  await setDoc(ref, { collected: increment(amount) }, { merge: true });
}

// Personal record of a single contribution, kept under the giver's own
// profile (users/{uid}/contributions) — separate from the campaign's
// aggregate `collected` counter above, which has no per-giver breakdown.
export async function recordContribution(uid, donation, amount) {
  await addDoc(collection(db, 'users', uid, 'contributions'), {
    donationId: donation.id,
    donationTitle: donation.title,
    amount,
    createdAt: serverTimestamp(),
  });
}

// Live-updating list of a user's own contributions, newest first.
export function watchMyContributions(uid, callback) {
  const q = query(collection(db, 'users', uid, 'contributions'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}
