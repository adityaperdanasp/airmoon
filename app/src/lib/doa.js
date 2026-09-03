// Doa & Aminkan — a public "amin wall": anyone can write a short doa
// (optionally anonymous), and anyone else can tap once to "aminkan" it.
// Posting also pushes a real notification to every user's device (see
// api/broadcast-doa.js) — a much bigger blast radius than any other write
// in this app, which is exactly why the write itself is deliberately
// low-stakes to allow: no money changes hands here, so trusting a normal
// authenticated client write (rather than routing everything through an
// admin-only endpoint like the donation flows do) is a reasonable
// trade-off, not an oversight.

import {
  collection, addDoc, doc,
  increment, serverTimestamp, query, orderBy, limit, onSnapshot, runTransaction, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

const MAX_DOA_LENGTH = 500;
const DOA_TTL_MS = 24 * 60 * 60 * 1000; // a doa only stays on the wall for 24 hours
const DOA_POST_COOLDOWN_MS = 30 * 1000; // 30s between posts per user — enough to stop rapid-fire spam without getting in the way of someone actually posting a doa
const LAST_POST_KEY = 'airmoon-last-doa-post'; // client-side mirror of the check below, just for an instant "tunggu N detik" message instead of waiting on a round trip to get rejected

// A Firestore range filter on createdAt would only apply the 24h cutoff
// once, at the moment the query is built — the comparison value is frozen
// then, so a doa doesn't get pushed back out of an already-live listener's
// results just because real time moved past it. Filtering client-side
// (and re-applying that filter on a timer, not just on new snapshots)
// is what actually makes a doa disappear at the 24h mark instead of only
// whenever someone else happens to post/amin something next.
export function watchDoas(callback) {
  const q = query(collection(db, 'doas'), orderBy('createdAt', 'desc'), limit(50));
  let latestDocs = [];

  function emit() {
    const cutoff = Date.now() - DOA_TTL_MS;
    callback(
      latestDocs.filter((d) => {
        const ms = d.createdAt?.toMillis ? d.createdAt.toMillis() : null;
        // serverTimestamp() resolves a moment after the optimistic local
        // write lands, so a brand-new doa can briefly have no createdAt
        // yet — show it right away rather than filtering it out.
        return ms === null || ms >= cutoff;
      })
    );
  }

  const unsubscribe = onSnapshot(q, (snap) => {
    latestDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    emit();
  });
  const interval = setInterval(emit, 60 * 1000);

  return () => {
    unsubscribe();
    clearInterval(interval);
  };
}

// The doa post itself had no rate limit at all before this — only the FCM
// broadcast did (5-minute cooldown, see api/broadcast-doa.js), so someone
// could still spam the public wall itself as fast as they could tap
// "Kirim", the broadcasts just wouldn't follow. Enforced as an atomic
// batch (not two separate writes) so the cooldown can't be bypassed by a
// client calling the Firestore SDK directly and skipping the bookkeeping
// write: firestore.rules' `doas` create rule reads
// users/{uid}.lastDoaPostAt (its value from *before* this batch, since
// rules evaluate a batch's writes against the pre-commit state) and
// rejects the create outright if it's too soon — this write is what sets
// that field for the next check.
export async function createDoa(text, anonymous, user) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Doa-nya kosong.');
  if (trimmed.length > MAX_DOA_LENGTH) throw new Error(`Maksimal ${MAX_DOA_LENGTH} karakter.`);

  // Best-effort local pre-check (easy to clear, not what actually
  // enforces this) just so a too-soon post fails instantly with a
  // friendly countdown instead of waiting on a round trip to get
  // rejected by the rule below.
  const lastPost = Number(localStorage.getItem(LAST_POST_KEY) || 0);
  const remaining = DOA_POST_COOLDOWN_MS - (Date.now() - lastPost);
  if (remaining > 0) {
    throw new Error(`Tunggu ${Math.ceil(remaining / 1000)} detik lagi sebelum posting doa lagi.`);
  }

  const doaRef = doc(collection(db, 'doas'));
  const userRef = doc(db, 'users', user.uid);
  const batch = writeBatch(db);
  batch.set(doaRef, {
    text: trimmed,
    uid: user.uid,
    authorName: anonymous ? null : (user.displayName || user.email || 'Sahabat airmoon'),
    anonymous,
    aminCount: 0,
    createdAt: serverTimestamp(),
  });
  batch.set(userRef, { lastDoaPostAt: serverTimestamp() }, { merge: true });

  try {
    await batch.commit();
  } catch (err) {
    // The cooldown rule is the only thing in this rule that can reject an
    // otherwise-valid create, so a permission-denied here almost
    // certainly means "too soon", not a real auth problem — surface that
    // instead of a raw Firebase error string.
    if (err?.code === 'permission-denied') {
      throw new Error('Tunggu sebentar dulu sebelum posting doa lagi.');
    }
    throw err;
  }
  localStorage.setItem(LAST_POST_KEY, String(Date.now()));

  // Broadcasting is separate from the write itself (and allowed to fail
  // silently from the poster's point of view — see the endpoint's own
  // header comment) since the doa should still be posted and visible in
  // the feed even if the push notification side has a hiccup.
  try {
    await fetch('https://airmoon.vercel.app/api/broadcast-doa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doaId: doaRef.id, text: trimmed, uid: user.uid }),
    });
  } catch {
    // Network hiccup calling the broadcast endpoint — the doa itself is
    // already saved and visible in the feed regardless.
  }

  return doaRef.id;
}

// Whether `uid` has already amin-ed `doaId` — drives the button's toggled
// state (a single doc's existence, not a full read of everyone who has).
export function watchMyAmin(doaId, uid, callback) {
  if (!uid) {
    callback(false);
    return () => {};
  }
  return onSnapshot(doc(db, 'doas', doaId, 'amins', uid), (snap) => callback(snap.exists()));
}

// Toggles amin on/off for this user, keeping the denormalized aminCount on
// the parent doc in sync via a transaction (read-then-write, so a burst of
// simultaneous taps from different people can't race and under/over-count).
export async function toggleAmin(doaId, uid) {
  const doaRef = doc(db, 'doas', doaId);
  const aminRef = doc(db, 'doas', doaId, 'amins', uid);

  await runTransaction(db, async (tx) => {
    const aminSnap = await tx.get(aminRef);
    if (aminSnap.exists()) {
      tx.delete(aminRef);
      tx.update(doaRef, { aminCount: increment(-1) });
    } else {
      tx.set(aminRef, { createdAt: serverTimestamp() });
      tx.update(doaRef, { aminCount: increment(1) });
    }
  });
}
