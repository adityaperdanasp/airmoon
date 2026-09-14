// Laporkan (2026-09-14) — this app's public user-generated content
// (Tanya Jawab forum, Wall of Gratitude) had zero moderation path until
// now beyond the founder happening to notice something in the Firestore
// console. Create-only, no client read-back — same shape as
// npsResponses/askMeFeedback, not errorLogs' unauthenticated-create
// shape, since reporting real content should be tied to a real account
// (discourages drive-by report spam).
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function submitContentReport(uid, { contentType, contentPath, reason }) {
  await addDoc(collection(db, 'contentReports'), {
    uid,
    contentType,
    contentPath,
    reason: (reason || '').trim().slice(0, 500),
    createdAt: serverTimestamp(),
  });
}
