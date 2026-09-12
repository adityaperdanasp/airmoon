import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Reaksi Jawaban Ust. Rewin (2026-09-12) — create-only, write-and-forget
// (see firestore.rules: `allow read, update, delete: if false`). AskMe.jsx's
// chat history is purely localStorage, not a Firestore doc, so there's no
// existing record to attach a reaction to — this just logs a lightweight
// signal (question/answer snapshot + thumbs up/down) for the founder to
// spot-check answer quality later, not a live-updating counter shown in UI.
export async function submitAskMeFeedback(uid, { question, answer, helpful }) {
  await addDoc(collection(db, 'askMeFeedback'), {
    uid,
    question: (question || '').slice(0, 500),
    answer: (answer || '').slice(0, 2000),
    helpful,
    createdAt: serverTimestamp(),
  });
}
