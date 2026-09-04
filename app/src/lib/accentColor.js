// Pilihan Warna Aksen — beyond Light/Dark/System, there was no way to
// personalize the app's own highlight color at all; every user saw the
// same teal/gold brand palette (theme.css's [data-theme] token set)
// regardless of taste. A curated set, not a free color picker — each
// option's `primary`/`primaryDark` pair is deliberately dark enough that
// the existing white `--on-primary` text (buttons, active nav pill, etc.)
// stays legible, the same contrast constraint theme.css's own tokens are
// built around. Applied as inline custom-property overrides directly on
// <html> — they take precedence over theme.css's stylesheet rules
// regardless of light/dark theme, which keeps this one property to
// manage instead of needing separate light/dark variants per accent.
export const ACCENT_OPTIONS = [
  { id: 'default', label: 'Emas (Default)', swatch: '#0d4d47' },
  { id: 'zamrud', label: 'Zamrud', swatch: '#1f7a4d', primary: '#1f7a4d', primaryDark: '#12492e', accent: '#8fe0b4' },
  { id: 'safir', label: 'Safir', swatch: '#1d4e89', primary: '#1d4e89', primaryDark: '#122f54', accent: '#9cc3ee' },
  { id: 'marun', label: 'Marun', swatch: '#7a2233', primary: '#7a2233', primaryDark: '#4a1420', accent: '#eeaab6' },
  { id: 'ungu', label: 'Ungu', swatch: '#5b3a8e', primary: '#5b3a8e', primaryDark: '#382258', accent: '#d3bbf5' },
];

const KEY = 'airmoon-accent-color';

export function loadAccentColor() {
  try {
    const saved = localStorage.getItem(KEY);
    return ACCENT_OPTIONS.some((o) => o.id === saved) ? saved : 'default';
  } catch {
    return 'default';
  }
}

export function applyAccentColor(id) {
  const opt = ACCENT_OPTIONS.find((o) => o.id === id) || ACCENT_OPTIONS[0];
  const root = document.documentElement;
  if (opt.id === 'default') {
    root.style.removeProperty('--primary');
    root.style.removeProperty('--primary-dark');
    root.style.removeProperty('--accent');
  } else {
    root.style.setProperty('--primary', opt.primary);
    root.style.setProperty('--primary-dark', opt.primaryDark);
    root.style.setProperty('--accent', opt.accent);
  }
}

export function setAccentColor(id) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // Private-browsing/full storage — the override still applies this
    // session via applyAccentColor(), it just won't survive a reload.
  }
  applyAccentColor(id);
}
