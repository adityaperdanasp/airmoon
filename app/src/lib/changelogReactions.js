import { doc, onSnapshot, increment, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from './firebase';

// Yang Baru reactions (2026-09-12) — "Yang Baru" broadcast what shipped
// one-way; this closes the loop from Usulan Fitur → shipped feature →
// feedback. Two independent 👍/👎 toggles per changelog version, same
// public-read/count-doc-plus-existence-subcollection shape lib/doa.js's
// aminCount already established, done twice rather than one toggle that
// has to track which way someone last voted (simpler, and voting both
// ways is a harmless edge case, not worth the extra complexity to
// prevent).
export function watchChangelogReaction(version, callback) {
  return onSnapshot(doc(db, 'changelogReactions', String(version)), (snap) => {
    callback(snap.data() || { helpfulCount: 0, notHelpfulCount: 0 });
  });
}

export function watchMyChangelogVote(version, uid, field, callback) {
  if (!uid) {
    callback(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'changelogReactions', String(version), field, uid), (snap) => callback(snap.exists()));
}

async function toggleVote(version, uid, voteField, countField) {
  const reactionRef = doc(db, 'changelogReactions', String(version));
  const voteRef = doc(db, 'changelogReactions', String(version), voteField, uid);
  await runTransaction(db, async (tx) => {
    const voteSnap = await tx.get(voteRef);
    if (voteSnap.exists()) {
      tx.delete(voteRef);
      tx.set(reactionRef, { [countField]: increment(-1) }, { merge: true });
    } else {
      tx.set(voteRef, { createdAt: serverTimestamp() });
      tx.set(reactionRef, { [countField]: increment(1) }, { merge: true });
    }
  });
}

export const toggleHelpful = (version, uid) => toggleVote(version, uid, 'helpfulVotes', 'helpfulCount');
export const toggleNotHelpful = (version, uid) => toggleVote(version, uid, 'notHelpfulVotes', 'notHelpfulCount');
