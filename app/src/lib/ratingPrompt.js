// Minta Rating App — there's deliberately no Play Store/App Store link
// here: android-native/ is confirmed NOT published to Play Store yet
// (still a GitHub Actions debug-APK artifact, per CLAUDE.md), and there's
// no iOS app or web app-store listing at all. Linking to a store page
// that doesn't exist would be a broken/dishonest prompt, so this asks for
// real in-app star + text feedback instead (stored to Firestore, see
// submitFeedback below) — a genuine channel the founder can actually read,
// rather than a fake "rate us" button pointing nowhere.
const FIRST_OPEN_KEY = 'airmoon-first-open-at';
const DISMISSED_KEY = 'airmoon-rating-prompt-dismissed'; // permanent "never ask again"
const LAST_SHOWN_KEY = 'airmoon-rating-prompt-last-shown';

const DAYS_BEFORE_FIRST_PROMPT = 7;
const DAYS_BETWEEN_REPROMPTS = 30; // if they picked "Nanti Aja" instead of dismissing for good

function daysSince(ts) {
  return (Date.now() - ts) / 86400000;
}

export function shouldShowRatingPrompt() {
  try {
    if (localStorage.getItem(DISMISSED_KEY) === '1') return false;

    let firstOpen = Number(localStorage.getItem(FIRST_OPEN_KEY));
    if (!firstOpen) {
      firstOpen = Date.now();
      localStorage.setItem(FIRST_OPEN_KEY, String(firstOpen));
      return false; // never prompt on the very first-ever visit
    }
    if (daysSince(firstOpen) < DAYS_BEFORE_FIRST_PROMPT) return false;

    const lastShown = Number(localStorage.getItem(LAST_SHOWN_KEY));
    if (lastShown && daysSince(lastShown) < DAYS_BETWEEN_REPROMPTS) return false;

    return true;
  } catch {
    return false;
  }
}

export function markRatingPromptShown() {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {
    // Storage blocked — worst case this shows again next visit, not worth failing over.
  }
}

export function dismissRatingPromptForever() {
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // ignore
  }
}
