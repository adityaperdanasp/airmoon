// "Have I seen the latest changelog entry" — same single-localStorage-
// value idea as lib/notificationLog.js's hasUnseenNotifications(), just
// compared against data/changelog.js's CURRENT_VERSION instead of an
// IndexedDB log's newest timestamp.
import { CURRENT_VERSION } from '../data/changelog';

const KEY = 'airmoon-changelog-seen-version';

export function hasUnseenChangelog() {
  const seen = Number(localStorage.getItem(KEY)) || 0;
  return seen < CURRENT_VERSION;
}

export function markChangelogSeen() {
  try {
    localStorage.setItem(KEY, String(CURRENT_VERSION));
  } catch {
    // Private-browsing/full storage — the dot just won't clear this session.
  }
}
