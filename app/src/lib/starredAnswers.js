// Simpan Jawaban Ust. Rewin — the only way to keep an AskMe answer
// before this was exporting/sharing the WHOLE transcript (lib/share.js's
// shareText, wired into AskMe.jsx's header). This is finer-grained: star
// one specific Q&A pair to keep even after the chat itself gets cleared
// or scrolls out of the 40-message cap (HISTORY_KEY in AskMe.jsx).
// localStorage-only, same personal-list precedent as this batch's other
// saved lists — snapshots the question+answer text directly rather than
// referencing a live message index, so removing/clearing the chat later
// never affects what's already starred.
const KEY = 'airmoon-askme-starred';
const MAX = 30;

export function loadStarredAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function starAnswer(question, answer) {
  try {
    const next = [{ id: `${Date.now()}`, question, answer, at: Date.now() }, ...loadStarredAnswers()].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadStarredAnswers();
  }
}

export function unstarAnswer(id) {
  try {
    const next = loadStarredAnswers().filter((e) => e.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadStarredAnswers();
  }
}
