// Usulan Fitur — a public feature-request board (2026-09-12). 150+
// features have shipped across this app's history on founder intuition
// alone; this gives users an actual channel to say what they want next,
// and an upvote signal instead of a guess. Same public-read/narrow-
// validated-create/single-field-update shape lib/doa.js's wall already
// established — no money/fraud stakes in this collection either.

import {
  collection, addDoc, doc,
  increment, serverTimestamp, query, orderBy, onSnapshot, runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';

const MAX_TITLE_LENGTH = 120;
const MAX_DESC_LENGTH = 1000;

export function watchFeatureRequests(callback) {
  const q = query(collection(db, 'featureRequests'), orderBy('upvoteCount', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function submitFeatureRequest(title, description, user) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) throw new Error('Judul usulan gak boleh kosong.');
  if (trimmedTitle.length > MAX_TITLE_LENGTH) throw new Error(`Judul maksimal ${MAX_TITLE_LENGTH} karakter.`);
  const trimmedDesc = (description || '').trim();
  if (trimmedDesc.length > MAX_DESC_LENGTH) throw new Error(`Penjelasan maksimal ${MAX_DESC_LENGTH} karakter.`);

  await addDoc(collection(db, 'featureRequests'), {
    uid: user.uid,
    authorName: user.displayName || user.email || 'Sahabat airmoon',
    title: trimmedTitle,
    description: trimmedDesc,
    status: 'baru', // baru | dipertimbangkan | dikerjakan | selesai — updated manually by the founder
    upvoteCount: 0,
    createdAt: serverTimestamp(),
  });
}

export function watchMyUpvote(requestId, uid, callback) {
  if (!uid) {
    callback(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'featureRequests', requestId, 'upvotes', uid), (snap) => callback(snap.exists()));
}

export async function toggleUpvote(requestId, uid) {
  const reqRef = doc(db, 'featureRequests', requestId);
  const upvoteRef = doc(db, 'featureRequests', requestId, 'upvotes', uid);

  await runTransaction(db, async (tx) => {
    const upvoteSnap = await tx.get(upvoteRef);
    if (upvoteSnap.exists()) {
      tx.delete(upvoteRef);
      tx.update(reqRef, { upvoteCount: increment(-1) });
    } else {
      tx.set(upvoteRef, { createdAt: serverTimestamp() });
      tx.update(reqRef, { upvoteCount: increment(1) });
    }
  });
}
