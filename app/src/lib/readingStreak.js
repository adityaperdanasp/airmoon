// Streak Baca Qur'an — consecutive-day streak for actually opening the
// Qur'an (Mode Ayat or Mode Mushaf, either counts), same shape and
// idempotent-per-day logic as lib/dzikirStreak.js but a single field, not
// one per category — there's only one "did you read today" question
// here, not several habits to track separately. Deliberately distinct
// from lib/khatamProgress.js (that tracks WHICH pages, forever, never
// resets) and lib/readingGoal.js (a daily PAGE-COUNT target) — this is
// just "did you open the Qur'an at all today", the simplest possible
// signal, same spirit as the dzikir streaks.
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

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

export function watchReadingStreak(uid, callback) {
  if (!uid) {
    callback({ lastDate: null, current: 0, best: 0 });
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback((snap.exists() && snap.data().readingStreak) || { lastDate: null, current: 0, best: 0 });
  });
}

// Idempotent for the day — opening a 2nd/3rd surah or Mushaf page the
// same day is a no-op past the first call, so re-visiting doesn't inflate
// the streak. Called from both SurahReader.jsx and MushafReader.jsx's
// existing page-load effects (alongside markSurahOpened/markPageRead) —
// either mode counts, this doesn't care which.
export async function markReadingDone(uid) {
  if (!uid) return;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const s = (snap.exists() && snap.data().readingStreak) || { lastDate: null, current: 0, best: 0 };
  const today = todayKey();
  if (s.lastDate === today) return;

  const current = s.lastDate === yesterdayKey() ? s.current + 1 : 1;
  const best = Math.max(s.best || 0, current);
  await setDoc(ref, { readingStreak: { lastDate: today, current, best } }, { merge: true });
}

export function isReadingDoneToday(streak) {
  return streak?.lastDate === todayKey();
}
