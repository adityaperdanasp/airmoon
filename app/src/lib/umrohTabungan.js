// Tabungan Umroh — was a one-off calculator only ("this doesn't save your
// progress" was the page's own disclaimer). Now a real tracker: a goal
// (target + months, on users/{uid}.umrohTabungan) plus a running deposit
// history (users/{uid}/umrohDeposits/{id}) — `saved` is computed
// client-side by summing the deposit list rather than a separate
// denormalized counter, since a personal savings log stays small enough
// that summing on read is simpler than keeping increment() consistency
// right across add/remove.
import { collection, doc, addDoc, deleteDoc, setDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export function watchUmrohGoal(uid, callback) {
  if (!uid) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(snap.data()?.umrohTabungan || null));
}

export async function setUmrohGoal(uid, { target, months }) {
  await setDoc(
    doc(db, 'users', uid),
    { umrohTabungan: { target, months, startDate: new Date().toISOString().slice(0, 10) } },
    { merge: true }
  );
}

export async function clearUmrohGoal(uid) {
  await setDoc(doc(db, 'users', uid), { umrohTabungan: null }, { merge: true });
}

// [UI 2026-09-11] Undo for clearUmrohGoal — writes back the exact
// {target, months, startDate} that was just cleared, not a fresh
// setUmrohGoal() call (which would restart startDate at today).
export async function restoreUmrohGoal(uid, goal) {
  if (!goal) return;
  await setDoc(doc(db, 'users', uid), { umrohTabungan: goal }, { merge: true });
}

export function watchUmrohDeposits(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'users', uid, 'umrohDeposits'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function addUmrohDeposit(uid, amount, note) {
  await addDoc(collection(db, 'users', uid, 'umrohDeposits'), { amount, note: note || '', createdAt: serverTimestamp() });
}

export async function removeUmrohDeposit(uid, depositId) {
  await deleteDoc(doc(db, 'users', uid, 'umrohDeposits', depositId));
}

// [UI 2026-09-11] Undo for removeUmrohDeposit — writes the exact deposit
// back under its original id (setDoc, not addDoc, so it isn't given a
// new one) and keeps its real createdAt instead of serverTimestamp(),
// so it lands back in its correct spot in the createdAt-desc history
// instead of jumping to the top as if just made now.
export async function restoreUmrohDeposit(uid, deposit) {
  const { id, ...data } = deposit;
  await setDoc(doc(db, 'users', uid, 'umrohDeposits', id), data);
}
