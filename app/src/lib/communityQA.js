// Tanya Jawab Sesama Pengguna (2026-09-12) — a peer Q&A board, distinct
// from AskMe's AI-only chat: sometimes the useful answer is "here's how
// I actually deal with this" from another real user, not an AI. Same
// public-read/narrow-validated-create/single-field-update shape
// featureRequests.js already established for `upvoteCount`; `answerCount`
// follows the identical shape as a second independent branch (see
// firestore.rules' matching comment) since answering someone else's
// question is a different action from upvoting it.

import {
  collection, addDoc, doc, writeBatch,
  increment, serverTimestamp, query, orderBy, onSnapshot, runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';

const MAX_TITLE_LENGTH = 150;
const MAX_BODY_LENGTH = 1000;
const MAX_ANSWER_LENGTH = 1000;

export function watchQuestions(sortBy, callback) {
  const field = sortBy === 'populer' ? 'upvoteCount' : 'createdAt';
  const q = query(collection(db, 'communityQuestions'), orderBy(field, 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function submitQuestion(user, title, body) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) throw new Error('Judul pertanyaan gak boleh kosong.');
  if (trimmedTitle.length > MAX_TITLE_LENGTH) throw new Error(`Judul maksimal ${MAX_TITLE_LENGTH} karakter.`);
  const trimmedBody = (body || '').trim();
  if (trimmedBody.length > MAX_BODY_LENGTH) throw new Error(`Penjelasan maksimal ${MAX_BODY_LENGTH} karakter.`);

  await addDoc(collection(db, 'communityQuestions'), {
    uid: user.uid,
    authorName: user.displayName || user.email || 'Sahabat airmoon',
    title: trimmedTitle,
    body: trimmedBody,
    upvoteCount: 0,
    answerCount: 0,
    createdAt: serverTimestamp(),
  });
}

export function watchMyQuestionUpvote(questionId, uid, callback) {
  if (!uid) {
    callback(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'communityQuestions', questionId, 'upvotes', uid), (snap) => callback(snap.exists()));
}

export async function toggleQuestionUpvote(questionId, uid) {
  const qRef = doc(db, 'communityQuestions', questionId);
  const upvoteRef = doc(db, 'communityQuestions', questionId, 'upvotes', uid);

  await runTransaction(db, async (tx) => {
    const upvoteSnap = await tx.get(upvoteRef);
    if (upvoteSnap.exists()) {
      tx.delete(upvoteRef);
      tx.update(qRef, { upvoteCount: increment(-1) });
    } else {
      tx.set(upvoteRef, { createdAt: serverTimestamp() });
      tx.update(qRef, { upvoteCount: increment(1) });
    }
  });
}

export function watchAnswers(questionId, callback) {
  const q = query(collection(db, 'communityQuestions', questionId, 'answers'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

// A batched write (not a transaction — nothing here reads before
// writing) so the new answer doc and the parent's answerCount bump land
// together: a batch is atomic, so a rules rejection on either half never
// leaves an orphaned answer with no count, or vice versa.
export async function submitAnswer(questionId, user, text) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Jawaban gak boleh kosong.');
  if (trimmed.length > MAX_ANSWER_LENGTH) throw new Error(`Jawaban maksimal ${MAX_ANSWER_LENGTH} karakter.`);

  const batch = writeBatch(db);
  const answerRef = doc(collection(db, 'communityQuestions', questionId, 'answers'));
  batch.set(answerRef, {
    uid: user.uid,
    authorName: user.displayName || user.email || 'Sahabat airmoon',
    text: trimmed,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db, 'communityQuestions', questionId), { answerCount: increment(1) });
  await batch.commit();
}
