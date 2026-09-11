import { useEffect, useMemo, useRef, useState } from 'react';

// Renders a long list incrementally instead of mounting every row at
// once — SurahList's 114 surah and Doa Harian's longer categories (32
// items in "Doa Karena Sebab") all `.map()`ed their full array straight
// into the DOM on mount regardless of how many actually fit on screen.
// Not real virtualization (rows already revealed stay mounted, no
// scroll-position math, no risk of the classic "scrolled-to-nowhere"
// windowing bug) — just a smaller first paint, growing via a sentinel
// element and IntersectionObserver as the user actually scrolls down.
// Resets back to `initialCount` whenever the underlying `items` array
// itself changes identity (e.g. a new search filter or category).
export function useProgressiveList(items, { initialCount = 20, step = 20 } = {}) {
  const [count, setCount] = useState(initialCount);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setCount(initialCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || count >= items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCount((c) => Math.min(items.length, c + step));
        }
      },
      { rootMargin: '400px' } // start loading the next chunk well before the sentinel is actually on screen
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, items.length, step]);

  const visibleItems = useMemo(() => items.slice(0, count), [items, count]);
  return { visibleItems, hasMore: count < items.length, sentinelRef };
}
