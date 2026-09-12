import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Streak freeze (2026-09-12) — a standard habit-app retention tactic:
// missing exactly one day no longer resets a streak, as long as the
// user hasn't already used their one freeze this calendar month. Shared
// across every streak type (dzikir pagi/petang, reading) — one freeze
// per person per month total, not one per streak, so someone can't stack
// several. Deliberately automatic/silent (no button to press, no
// separate "activate" step) — the whole point is protecting a streak
// someone didn't even realize was at risk until it's already saved.
function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function daysBetween(dateStrA, dateStrB) {
  const a = new Date(`${dateStrA}T00:00:00`);
  const b = new Date(`${dateStrB}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

// `userData` is the already-fetched users/{uid} doc data (callers here
// already have it from their own getDoc, no reason for a second read).
// Returns true (and consumes the freeze) only the first time this is
// called in a given calendar month.
export async function tryConsumeStreakFreeze(uid, userData) {
  const currentMonth = monthKey();
  if (userData?.lastStreakFreezeMonth === currentMonth) return false;
  await setDoc(doc(db, 'users', uid), { lastStreakFreezeMonth: currentMonth }, { merge: true });
  return true;
}
