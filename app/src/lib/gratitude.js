import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Wall of Gratitude (2026-09-12) — see firestore.rules' own comment for
// why this is a public testimoni wall (any signed-in user, on a campaign
// that's actually reached its target) rather than restricted to "the
// masjid admin" specifically — this app has no clean way to authenticate
// that identity against a specific donations/{id} doc.
export function watchGratitude(donationId, callback) {
  const q = query(collection(db, 'donations', donationId, 'gratitude'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function postGratitude(donationId, text, user) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Ucapan gak boleh kosong.');
  await addDoc(collection(db, 'donations', donationId, 'gratitude'), {
    uid: user.uid,
    authorName: user.displayName || user.email || 'Sahabat airmoon',
    text: trimmed,
    createdAt: serverTimestamp(),
  });
}
