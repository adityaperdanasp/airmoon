// Riwayat Kartu Ucapan — every template's content is fully fixed (no
// custom text field on this page), so "history" here is really just
// "which templates have I generated before, and when" rather than a log
// of distinct designs — still useful as a quick way back to a template
// used previously without re-picking from the swatch row. localStorage
// only, capped so it doesn't grow unbounded from repeat downloads of the
// same template.
const KEY = 'airmoon-kartu-ucapan-history';
const MAX = 6;

export function getKartuUcapanHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function logKartuUcapan(templateId) {
  try {
    const next = [{ templateId, at: Date.now() }, ...getKartuUcapanHistory().filter((h) => h.templateId !== templateId)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — history just won't remember this one.
  }
}
