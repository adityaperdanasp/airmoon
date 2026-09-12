// Fitur-baru spotlight sesuai minat (2026-09-12) — "Yang Baru" only ever
// surfaced through a small badge dot on the Lainnya tile; someone whose
// onboarding interest (lib/interestTag.js) actually matches what just
// shipped had no stronger nudge than that. A plain localStorage
// "last version spotlighted" flag — this is a UI nudge, not data the
// founder needs to read back, so it doesn't need Firestore.
const SEEN_KEY = 'airmoon-changelog-spotlight-seen-version';

export function shouldShowChangelogSpotlight(entry, interestTag) {
  if (!entry?.interestTags?.includes(interestTag)) return false;
  try {
    const seenVersion = Number(localStorage.getItem(SEEN_KEY));
    return seenVersion !== entry.version;
  } catch {
    return false;
  }
}

export function markChangelogSpotlightSeen(version) {
  try {
    localStorage.setItem(SEEN_KEY, String(version));
  } catch {
    // ignore
  }
}
