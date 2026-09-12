import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Survei churn super singkat (2026-09-12) — for someone returning after
// a real absence (30+ days, via lib/lastSeen.js), one quick multi-choice
// question instead of guessing why usage dipped. Same localStorage
// timing-gate shape as lib/ratingPrompt.js/lib/npsPrompt.js, a longer
// cooldown (60 days) since this only makes sense to ask again after
// another real gap, not on a schedule.
const DISMISSED_KEY = 'airmoon-churn-survey-dismissed';
const LAST_SHOWN_KEY = 'airmoon-churn-survey-last-shown';
const MIN_GAP_DAYS = 60;
const MIN_DAYS_AWAY = 30;

export function shouldShowChurnSurvey(daysAway) {
  if (daysAway === null || daysAway < MIN_DAYS_AWAY) return false;
  try {
    if (localStorage.getItem(DISMISSED_KEY) === '1') return false;
    const lastShown = Number(localStorage.getItem(LAST_SHOWN_KEY));
    if (lastShown && (Date.now() - lastShown) / 86400000 < MIN_GAP_DAYS) return false;
    return true;
  } catch {
    return false;
  }
}

export function markChurnSurveyShown() {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

export function dismissChurnSurveyForever() {
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // ignore
  }
}

export async function submitChurnSurveyResponse(uid, reason, daysAway) {
  await addDoc(collection(db, 'churnSurveyResponses'), { uid, reason, daysAway, createdAt: serverTimestamp() });
}
