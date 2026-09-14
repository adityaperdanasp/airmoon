import { useEffect, useRef } from 'react';

// Every bottom sheet/modal in this app (ConfirmDialog, TafsirSheet,
// AyahActionSheet, AyatCardModal, CollectionPickerSheet,
// SurahPreviewSheet, NotificationPrimer, AmalanShareModal,
// ReceiptShareModal) could only be dismissed by tapping the backdrop —
// no keyboard/switch-device way to close one at all. One shared hook
// instead of repeating the same addEventListener/cleanup in each.
const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useEscapeKey(onClose, containerRef) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap + initial focus (2026-09-14) — opt-in via `containerRef`,
  // so every existing call site that doesn't pass one keeps working
  // unchanged. Moves focus into the sheet on open (its first focusable
  // element, or the container itself if none), and keeps Tab/Shift+Tab
  // cycling inside it while open rather than leaking out to the page
  // behind — this hook's own focus-RESTORE logic below already returns
  // focus to the trigger once the sheet closes, so this only needed to
  // cover what happens while it's open.
  useEffect(() => {
    if (!containerRef) return;
    const container = containerRef.current;
    if (!container) return;
    const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
    (focusable[0] || container).focus();

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      const items = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [containerRef]);

  // [UI 2026-09-11] Focus restoration — since virtually every sheet/
  // modal in the app calls this same hook, this is the one place to fix
  // "keyboard/screen-reader focus never returns to the button that
  // opened the sheet" for all of them at once, rather than per-file.
  // Captures whatever was focused right before the sheet mounted
  // (almost always the trigger button) and gives it focus back once the
  // sheet actually unmounts — however it closed (Escape, backdrop tap,
  // swipe-dismiss, or the sheet's own confirm/cancel button all end in
  // the same unmount). A separate effect with an empty dependency array
  // — tying this to `onClose` (whose identity often changes on every
  // parent re-render, e.g. an inline arrow function) would otherwise
  // yank focus back mid-interaction on a re-render, before the sheet
  // was actually closed.
  const triggerRef = useRef(null);
  useEffect(() => {
    triggerRef.current = document.activeElement;
    return () => {
      const el = triggerRef.current;
      if (el && typeof el.focus === 'function' && document.body.contains(el)) {
        el.focus();
      }
    };
  }, []);
}
