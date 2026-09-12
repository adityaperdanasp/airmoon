import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Survei NPS super ringan (2026-09-12) — a real gap: this app has no
// product-analytics suite, so "are people actually happy with this app"
// had no answer beyond founder intuition and the occasional in-app
// feedback submission. One question, shown occasionally (same
// localStorage timing shape as lib/ratingPrompt.js, deliberately
// starting later — 14 days, not 7 — and gated separately so the two
// full-screen prompts never compete for the same visit).
const FIRST_OPEN_KEY = 'airmoon-first-open-at'; // shared with ratingPrompt.js — same real "first ever visit" moment
const DISMISSED_KEY = 'airmoon-nps-dismissed';
const LAST_SHOWN_KEY = 'airmoon-nps-last-shown';

const DAYS_BEFORE_FIRST_PROMPT = 14;
const DAYS_BETWEEN_REPROMPTS = 60;

function daysSince(ts) {
  return (Date.now() - ts) / 86400000;
}

export function shouldShowNpsPrompt() {
  try {
    if (localStorage.getItem(DISMISSED_KEY) === '1') return false;

    const firstOpen = Number(localStorage.getItem(FIRST_OPEN_KEY));
    if (!firstOpen || daysSince(firstOpen) < DAYS_BEFORE_FIRST_PROMPT) return false;

    const lastShown = Number(localStorage.getItem(LAST_SHOWN_KEY));
    if (lastShown && daysSince(lastShown) < DAYS_BETWEEN_REPROMPTS) return false;

    return true;
  } catch {
    return false;
  }
}

export function markNpsPromptShown() {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {
    // Storage blocked — worst case this shows again next visit, not worth failing over.
  }
}

export function dismissNpsPromptForever() {
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // ignore
  }
}

export async function submitNpsResponse(uid, score) {
  await addDoc(collection(db, 'npsResponses'), { uid, score, createdAt: serverTimestamp() });
}
