// Bahasa nudge (2026-09-12) — a one-time, dismissible banner for anyone
// whose browser locale is English but who's seeing the default Bahasa
// Indonesia UI (LangContext.jsx defaults to 'id' and only ever writes
// its own localStorage key once a user actually touches the toggle in
// Pengaturan.jsx). Points at the existing toggle rather than switching
// automatically — a silent auto-switch would be surprising for anyone
// who reads Indonesian fine but just has an English phone.
const DISMISS_KEY = 'airmoon-lang-nudge-dismissed';
const LANG_STORAGE_KEY = 'airmoon-lang'; // must mirror LangContext.jsx's own key

export function shouldShowLangNudge(currentLang) {
  if (typeof navigator === 'undefined') return false;
  if (localStorage.getItem(DISMISS_KEY)) return false;
  if (localStorage.getItem(LANG_STORAGE_KEY)) return false;
  const browserLang = (navigator.language || '').toLowerCase();
  return currentLang === 'id' && browserLang.startsWith('en');
}

export function dismissLangNudge() {
  localStorage.setItem(DISMISS_KEY, '1');
}
