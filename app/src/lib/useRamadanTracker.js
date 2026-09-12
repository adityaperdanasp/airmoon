import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// One doc per Hijri year, so next Ramadan starts a fresh tracker rather
// than piling onto last year's — { puasa: { "1": true, ... }, tarawih: { "1": true, ... } }
// keyed by Ramadan day number (as a string, since Firestore map keys are strings).
// `tadarus`/`sedekah`/`itikaf` (2026-09-12) follow the exact same
// per-day-map shape as `kind` is already an arbitrary string `setDay`
// accepts unchanged.
const TRACKED_KINDS = ['puasa', 'tarawih', 'tadarus', 'sedekah', 'itikaf'];

export function useRamadanTracker(uid, hijriYear) {
  const [data, setData] = useState({ puasa: {}, tarawih: {}, tadarus: {}, sedekah: {}, itikaf: {} });

  useEffect(() => {
    if (!uid || !hijriYear) return;
    return onSnapshot(doc(db, 'users', uid, 'ramadanTracker', String(hijriYear)), (snap) => {
      const d = snap.data() || {};
      setData(Object.fromEntries(TRACKED_KINDS.map((k) => [k, d[k] || {}])));
    });
  }, [uid, hijriYear]);

  const setDay = useCallback(
    async (kind, day, value) => {
      if (!uid || !hijriYear) return;
      await setDoc(
        doc(db, 'users', uid, 'ramadanTracker', String(hijriYear)),
        { [kind]: { [String(day)]: value } },
        { merge: true }
      );
    },
    [uid, hijriYear]
  );

  const puasaCount = Object.values(data.puasa).filter(Boolean).length;
  const tarawihCount = Object.values(data.tarawih).filter(Boolean).length;
  const tadarusCount = Object.values(data.tadarus).filter(Boolean).length;
  const sedekahCount = Object.values(data.sedekah).filter(Boolean).length;
  const itikafCount = Object.values(data.itikaf).filter(Boolean).length;

  return { ...data, puasaCount, tarawihCount, tadarusCount, sedekahCount, itikafCount, setDay };
}
