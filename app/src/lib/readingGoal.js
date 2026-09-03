// Target baca harian — a daily page-count goal connected to the existing
// Progress Khatam Qur'an tracker (lib/khatamProgress.js), but deliberately
// a SEPARATE field: khatam.pages is a lifetime "every distinct page ever
// visited" set (revisiting is a no-op there), while this is "how many
// Mushaf pages did I open TODAY" — a goal like "2 halaman/hari" needs the
// daily count to actually reset every day, which khatam.pages structurally
// can't do (and shouldn't — losing lifetime khatam progress at midnight
// would be a real regression).
import { doc, onSnapshot, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function watchReadingGoal(uid, callback) {
  if (!uid) {
    callback({ pagesPerDay: 0, lastDate: null, pagesToday: [] });
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    const g = snap.data()?.readingGoal;
    const today = todayDateKey();
    // A day rollover is resolved for DISPLAY purposes here even before
    // the next write resets it server-side — otherwise someone opening
    // the app the morning after hitting yesterday's goal would briefly
    // see yesterday's already-complete progress bar.
    const pagesToday = g?.lastDate === today ? g?.pagesToday || [] : [];
    callback({ pagesPerDay: g?.pagesPerDay || 0, lastDate: g?.lastDate || null, pagesToday });
  });
}

export async function setReadingGoalTarget(uid, pagesPerDay) {
  await setDoc(doc(db, 'users', uid), { readingGoal: { pagesPerDay } }, { merge: true });
}

// Called once per Mushaf page view (MushafReader.jsx's page-fetch effect,
// alongside markPageRead). A getDoc-before-write here (rather than a blind
// arrayUnion) is needed specifically to detect a day rollover and reset
// `pagesToday` — arrayUnion alone would just keep appending onto whatever
// was left over from a previous day forever.
export async function recordPageReadForGoal(uid, page) {
  if (!uid || !page) return;
  const ref = doc(db, 'users', uid);
  const today = todayDateKey();
  const snap = await getDoc(ref);
  const existing = snap.data()?.readingGoal;
  if (!existing || existing.lastDate !== today) {
    await setDoc(ref, { readingGoal: { pagesPerDay: existing?.pagesPerDay || 0, lastDate: today, pagesToday: [page] } }, { merge: true });
  } else if (!existing.pagesToday?.includes(page)) {
    await setDoc(ref, { readingGoal: { pagesToday: arrayUnion(page) } }, { merge: true });
  }
}
