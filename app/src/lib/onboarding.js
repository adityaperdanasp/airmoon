// Onboarding tour — nothing in this app ever explained what's here to a
// brand-new user beyond whatever they happened to tap into on their own;
// the 5-tab BottomNav plus a dozen-plus Lainnya features had zero guided
// introduction. localStorage flag, shown once ever (not once per device
// reset) — see components/OnboardingTour.jsx for the actual slides.
const KEY = 'airmoon-onboarding-seen';

export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return true; // fail closed — never nag if storage is blocked/unavailable
  }
}

export function markOnboardingSeen() {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    // Private-browsing/full storage — this'll just show again next visit,
    // not worth failing loudly over.
  }
}
