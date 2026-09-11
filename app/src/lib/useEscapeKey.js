import { useEffect, useRef } from 'react';

// Every bottom sheet/modal in this app (ConfirmDialog, TafsirSheet,
// AyahActionSheet, AyatCardModal, CollectionPickerSheet,
// SurahPreviewSheet, NotificationPrimer, AmalanShareModal,
// ReceiptShareModal) could only be dismissed by tapping the backdrop —
// no keyboard/switch-device way to close one at all. One shared hook
// instead of repeating the same addEventListener/cleanup in each.
export function useEscapeKey(onClose) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
