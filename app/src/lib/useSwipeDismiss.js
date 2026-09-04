import { useRef, useState } from 'react';

const DISMISS_THRESHOLD = 80; // px dragged down before releasing closes the sheet

// Every bottom sheet in this app could previously only be dismissed by
// tapping the backdrop or pressing Escape (lib/useEscapeKey.js) — a real
// gap against the near-universal mobile convention of dragging a sheet
// down to close it. Touch-only, same rationale as PullToRefresh.jsx: this
// is specifically the phone gesture, not something to fake with mouse
// events on desktop.
//
// Returns `dragY` (how far the sheet should currently be visually
// offset), `dragging` (whether a drag is in progress, so callers can
// disable the closing CSS transition while actively dragging), and the
// touch event handlers to spread onto the sheet's own draggable panel.
export function useSwipeDismiss(onClose) {
  const startY = useRef(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  function onTouchStart(e) {
    startY.current = e.touches[0].clientY;
    setDragging(true);
  }

  function onTouchMove(e) {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setDragY(dy);
  }

  function onTouchEnd() {
    setDragging(false);
    if (dragY > DISMISS_THRESHOLD) {
      onClose();
    }
    setDragY(0);
    startY.current = null;
  }

  return {
    dragY,
    dragging,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
