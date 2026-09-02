// Shared share-sheet helpers — consolidates 3 near-duplicate
// implementations (KutipanInspirasi.jsx, KartuUcapan.jsx,
// AyatCardModal.jsx) that had drifted slightly out of sync. A real,
// not just cosmetic, inconsistency: navigator.share() rejects when the
// user just closes/cancels the OS share sheet — that's not a real error,
// there's nothing to show for it — and only AyatCardModal.jsx was
// actually catching that; the other two would let it become an unhandled
// promise rejection.

export async function shareText({ text, title }) {
  if (navigator.share) {
    try {
      await navigator.share({ text, title });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  await navigator.clipboard.writeText(text);
  return 'copied';
}

// `onFallback` runs when there's no real share target for a file (no
// Web Share API, or the browser reports it can't share files at all) —
// callers pass their own download handler.
export async function shareFile({ file, title, onFallback }) {
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }
  onFallback?.();
  return 'fallback';
}
