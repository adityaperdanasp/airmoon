import { useEffect, useState } from 'react';

const NIGHT_KEY = 'airmoon-reading-night-mode';

// Reading-session dark mode — independent from the app-wide theme toggle in
// Pengaturan (ThemeProvider/data-theme). Someone can keep the rest of the
// app light and still read at night with a dark page, or vice versa; this
// is its own persisted preference, not derived from the app theme.
export function useNightMode() {
  const [night, setNight] = useState(() => localStorage.getItem(NIGHT_KEY) === '1');
  useEffect(() => {
    localStorage.setItem(NIGHT_KEY, night ? '1' : '0');
  }, [night]);
  return [night, setNight];
}

// Overrides the same CSS custom properties theme.css already defines on
// :root/[data-theme] — spreading this onto a wrapping element's inline
// style re-scopes every var(--token) used anywhere inside that subtree
// (buttons, borders, ayah marks, banners, all of it) without touching each
// element individually or fighting the app-wide theme.
//
// Includes `color: var(--ink)`, not just the --ink custom property itself —
// theme.css sets `body { color: var(--ink) }`, which resolves once at body
// level using the *global* --ink and is what descendants actually inherit;
// simply redefining --ink deeper in the tree doesn't retroactively change
// an already-inherited `color` value. Re-declaring `color: var(--ink)` here
// forces it to re-resolve against this element's own (overridden) --ink —
// found by shipping without it first: backgrounds/borders went dark
// correctly (each of those is set via an explicit var() on its own
// element), but body text stayed near-invisible dark-on-dark.
export const NIGHT_STYLE_VARS = {
  '--bg': '#0d0d0d',
  '--ink': '#ececec',
  '--muted': '#a6a6a6',
  '--muted-soft': '#787878',
  '--card': '#1c1c1c',
  '--border': '#3a3a3a',
  '--cream': '#2a2410',
  '--gold-ink': '#f0cd7b',
  // A solid dark green (#123328) here reads as almost the same shade as
  // --bg/--card, which is invisible for MushafReader's "resume here" ring
  // (`boxShadow: 0 0 0 4px var(--mint)` on AyahEndMark) — confirmed via a
  // side-by-side swatch test before/after. The app's own real dark theme
  // (theme.css [data-theme='dark']) already solves this the same way: a
  // translucent bright mint tint instead of a solid dark one. Matched that
  // pattern here (slightly more opaque than theme.css's 0.14, since this
  // also has to work as an attention ring, not just a card tint).
  '--mint': 'rgba(110, 231, 201, 0.45)',
  '--mint-soft': 'rgba(110, 231, 201, 0.12)',
  '--primary': '#6ee7c9',
  '--primary-dark': '#4fd3b0',
  color: 'var(--ink)',
};
