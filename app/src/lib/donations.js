import { doc, getDoc, setDoc, increment, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const SEED_DONATION = {
  id: 'masjid-al-ikhlas',
  title: 'Listrik Masjid Al-Ikhlas',
  plnId: '5312 0044 219',
  target: 750000,
  collected: 480000,
};

export async function getOrSeedDonation() {
  const ref = doc(db, 'donations', SEED_DONATION.id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  // First load bootstraps the demo campaign — see the write-rule note in
  // firestore.rules for why this is client-side for now.
  await setDoc(ref, SEED_DONATION);
  return SEED_DONATION;
}

export async function contribute(donationId, amount) {
  const ref = doc(db, 'donations', donationId);
  await setDoc(ref, { collected: increment(amount) }, { merge: true });
}

// Personal record of a single contribution, kept under the giver's own
// profile (users/{uid}/contributions) — separate from the campaign's
// aggregate `collected` counter above, which has no per-giver breakdown.
export async function recordContribution(uid, donation, amount) {
  await addDoc(collection(db, 'users', uid, 'contributions'), {
    donationId: donation.id,
    donationTitle: donation.title,
    amount,
    createdAt: serverTimestamp(),
  });
}

// Live-updating list of a user's own contributions, newest first.
export function watchMyContributions(uid, callback) {
  const q = query(collection(db, 'users', uid, 'contributions'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}
