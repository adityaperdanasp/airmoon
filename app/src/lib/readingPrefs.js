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
// Adjustable Arabic text size for Mode Ayat only — deliberately not wired
// into Mode Mushaf. A real Mushaf page's per-line font size is already
// auto-computed by MushafReader's own shrink-to-fit loop to preserve the
// authentic "one printed line = one screen line" pagination; layering a
// second, user-controlled size on top of that would either overflow a
// line or force a wrap a real Mushaf page can't have. Mode Ayat has no
// such constraint (each ayat just flows as its own block), so it's the
// one place a plain user preference is safe to apply.
const ARABIC_SIZE_KEY = 'airmoon-arabic-font-size';
export const MIN_ARABIC_SIZE = 18;
export const MAX_ARABIC_SIZE = 34;
export const DEFAULT_ARABIC_SIZE = 24;

export function useArabicFontSize() {
  const [size, setSize] = useState(() => {
    const saved = Number(localStorage.getItem(ARABIC_SIZE_KEY));
    return saved >= MIN_ARABIC_SIZE && saved <= MAX_ARABIC_SIZE ? saved : DEFAULT_ARABIC_SIZE;
  });
  useEffect(() => {
    localStorage.setItem(ARABIC_SIZE_KEY, String(size));
  }, [size]);
  return [size, setSize];
}

// Arabic font choice for Mode Ayat (2026-09-04) — same "safe to add here,
// not to Mode Mushaf" reasoning as the font-size hook above: Mushaf mode's
// QCF glyph fonts are per-page pre-shaped word images, not swappable
// typefaces at all, so a font picker only makes sense for Mode Ayat's
// plain Unicode text. Two options: 'Amiri' (this app's existing default,
// a general-purpose elegant Naskh design) and 'Scheherazade New' (a Google
// Font purpose-built for Quranic/classical Arabic text — see index.html's
// font `<link>`), so the choice is a real difference in reading feel, not
// a cosmetic-only swap.
const ARABIC_FONT_KEY = 'airmoon-arabic-font';
export const ARABIC_FONTS = [
  { id: 'Amiri', label: 'Amiri' },
  { id: 'Scheherazade New', label: 'Scheherazade' },
];

export function useArabicFont() {
  const [font, setFont] = useState(() => {
    const saved = localStorage.getItem(ARABIC_FONT_KEY);
    return ARABIC_FONTS.some((f) => f.id === saved) ? saved : ARABIC_FONTS[0].id;
  });
  useEffect(() => {
    localStorage.setItem(ARABIC_FONT_KEY, font);
  }, [font]);
  return [font, setFont];
}

// Auto-lanjut ke surah berikutnya (2026-09-05) — Mode Ayat's audio used
// to just stop after the last ayat of a surah (SurahReader.jsx's own
// handleEnded()), same as a physical mushaf naturally pausing at a surah
// boundary. Opt-in (default off) since jumping straight into the next
// surah's audio without any pause could surprise someone who didn't ask
// for continuous playback.
const AUTO_NEXT_SURAH_KEY = 'airmoon-auto-next-surah';

export function useAutoNextSurah() {
  const [autoNext, setAutoNext] = useState(() => localStorage.getItem(AUTO_NEXT_SURAH_KEY) === '1');
  useEffect(() => {
    localStorage.setItem(AUTO_NEXT_SURAH_KEY, autoNext ? '1' : '0');
  }, [autoNext]);
  return [autoNext, setAutoNext];
}

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
