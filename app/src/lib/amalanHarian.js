// A unified "did I do today's ibadah" checklist for Home — sholat, Dzikir
// Pagi/Petang (reusing lib/dzikirStreak.js's existing per-day tracking,
// not duplicating it), and tilawah, all in one glanceable card instead of
// scattered across separate pages someone has to remember to check.
//
// Sholat and tilawah get their own manual per-day doc here
// (users/{uid}/amalanHarian/{dateKey}) rather than being auto-inferred
// from other data — there's no reliable existing signal for either
// ("moved the last-read bookmark" isn't the same as "actually read
// something today", and this app has never tracked prayer completion at
// all) — a deliberate, honest manual checklist beats a fragile guess.
//
// Poin & Medali (2026-09-06) — dzikirStreak.js's markDzikirDone() now also
// writes dzikirPagi/dzikirPetang into this same per-day doc (see that
// file), and a new loginPoint field is set once/day just for opening the
// app — this is what unlocked scoring the full 9 items (was capped at 6:
// only sholat+tilawah, since dzikir's per-day status genuinely didn't
// exist anywhere before this). A day recorded before this change simply
// has no dzikirPagi/dzikirPetang/loginPoint fields and scores lower —
// honest under-counting of real history, not a bug, since that data was
// never captured.

import { doc, onSnapshot, setDoc, getDoc, collection, getDocs, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Activation metric (2026-09-12) — "did onboarding actually work" had no
// answer without a full analytics suite, which this app doesn't have.
// A plain, queryable Firestore field is a real (if blunt) substitute: a
// user counts as activated once they've opened the app on 2 distinct
// days — not just once, which barely distinguishes a curious visitor
// from someone who's actually coming back. `loginDayCount` only
// increments on the days markLoginPoint below actually awards the point
// (already guarded to once/day), so this never double-counts.
const ACTIVATION_LOGIN_DAYS = 2;

export const SHOLAT_KEYS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
export const SHOLAT_LABELS = { subuh: 'Subuh', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' };

// 5 sholat + tilawah + dzikir pagi + dzikir petang + 1 login point.
export const DAILY_POINTS_MAX = SHOLAT_KEYS.length + 4;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Shared by fetchRecentAmalanHarian (heatmap) and fetchTotalPoints
// (lifetime tally) so the two never drift apart on what counts as a
// point. Exported too — components/AmalanCalendarView.jsx (Kalender
// Ibadah) and fetchMonthlyPointsComparison below both need the same
// per-day math, not a re-implementation that could quietly drift.
export function scoreForDay(data) {
  const sholatDone = SHOLAT_KEYS.filter((k) => data.sholat?.[k]).length;
  return (
    sholatDone +
    (data.tilawah ? 1 : 0) +
    (data.dzikirPagi ? 1 : 0) +
    (data.dzikirPetang ? 1 : 0) +
    (data.loginPoint ? 1 : 0)
  );
}

export function watchAmalanHarian(uid, callback) {
  if (!uid) {
    callback({ sholat: {}, tilawah: false });
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid, 'amalanHarian', todayKey()), (snap) => {
    callback(snap.exists() ? snap.data() : { sholat: {}, tilawah: false });
  });
}

export async function setSholatDone(uid, waktu, done) {
  await setDoc(doc(db, 'users', uid, 'amalanHarian', todayKey()), { sholat: { [waktu]: done } }, { merge: true });
}

export async function setTilawahDone(uid, done) {
  await setDoc(doc(db, 'users', uid, 'amalanHarian', todayKey()), { tilawah: done }, { merge: true });
}

// +1 poin buat sekadar buka/login ke app hari ini — idempotent per hari
// (getDoc-before-write, same reasoning as lib/readingGoal.js's own
// day-rollover check: a blind arrayUnion-style write can't tell "already
// awarded today" from "never awarded", but a plain boolean field can, as
// long as we check it first rather than just setDoc-ing `true` again for
// free — setDoc-ing an already-true field is harmless, but skipping the
// call after finding it already true one fewer Firestore write per app
// open once the point's been given).
export async function markLoginPoint(uid) {
  if (!uid) return;
  const ref = doc(db, 'users', uid, 'amalanHarian', todayKey());
  const snap = await getDoc(ref);
  if (snap.exists() && snap.data().loginPoint) return;
  await setDoc(ref, { loginPoint: true }, { merge: true });
  await bumpLoginDayCountAndActivation(uid);
}

// Split out from markLoginPoint so a failure here (rare — just an extra
// write) never blocks the point itself from being recorded above.
async function bumpLoginDayCountAndActivation(uid) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    const current = userSnap.data() || {};
    const nextCount = (current.loginDayCount || 0) + 1;
    const update = { loginDayCount: increment(1) };
    if (!current.activatedAt && nextCount >= ACTIVATION_LOGIN_DAYS) {
      update.activatedAt = serverTimestamp();
    }
    await setDoc(userRef, update, { merge: true });
  } catch {
    // Best-effort — losing this write just delays the activatedAt flag, doesn't break login itself.
  }
}

