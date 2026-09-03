// Total time spent actually reading the Qur'an (Mode Ayat + Mode Mushaf
// combined) — a second axis of motivation alongside the streak/badge and
// khatam-page-count stats, since "minutes spent" rewards someone who reads
// slowly/reflectively just as much as someone who pages through quickly.
// Client-side interval accumulation (not `performance.now()` deltas summed
// forever) flushed to Firestore periodically via `increment()`, so a
// crashed tab/force-quit loses at most one flush interval's worth, not the
// whole session. Paused while the tab is hidden (`document.hidden`) so
// leaving a reader open in a background tab doesn't inflate the total.
import { useEffect, useRef } from 'react';
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const TICK_MS = 5000;
const FLUSH_MS = 60 * 1000;

export function useReadingTimeTracker(uid) {
  const secondsRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    if (!uid) return;
    lastTickRef.current = Date.now();

    function tick() {
      const now = Date.now();
      if (!document.hidden) {
        secondsRef.current += (now - lastTickRef.current) / 1000;
      }
      lastTickRef.current = now;
    }

    async function flush() {
      tick();
      const minutes = Math.floor(secondsRef.current / 60);
      if (minutes <= 0) return;
      secondsRef.current -= minutes * 60;
      try {
        await setDoc(doc(db, 'users', uid), { readingStats: { totalMinutes: increment(minutes) } }, { merge: true });
      } catch {
        // A missed flush isn't worth surfacing to the reader — the next
        // successful flush just carries a bit more accumulated time.
      }
    }

    const tickInterval = setInterval(tick, TICK_MS);
    const flushInterval = setInterval(flush, FLUSH_MS);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(tickInterval);
      clearInterval(flushInterval);
      document.removeEventListener('visibilitychange', tick);
      flush();
    };
  }, [uid]);
}

export function watchReadingStats(uid, callback) {
  if (!uid) {
    callback({ totalMinutes: 0 });
    return () => {};
  }
  return onSnapshot(doc(db, 'users', uid), (snap) => callback(snap.data()?.readingStats || { totalMinutes: 0 }));
}
