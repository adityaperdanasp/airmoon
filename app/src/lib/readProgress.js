// Reading progress for long reference pages (Panduan Manasik, Badal
// Umrah) that were pure static text before this — no way to mark how far
// through you'd gotten, unlike UmrohChecklist's real checkboxes.
// localStorage-only, per-device, keyed by section title (a stable-enough
// key here since these pages' section titles are hand-authored content,
// not user data that changes shape).
const PREFIX = 'airmoon-read-progress-';

export function loadReadProgress(pageKey) {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + pageKey) || '{}');
  } catch {
    return {};
  }
}

export function toggleReadProgress(pageKey, sectionTitle) {
  const current = loadReadProgress(pageKey);
  const next = { ...current, [sectionTitle]: !current[sectionTitle] };
  try {
    localStorage.setItem(PREFIX + pageKey, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — the toggle still updates the UI
    // for this session, it just won't survive a reload.
  }
  return next;
}
