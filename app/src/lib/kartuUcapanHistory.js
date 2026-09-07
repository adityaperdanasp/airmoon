// Riwayat Kartu Ucapan — used to only log "which templateId", since the
// text was fixed at the time this was written. Now that title/sub are
// free text (see KartuUcapan.jsx's own custom-input note), the actual
// title used is logged too — otherwise "Cari di Riwayat" would have
// nothing real to search against beyond a bare color swatch.
// localStorage only, capped so it doesn't grow unbounded from repeat
// downloads.
const KEY = 'airmoon-kartu-ucapan-history';
const MAX = 6;

export function getKartuUcapanHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function logKartuUcapan(templateId, title = '') {
  try {
    const next = [{ templateId, title, at: Date.now() }, ...getKartuUcapanHistory().filter((h) => h.templateId !== templateId)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private-browsing/full storage — history just won't remember this one.
  }
}
