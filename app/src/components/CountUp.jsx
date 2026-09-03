import { useEffect, useRef, useState } from 'react';

// A number that eases up to `value` instead of snapping straight to it —
// used for the "big number reveal" moments (Total Sedekah, kalkulator
// results) that previously just appeared instantly with no sense of
// weight. Animates from wherever it currently is (not always from 0), so
// re-renders with a slightly different value (e.g. a live Firestore
// total ticking up) ease smoothly rather than restarting from zero.
// Respects prefers-reduced-motion, same as this app's CSS animations
// (theme.css's own media query) — jumps straight to the final value there
// instead of animating.
export default function CountUp({ value, duration = 800, formatter }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const noRealChange = fromRef.current === value;
    if (reduceMotion || noRealChange) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }

    const from = fromRef.current;
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);

    function tick(ts) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic — fast start, gentle settle
      const current = from + (value - from) * eased;
      setDisplay(current);
      fromRef.current = current;
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the
    // target `value` should restart the animation; `duration` changing
    // mid-flight isn't a real case this app hits.
  }, [value]);

  const rounded = Math.round(display);
  return formatter ? formatter(rounded) : rounded.toLocaleString('id-ID');
}