// Recent-days completion, for a GitHub-style heatmap (components/
// AmalanHeatmap.jsx) — one-shot reads (a heatmap of the past doesn't need
// a live listener the way "today" does), one getDoc per day rather than a
// range query, since a subcollection keyed by plain date-string ids has
// no field to range-filter on without adding a duplicate timestamp field
// just for this.
export async function fetchRecentAmalanHarian(uid, days = 30) {
  if (!uid) return [];
  const today = new Date();
  const dateKeys = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dateKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  const snaps = await Promise.all(dateKeys.map((key) => getDoc(doc(db, 'users', uid, 'amalanHarian', key))));
  return dateKeys.map((dateKey, i) => {
    const data = snaps[i].exists() ? snaps[i].data() : { sholat: {}, tilawah: false };
    return { dateKey, score: scoreForDay(data), max: DAILY_POINTS_MAX };
  });
}

// Poin & Medali's lifetime total — sums every day's own score (each
// capped at DAILY_POINTS_MAX, though scoreForDay never actually exceeds
// it) rather than maintaining a separately incremented running counter.
// A running counter risks real drift here: sholat/tilawah checkboxes can
// be toggled on/off more than once in the same day, so blindly
// incrementing on every "true" write would over-count a re-check —
// same "sum on read, don't keep a denormalized counter in sync"
// reasoning already used for Umroh Tabungan/Sedekah Goal elsewhere in
// this app. One-shot read of the whole subcollection (no range query
// needed, no pagination at the doc counts a personal account realistically
// reaches), refreshed whenever the caller wants a fresh total rather than
// kept live.
export async function fetchTotalPoints(uid) {
  if (!uid) return 0;
  const snap = await getDocs(collection(db, 'users', uid, 'amalanHarian'));
  let total = 0;
  snap.forEach((docSnap) => {
    total += scoreForDay(docSnap.data());
  });
  return total;
}

// Kalender Ibadah — every day of a given month, for a real calendar-grid
// view (distinct from AmalanHeatmap's rolling 5-week strip and
// PuasaSunnah's own calendar, which only tracks that one habit). One
// getDoc per day in the month (same reasoning as fetchRecentAmalanHarian
// — a date-string-keyed subcollection has no field to range-query on),
// capped to just the days that have actually happened so far when the
// requested month is the current one (no point fetching future dates
// that can't have a doc yet).
export async function fetchAmalanHarianForMonth(uid, year, month) {
  if (!uid) return [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;

  const dateKeys = [];
  for (let day = 1; day <= lastDay; day++) {
    dateKeys.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  const snaps = await Promise.all(dateKeys.map((key) => getDoc(doc(db, 'users', uid, 'amalanHarian', key))));
  return dateKeys.map((dateKey, i) => {
    const data = snaps[i].exists() ? snaps[i].data() : { sholat: {}, tilawah: false };
    return { dateKey, score: scoreForDay(data), max: DAILY_POINTS_MAX };
  });
}

// Perbandingan Poin Bulan Ini vs Bulan Lalu — one pass over the whole
// subcollection (already fetched by fetchTotalPoints's own getDocs
// pattern), bucketed by each doc's dateKey's own year-month prefix rather
// than a second query, so this never needs its own round trip beyond the
// one fetch.
export async function fetchMonthlyPointsComparison(uid) {
  if (!uid) return { thisMonth: 0, lastMonth: 0 };
  const today = new Date();
  const thisMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const snap = await getDocs(collection(db, 'users', uid, 'amalanHarian'));
  let thisMonth = 0;
  let lastMonth = 0;
  snap.forEach((docSnap) => {
    const score = scoreForDay(docSnap.data());
    if (docSnap.id.startsWith(thisMonthPrefix)) thisMonth += score;
    else if (docSnap.id.startsWith(lastMonthPrefix)) lastMonth += score;
  });
  return { thisMonth, lastMonth };
}
