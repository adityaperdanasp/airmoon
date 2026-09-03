import { createPortal } from 'react-dom';

// Renders children straight into document.body — same fix, generalized,
// as the one that solved BottomNav.jsx's "floating pill gets dragged up
// and stuck mid-screen" bug (2026-09-04): position: fixed only resolves
// against the true viewport as long as *no ancestor* has a transform/
// filter/perspective/will-change/contain. Every one of this app's other
// full-screen overlays (ConfirmDialog, NotificationPrimer, AyatCardModal,
// ToastContext's stack) has the identical vulnerability — they're just
// `inset: 0`/full-viewport, so a broken containing block is far less
// visually obvious there than it was on a small bottom-pinned pill, but
// it's the same bug waiting to happen the next time a page's .screen (or
// any other ancestor) picks up a transform-triggering style. Used instead
// of repeating `createPortal(..., document.body)` at every call site.
export default function Portal({ children }) {
  return createPortal(children, document.body);
}
