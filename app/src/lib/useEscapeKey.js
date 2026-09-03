import { useEffect } from 'react';

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
}
