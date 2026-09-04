// Badge Angka di Ikon App — the Badging API (navigator.setAppBadge/
// clearAppBadge), same mechanism WhatsApp/Gmail use for their unread-count
// icon badge. Real but partial support (installed PWAs on Chrome/Edge/
// Android, and iOS 16.4+ Safari once added to Home Screen; no support at
// all in a plain browser tab or on desktop Firefox) — feature-detected,
// every call is a silent no-op where unsupported rather than throwing.
export function isBadgingSupported() {
  return typeof navigator !== 'undefined' && 'setAppBadge' in navigator;
}

export function setAppBadgeCount(count) {
  if (!isBadgingSupported()) return;
  try {
    if (count > 0) navigator.setAppBadge(count);
    else navigator.clearAppBadge();
  } catch {
    // Some browsers advertise the API but reject the call in certain
    // contexts (e.g. not actually installed) — badge just doesn't show.
  }
}

export function clearAppBadge() {
  if (!isBadgingSupported()) return;
  try {
    navigator.clearAppBadge();
  } catch {
    // ignore
  }
}
