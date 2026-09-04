// Real in-app feedback capture (paired with lib/ratingPrompt.js's timing
// logic) — one doc per submission under the user's own profile, same
// owner-only subcollection shape as contributions/favoriteAyat/etc (see
// firestore.rules' new `feedback` match).
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function submitFeedback(uid, { stars, text }) {
  await addDoc(collection(db, 'users', uid, 'feedback'), {
    stars,
    text: text || null,
    at: serverTimestamp(),
  });
}
