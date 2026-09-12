import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Referral leaderboard (2026-09-12) — a small public snapshot
// ({name, count}, no uid/email) computed once a day by
// check-campaign-deadlines.js via the Admin SDK. Not a live client query
// over `users` — that collection is owner-read-only, and even without
// that restriction, an open query exposing every user's referralCount
// would leak more than a curated top-10 snapshot needs to.
export function watchReferralLeaderboard(callback) {
  return onSnapshot(doc(db, 'leaderboards', 'referral'), (snap) => callback(snap.data()?.top || []));
}
