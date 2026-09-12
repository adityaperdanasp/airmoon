// Consecutive-day streaks for Dzikir Pagi/Petang — a lightweight nudge to
// build the habit, not a strict attendance log: one tap a day per
// category ("Tandai Selesai") is all it tracks, no per-item completion.
// Stored on the same users/{uid} doc as everything else per-user
// (dzikirStreak: { pagi: {...}, petang: {...} }) — already covered by the
// existing "owner can read/write their own users/{uid} doc" Firestore
// rule, no rule change needed.

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { daysBetween, tryConsumeStreakFreeze } from './streakFreeze';

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayKey() {
  return dateKey(new Date());
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

export function watchDzikirStreak(uid, callback) {
  if (!uid) {
    callback({});
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback((snap.exists() && snap.data().dzikirStreak) || {});
  });
}

// Maps a streak category to its field on the SAME day's amalanHarian doc
// (users/{uid}/amalanHarian/{dateKey}) — see lib/amalanHarian.js's Poin &
// Medali note. Only 'pagi'/'petang' are real Amalan Harian items;
// anything else (there isn't another category today, but this stays
// defensive) is simply not scored.
const AMALAN_FIELD = { pagi: 'dzikirPagi', petang: 'dzikirPetang' };

// Idempotent for the day — tapping twice in the same day is a no-op past
// the first tap, so there's no way to inflate the streak by re-tapping.
export async function markDzikirDone(uid, categoryId) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const userData = snap.exists() ? snap.data() : {};
  const streaks = userData.dzikirStreak || {};
  const s = streaks[categoryId] || { lastDate: null, current: 0, best: 0 };
  const today = todayKey();
  if (s.lastDate === today) return;

  let current;
  if (s.lastDate === yesterdayKey()) {
    current = s.current + 1;
  } else if (s.lastDate && daysBetween(s.lastDate, today) === 2 && (await tryConsumeStreakFreeze(uid, userData))) {
    // Missed exactly one day, and this month's freeze hasn't been used
    // yet — the gap is covered, streak continues instead of resetting.
    current = s.current + 1;
  } else {
    current = 1;
  }
  const best = Math.max(s.best || 0, current);
  await setDoc(ref, { dzikirStreak: { ...streaks, [categoryId]: { lastDate: today, current, best } } }, { merge: true });

  const amalanField = AMALAN_FIELD[categoryId];
  if (amalanField) {
    await setDoc(doc(db, 'users', uid, 'amalanHarian', today), { [amalanField]: true }, { merge: true });
  }
}

export function isDoneToday(streak) {
  return streak?.lastDate === todayKey();
}
