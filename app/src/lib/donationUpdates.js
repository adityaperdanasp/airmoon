import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Update dari Masjid (2026-09-12) — a lean "admin dashboard" substitute.
// See firestore.rules' own comment: only writable by whoever's uid
// matches donations/{id}.submitterUid, a new optional field no existing
// campaign has set yet — shovel-ready, not yet usable until the founder
// starts passing it through api/approve-masjid.js.
export function watchDonationUpdates(donationId, callback) {
  const q = query(collection(db, 'donations', donationId, 'updates'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function postDonationUpdate(donationId, text, user) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Update gak boleh kosong.');
  await addDoc(collection(db, 'donations', donationId, 'updates'), {
    uid: user.uid,
    text: trimmed,
    createdAt: serverTimestamp(),
  });
}
