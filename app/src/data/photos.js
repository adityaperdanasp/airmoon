// Real Islamic-architecture photography (founder-supplied, licensed —
// resized/compressed from multi-MB originals down to ~900px-wide JPEGs
// under public/photos/ before being wired in here) used as hero/banner
// imagery across a few high-visibility screens: Login/SignUp, Home's
// header, and a handful of content-page headers. Deliberately theme-
// aware (a bright blue-sky set for light mode, a dusk/silhouette set for
// dark mode) rather than one fixed photo for both, per an explicit ask.

// Home's header rotates through one of these per day (same day-of-year
// pattern as data/headlines.js's todaysHeadlineIndex()) so it isn't the
// exact same photo every single day, without needing any user choice or
// stored state.
export const HOME_PHOTOS_LIGHT = ['/photos/home-light-1.jpg', '/photos/home-light-2.jpg', '/photos/home-light-3.jpg', '/photos/home-light-4.jpg'];
export const HOME_PHOTOS_DARK = ['/photos/home-dark-1.jpg', '/photos/home-dark-2.jpg'];

export function todaysHomePhoto(theme) {
  const pool = theme === 'dark' ? HOME_PHOTOS_DARK : HOME_PHOTOS_LIGHT;
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return pool[dayOfYear % pool.length];
}

// Login/SignUp's hero — a single fixed photo per theme, not rotated
// (these are seen once per session at most, not a daily-return screen).
export const AUTH_PHOTO_LIGHT = '/photos/login-light.jpg';
export const AUTH_PHOTO_DARK = '/photos/login-dark.jpg';

// One representative photo per content page — a fixed pairing per page
// rather than pulled from the rotating Home pool, so each page keeps a
// consistent, recognizable banner rather than changing under someone
// mid-visit or day to day.
export const PAGE_PHOTOS = {
  kiblat: '/photos/page-kiblat.jpg',
  jadwalSholat: '/photos/page-jadwal-sholat.jpg',
  cariMasjid: '/photos/page-cari-masjid.jpg',
  zakat: '/photos/page-zakat.jpg',
  quran: '/photos/page-quran.jpg',
  umroh: '/photos/page-umroh.jpg',
  kalenderHijriah: '/photos/page-kalender.jpg',
  doaHarian: '/photos/page-doa-harian.jpg',
};
