import { collection, doc, addDoc, deleteDoc, setDoc, getDoc, updateDoc, query, where, orderBy, onSnapshot, serverTimestamp, increment, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// Doa Bersama Terjadwal (2026-09-12) — anyone signed in can schedule one
// (a public prayer moment, e.g. "Doa bareng buat ujian SBMPTN, Jumat
// 20:00") and anyone can join. `participantCount` is a plain counter, not
// the actual list of who joined (that lives in the `participants`
// subcollection, one doc per uid so a rejoin doesn't double count) — see
// firestore.rules' own comment for why `update` is restricted to that one
// field: nobody should be able to rewrite someone else's doa title/time.
export function watchUpcomingDoaBersama(callback) {
  const q = query(
    collection(db, 'doaBersama'),
    where('scheduledFor', '>=', Timestamp.now()),
    orderBy('scheduledFor', 'asc')
  );
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function createDoaBersama(uid, { title, scheduledFor, description }) {
  await addDoc(collection(db, 'doaBersama'), {
    uid,
    title,
    description: description || '',
    scheduledFor: Timestamp.fromDate(new Date(scheduledFor)),
    participantCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function deleteDoaBersama(id) {
  await deleteDoc(doc(db, 'doaBersama', id));
}

export function watchIsJoined(doaId, uid, callback) {
  if (!uid) {
    callback(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'doaBersama', doaId, 'participants', uid), (snap) => callback(snap.exists()));
}

export async function joinDoaBersama(doaId, uid) {
  const participantRef = doc(db, 'doaBersama', doaId, 'participants', uid);
  const existing = await getDoc(participantRef);
  if (existing.exists()) return;
  await setDoc(participantRef, { joinedAt: serverTimestamp() });
  await updateDoc(doc(db, 'doaBersama', doaId), { participantCount: increment(1) });
}

export async function leaveDoaBersama(doaId, uid) {
  const participantRef = doc(db, 'doaBersama', doaId, 'participants', uid);
  const existing = await getDoc(participantRef);
  if (!existing.exists()) return;
  await deleteDoc(participantRef);
  await updateDoc(doc(db, 'doaBersama', doaId), { participantCount: increment(-1) });
}
