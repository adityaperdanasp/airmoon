import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Referral program (2026-09-12) — "Ajak Teman" was a bare share button
// with no loop: no reward, no tracking of who invited whom. A referral
// code is just the referrer's own uid — this app has no username/handle
// system to generate a nicer short code against, and a uid isn't
// sensitive here (nothing else in the app treats it as a secret), so
// reusing it directly avoids a whole extra lookup-table collection for
// an MVP.
const REF_STORAGE_KEY = 'airmoon-pending-referral';

// Reads `?ref=<uid>` from the current URL (SignUp.jsx calls this on
// mount) and stashes it in localStorage — a signup often isn't the very
// first page someone lands on (e.g. they browse Login first), so the
// param needs to survive a navigation, not just be read once.
export function capturePendingReferral() {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) localStorage.setItem(REF_STORAGE_KEY, ref);
  } catch {
    // Private-browsing/full storage — referral just won't be credited this signup.
  }
}

export function getPendingReferral() {
  try {
    return localStorage.getItem(REF_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearPendingReferral() {
  try {
    localStorage.removeItem(REF_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

// Called right after a successful signup. Self-write only (the new
// user's own doc) — crediting the REFERRER's reward can't happen from
// this client session (firestore.rules only lets a user write their own
// doc), so that part is server-side, folded into
// check-campaign-deadlines.js's existing daily cron the same way every
// other cross-user Admin-SDK job in this app already is.
// `referralRewarded: false` is written explicitly (not left undefined)
// so that cron can query `where('referralRewarded', '==', false)`
// cleanly instead of needing a "field doesn't exist" trick.
export async function recordReferralIfPending(uid) {
  const refUid = getPendingReferral();
  clearPendingReferral();
  if (!refUid || refUid === uid) return; // no self-referral
  // Guards against overwriting an existing account's referredBy — this
  // runs on every SignUp.jsx mount-to-signed-in transition, which also
  // fires for someone who's already a member and just lands on /signup
  // (e.g. clicking a shared referral link while already logged in on
  // another tab).
  const existing = await getDoc(doc(db, 'users', uid));
  if (existing.data()?.referredBy) return;
  // `referralRewardReceived` is the referee's own cosmetic unlock (see
  // lib/accentColor.js's Rose Gold option) — a plain self-write, safe to
  // set immediately rather than waiting on the daily cron below, since it
  // doesn't touch anyone else's document. `referralRewarded` and
  // `referralActivationCounted` are both explicit `false` (not left
  // undefined) so the cron's own `where(..., '==', false)` queries can
  // match cleanly instead of needing a "field doesn't exist" trick —
  // the first credits the referrer's raw referralCount once this signup
  // has landed, the second later credits referralActivatedCount once
  // this same account's own activatedAt gets set (see
  // checkReferralActivationSignal in check-campaign-deadlines.js) — a
  // real signal of "actually started using the app", not just "made an
  // account".
  await setDoc(
    doc(db, 'users', uid),
    { referredBy: refUid, referralRewarded: false, referralRewardReceived: true, referralActivationCounted: false },
    { merge: true }
  );
}

export async function getReferralCount(uid) {
  if (!uid) return 0;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.data()?.referralCount || 0;
}
