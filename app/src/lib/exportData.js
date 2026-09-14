// Export/backup personal data — dzikir streak, ayat favorit, tabungan
// umroh, and a few other personal records all live only in Firestore with
// no way for a user to get their own copy before this. Reads across the
// several places personal data actually lives (see CLAUDE.md's Firestore
// data-model note) and bundles it into one downloadable JSON file — a
// local export, not a account-deletion/GDPR-style server job, since this
// app's whole personal footprint is small enough to fetch client-side in
// one shot.

import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, writeBatch, serverTimestamp } from 'firebase/firestore';
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

// Own posts in top-level (not users/{uid}-nested) public collections —
// same reasoning as `subcollection()` above but a plain `where('uid',...)`
// query instead, since these docs live at the collection's own top level.
async function ownDocsIn(uid, collectionName) {
  const snap = await getDocs(query(collection(db, collectionName), where('uid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Answers the user wrote on OTHER people's questions — `answers` only
// exists as a subcollection of `communityQuestions/{id}`, so finding
// "every answer this uid wrote" needs a collectionGroup query rather
// than `ownDocsIn`'s plain top-level one. Needs `answers.uid` enabled at
// COLLECTION_GROUP scope in firestore.indexes.json (added alongside this).
async function ownAnswers(uid) {
  const { collectionGroup, getDocs: getDocsFn } = await import('firebase/firestore');
  const snap = await getDocsFn(collectionGroup(db, 'answers'));
  return snap.docs.filter((d) => d.data().uid === uid).map((d) => ({ id: d.id, questionId: d.ref.parent.parent.id, ...d.data() }));
}

export async function buildUserDataExport(user) {
  const profileSnap = await getDoc(doc(db, 'users', user.uid));
  const profile = profileSnap.data() || {};

  const [favoriteAyat, umrohDeposits, contributions, amalanHarian, jumatChecklist] = await Promise.all([
    subcollection(user.uid, 'favoriteAyat'),
    subcollection(user.uid, 'umrohDeposits'),
    subcollection(user.uid, 'contributions'),
    subcollection(user.uid, 'amalanHarian'),
    subcollection(user.uid, 'jumatChecklist'),
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
    hafalan: profile.hafalan || null,
    checklistJumat: jumatChecklist,
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

// Import/restore — reads back a file this same export produced. Only
// restores the durable/personal parts (streaks, goals, favorites,
// bookmarks) — deliberately skips riwayatSedekah and amalanHarian: the
// sedekah history is a server-written audit trail from real payment
// webhooks, not something a client re-import should ever be able to
// recreate, and re-importing old daily amalanHarian docs would just
// confusingly overwrite (or clutter alongside) whatever's already logged
// for those dates. umrohTabungan's deposit history is skipped for the
// same "don't let a client re-inject financial-shaped records" reason —
// only the goal (target/months) is restored, not the deposit list.
export async function importUserDataFromFile(user, file) {
  const text = await file.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('File bukan format JSON yang valid.');
  }
  if (!data || typeof data !== 'object') {
    throw new Error('Isi file tidak dikenali sebagai data ekspor airmoon.');
  }

  const profileUpdate = {};
  if (data.dzikirStreak) profileUpdate.dzikirStreak = data.dzikirStreak;
  if (data.zakatHaul) profileUpdate.zakatHaul = data.zakatHaul;
  if (data.tabunganUmroh?.goal) profileUpdate.umrohTabungan = data.tabunganUmroh.goal;
  if (data.bookmarkTerakhir?.modeAyat) profileUpdate.lastReadAyat = data.bookmarkTerakhir.modeAyat;
  if (data.bookmarkTerakhir?.modeMushaf) profileUpdate.lastReadMushaf = data.bookmarkTerakhir.modeMushaf;

  if (Object.keys(profileUpdate).length) {
    await setDoc(doc(db, 'users', user.uid), profileUpdate, { merge: true });
  }

  const favorites = Array.isArray(data.ayatFavorit) ? data.ayatFavorit : [];
  let restoredFavorites = 0;
  // Firestore batches cap at 500 writes — this app's favorite lists are
  // nowhere near that in practice, but chunk anyway rather than assume.
  for (let i = 0; i < favorites.length; i += 400) {
    const chunk = favorites.slice(i, i + 400);
    const batch = writeBatch(db);
    for (const f of chunk) {
      if (!f.id || !f.chapter || !f.verse) continue;
      // Drop the exported createdAt (a serialized Firestore Timestamp,
      // not a real one once round-tripped through JSON) and stamp fresh —
      // favoriteAyat.js sorts by this field, so it needs to stay a real
      // Timestamp, not a plain {seconds,nanoseconds} map.
      const { id, createdAt: _createdAt, ...rest } = f;
      batch.set(doc(db, 'users', user.uid, 'favoriteAyat', id), { ...rest, createdAt: serverTimestamp() }, { merge: true });
      restoredFavorites++;
    }
    await batch.commit();
  }

  return { restoredFavorites, restoredProfile: Object.keys(profileUpdate) };
}
