// Lightweight "is there something new since I last looked" signal for
// BottomNav's dot badges — Home (new doa or new active campaign) and
// Donasi (new active campaign). Deliberately not a real read/unread
// system (no per-item tracking, no Firestore writes) — just a single
// localStorage timestamp per section, compared against the newest
// matching doc's createdAt. markSeen() is called when the relevant page
// actually mounts, so the dot naturally clears once someone visits.
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const KEYS = { doa: 'airmoon-lastseen-doa', donasi: 'airmoon-lastseen-donasi' };

function getLastSeen(section) {
  return Number(localStorage.getItem(KEYS[section])) || 0;
}

export function markSeen(section) {
  try {
    localStorage.setItem(KEYS[section], String(Date.now()));
  } catch {
    // Private-browsing/full storage — badge just won't clear this session, not fatal.
  }
}

export function watchHasNewDoa(callback) {
  const q = query(collection(db, 'doas'), orderBy('createdAt', 'desc'), limit(1));
  return onSnapshot(q, (snap) => {
    const ts = snap.docs[0]?.data()?.createdAt?.toMillis?.() ?? 0;
    callback(ts > getLastSeen('doa'));
  });
}

// Same where('status','==','active') + client-side max, no `orderBy` in
// the query itself — matches lib/donations.js's watchActiveDonations()
// exactly, deliberately, to avoid needing a composite index for a
// where+orderBy combination this app has never needed at its campaign
// count so far.
export function watchHasNewDonasi(callback) {
  const q = query(collection(db, 'donations'), where('status', '==', 'active'));
  return onSnapshot(q, (snap) => {
    const latest = snap.docs.reduce((max, d) => Math.max(max, d.data().createdAt?.seconds ?? 0), 0) * 1000;
    callback(latest > getLastSeen('donasi'));
  });
}
