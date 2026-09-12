// Email opt-in (2026-09-12) — push notifications were the only outbound
// channel this app had; anyone who's turned notifications off (or never
// granted the OS permission at all) was completely unreachable. This just
// captures consent + reuses the email Firebase Auth already collects
// (every account has one, email/password or OAuth) — no re-engagement
// email actually SENDS yet, since that needs a real transactional-email
// provider (Resend/SendGrid/Mailgun) and API key the founder hasn't set
// up; this is the shovel-ready half (opt-in respected, lapsed-user query
// already written in check-campaign-deadlines.js) so wiring in a provider
// later is a small addition, not a redesign.
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export function watchEmailOptIn(uid, callback) {
  if (!uid) {
    callback(true);
    return () => {};
  }
  // Missing/undefined reads as opted-in, same "silence means yes" default
  // notifPrefs.js already uses — nobody's consent should flip to "no"
  // just because this setting is new and they've never visited it.
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(snap.data()?.emailOptIn !== false));
}

export async function setEmailOptIn(uid, value) {
  await setDoc(doc(db, 'users', uid), { emailOptIn: value }, { merge: true });
}
