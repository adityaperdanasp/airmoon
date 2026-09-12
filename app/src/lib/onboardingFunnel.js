import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// Onboarding funnel telemetry (2026-09-12) — this app has no product
// analytics suite at all (Firebase Analytics/GA4/Mixpanel — genuinely
// zero instrumentation anywhere in this codebase, a real gap flagged
// separately). This is the cheapest possible substitute for one specific
// question: where does OnboardingTour.jsx actually lose people? A single
// shared counter doc, incremented per step viewed — no per-user
// documents, nothing to read back client-side, the founder reads this
// via the Firestore console. Keep STEP_KEYS in sync with
// firestore.rules' matching `hasOnly` list if this ever changes.
const REF = doc(db, 'analytics', 'onboardingFunnel');

export async function trackOnboardingEvent(key) {
  try {
    await setDoc(REF, { [key]: increment(1) }, { merge: true });
  } catch {
    // Best-effort telemetry — never blocks the actual onboarding flow.
  }
}
