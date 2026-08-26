import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// One doc per Hijri year, so next Ramadan starts a fresh tracker rather
// than piling onto last year's — { puasa: { "1": true, ... }, tarawih: { "1": true, ... } }
// keyed by Ramadan day number (as a string, since Firestore map keys are strings).
export function useRamadanTracker(uid, hijriYear) {
  const [data, setData] = useState({ puasa: {}, tarawih: {} });

  useEffect(() => {
    if (!uid || !hijriYear) return;
    return onSnapshot(doc(db, 'users', uid, 'ramadanTracker', String(hijriYear)), (snap) => {
      setData({ puasa: snap.data()?.puasa || {}, tarawih: snap.data()?.tarawih || {} });
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

  return { ...data, puasaCount, tarawihCount, setDay };
}
