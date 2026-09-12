import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Lightweight in-app error log (2026-09-12) — this app has no crash/error
// monitoring at all (Sentry/Crashlytics — a real, separately-flagged gap
// needing a paid third-party account). This is not a replacement for
// that: no stack symbolication, no dedup/grouping, no alerting, no
// breadcrumbs — just "an uncaught error happened, here's the message and
// URL", captured to a Firestore collection the founder can skim via the
// console. Genuinely better than the status quo (nothing at all), not a
// claim this solves the underlying gap.
const MAX_MESSAGE_LENGTH = 500;

async function logError(message, source) {
  try {
    await addDoc(collection(db, 'errorLogs'), {
      message: String(message || 'Unknown error').slice(0, MAX_MESSAGE_LENGTH),
      source,
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      createdAt: serverTimestamp(),
    });
  } catch {
    // The logger itself failing (offline, Firestore hiccup) must never
    // throw — that would just create a second error on top of the first.
  }
}

export function initErrorLog() {
  window.addEventListener('error', (event) => {
    logError(event.message, 'window.onerror');
  });
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason?.message || event.reason, 'unhandledrejection');
  });
}
