import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Dampak airmoon (2026-09-12) — a small public snapshot computed daily
// by check-campaign-deadlines.js's checkPublicImpactStats, via the
// Admin SDK (the real user COUNT has no client-side path at all —
// `users` is owner-read-only).
export function watchPublicImpactStats(callback) {
  return onSnapshot(doc(db, 'publicStats', 'impact'), (snap) => callback(snap.data() || null));
}
