import { useCallback, useState } from 'react';

// A brief scale-bounce triggered on tap — applied to favorite/like/amin
// toggle buttons across the app (SurahReader's ayat favorite star,
// MushafReader's AyahActionSheet favorite heart, DoaCard's Aminkan
// button), which previously just swapped their icon/state instantly with
// no felt feedback that the tap actually registered. Respects
// prefers-reduced-motion — trigger() becomes a no-op there, same as this
// app's other JS-driven animations (CountUp, Confetti).
export function usePopAnimation() {
  const [popped, setPopped] = useState(false);

  const trigger = useCallback(() => {
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    setPopped(true);
    setTimeout(() => setPopped(false), 220);
  }, []);

  const style = {
    display: 'inline-flex',
    transform: popped ? 'scale(1.35)' : 'scale(1)',
    transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };

  return [style, trigger];
}
