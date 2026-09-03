// Export/backup personal data — dzikir streak, ayat favorit, tabungan
// umroh, and a few other personal records all live only in Firestore with
// no way for a user to get their own copy before this. Reads across the
// several places personal data actually lives (see CLAUDE.md's Firestore
// data-model note) and bundles it into one downloadable JSON file — a
// local export, not a account-deletion/GDPR-style server job, since this
// app's whole personal footprint is small enough to fetch client-side in
// one shot.

import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

async function subcollection(uid, name) {
  try {
    const snap = await getDocs(query(collection(db, 'users', uid, name), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    // Missing orderBy field on an empty/older collection shouldn't fail
    // the whole export — just fall back to an unordered read.
    const snap = await getDocs(collection(db, 'users', uid, name));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

export async function buildUserDataExport(user) {
  const profileSnap = await getDoc(doc(db, 'users', user.uid));
  const profile = profileSnap.data() || {};

  const [favoriteAyat, umrohDeposits, contributions, amalanHarian] = await Promise.all([
    subcollection(user.uid, 'favoriteAyat'),
    subcollection(user.uid, 'umrohDeposits'),
    subcollection(user.uid, 'contributions'),
    subcollection(user.uid, 'amalanHarian'),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    akun: {
      nama: profile.displayName || user.displayName || null,
      email: profile.email || user.email || null,
    },
    dzikirStreak: profile.dzikirStreak || null,
    zakatHaul: profile.zakatHaul || null,
    tabunganUmroh: {
      goal: profile.umrohTabungan || null,
      deposits: umrohDeposits,
    },
    ayatFavorit: favoriteAyat,
    bookmarkTerakhir: {
      modeAyat: profile.lastReadAyat || profile.lastRead || null,
      modeMushaf: profile.lastReadMushaf || null,
    },
    riwayatSedekah: contributions,
    amalanHarian,
  };
}

// Triggers a real browser download — same pattern AyatCardModal.jsx
// already uses for its downloadable image, just with a JSON blob instead
// of a canvas PNG.
export async function exportAndDownloadUserData(user) {
  const data = await buildUserDataExport(user);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `airmoon-data-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
