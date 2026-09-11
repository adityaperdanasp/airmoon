import { useRef, useState } from 'react';

// Swipe-left-to-reveal-delete for list rows (Ayat Favorit's cards) — those
// rows only ever had a small trash icon to tap; swipe-to-delete is the
// near-universal mobile list gesture and was missing everywhere in this
// app. One hook instance per row (call it inside the row's own component,
// not the list's — each row needs its own drag state).
//
// Deliberately axis-locked, not just horizontal-only: the first several
// pixels of a touch move are watched before committing to either 'x'
// (this hook takes over, e.g. via a horizontal swipe) or 'y' (untouched —
// left for the page's own vertical scroll / PullToRefresh gesture to
// handle). Without that lock, a mostly-vertical scroll starting with a
// tiny sideways wobble would otherwise get eaten by this hook.
const REVEAL_WIDTH = 76;
const AXIS_LOCK_PX = 8;

export function useSwipeReveal() {
  const startX = useRef(null);
  const startY = useRef(null);
  const axisRef = useRef(null); // 'x' | 'y' | null
  const [dragX, setDragX] = useState(0);
  const [revealed, setRevealed] = useState(false);

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    axisRef.current = null;
  }

  function onTouchMove(e) {
    if (startX.current == null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (!axisRef.current && (Math.abs(dx) > AXIS_LOCK_PX || Math.abs(dy) > AXIS_LOCK_PX)) {
      axisRef.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (axisRef.current !== 'x') return;
    const base = revealed ? -REVEAL_WIDTH : 0;
    setDragX(Math.min(0, Math.max(-REVEAL_WIDTH - 16, base + dx)));
  }

  function onTouchEnd() {
    if (axisRef.current === 'x') {
      const shouldReveal = dragX < -REVEAL_WIDTH / 2;
      setRevealed(shouldReveal);
      setDragX(shouldReveal ? -REVEAL_WIDTH : 0);
    }
    startX.current = null;
    axisRef.current = null;
  }

  function close() {
    setRevealed(false);
    setDragX(0);
  }

  return { dragX, revealed, close, revealWidth: REVEAL_WIDTH, handlers: { onTouchStart, onTouchMove, onTouchEnd } };
}
