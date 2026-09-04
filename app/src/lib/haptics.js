// Getar Halus (Haptic) — Tasbih.jsx was the only place in this whole app
// that ever called navigator.vibrate(), despite plenty of other taps
// being just as worth a tactile confirmation (marking an Amalan Harian
// item done, favoriting an ayat). One shared, feature-detected helper
// instead of each call site guessing at its own duration/pattern.
function vibrate(pattern) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers advertise the API but throw outside a user gesture,
    // or on a platform that doesn't actually have a vibration motor
    // (most desktops) — never worth crashing the actual action over.
  }
}

// A quick, light tick — the same weight Tasbih.jsx's own per-tap buzz
// already uses, for a routine "this registered" confirmation (checking
// off an Amalan item, toggling a favorite).
export function hapticTick() {
  vibrate(12);
}

// A slightly stronger double-pulse — reserved for a genuinely bigger
// moment (reaching a badge tier, completing a checklist), so it reads as
// more significant than the routine tick above.
export function hapticSuccess() {
  vibrate([15, 40, 15]);
}
