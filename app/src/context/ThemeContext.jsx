import { createContext, useContext, useEffect, useState } from 'react';
import { loadAccentColor, applyAccentColor } from '../lib/accentColor';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'airmoon-theme';

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }) {
  // `preference` is what's actually stored/selected — 'light' | 'dark' |
  // 'system'. Defaults to 'system' now (was hardcoded 'light' before,
  // ignoring the device's own setting entirely) so a first-time visitor
  // whose phone is in dark mode doesn't get a jarring bright-white app on
  // first open. `theme` stays the resolved 'light'/'dark' value existing
  // consumers (Login/SignUp/Home picking which photo variant to show)
  // already expect — they never need to know about 'system' at all.
  const [preference, setPreference] = useState(() => localStorage.getItem(STORAGE_KEY) || 'system');
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  // Pilihan Warna Aksen — applied once here at app boot (this provider
  // wraps the whole app, so this runs exactly once regardless of which
  // page someone lands on first) rather than only when visiting
  // Pengaturan, which is where it's actually chosen.
  useEffect(() => {
    applyAccentColor(loadAccentColor());
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Keeps the browser's own chrome (Android Chrome's address bar, iOS
    // Safari's status bar area) in sync with the actually-applied theme —
    // a single static <meta name="theme-color"> (index.html's own tag,
    // still there as the pre-JS default) can't react to a manual
    // Light/Dark override the way a `media="(prefers-color-scheme)"`
    // meta pair could, since that only tracks the OS setting, not this
    // app's own 'system'|'light'|'dark' preference. Mirrors --primary's
    // per-theme value (theme.css) rather than --bg, matching the existing
    // design intent of tinting the chrome with the brand color, not the
    // page background.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#a8823c' : '#0d4d47');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  const toggleTheme = () => setPreference((t) => (theme === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, preference, setTheme: setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
