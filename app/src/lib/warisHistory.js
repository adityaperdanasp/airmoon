// Riwayat Perhitungan Waris — otomatis tersimpan tiap kali hasil
// berubah (beda dari Skenario Tersimpan, yang cuma tersimpan kalau user
// eksplisit tekan "+ Simpan Ini"). Sama precedent-nya kayak
// lib/zakatHistory.js: localStorage-only, catatan pribadi, bukan
// dokumen hukum. Capped + dedup biar gak numpuk entry identik kalau
// user cuma mondar-mandir ganti-ganti satu toggle bolak-balik.
const KEY = 'airmoon-waris-history';
const MAX = 20;

export function loadWarisHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// `inputs` is the full set of calcWaris() params (minus totalHarta,
// passed separately) so a past entry can be re-displayed or re-applied
// later without ambiguity about which heirs were selected.
export function saveWarisHistoryEntry(inputs, totalHarta, results) {
  try {
    const history = loadWarisHistory();
    const signature = JSON.stringify({ inputs, totalHarta });
    // Dedup against the most recent entry only — flipping back and
    // forth between two real distinct scenarios should still each get
    // their own entry, just not the same one repeated every render.
    if (history[0] && history[0].signature === signature) return history;
    const next = [{ id: `${Date.now()}`, inputs, totalHarta, results, signature, at: Date.now() }, ...history].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadWarisHistory();
  }
}

export function deleteWarisHistoryEntry(id) {
  try {
    const next = loadWarisHistory().filter((e) => e.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadWarisHistory();
  }
}

export function clearWarisHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Best-effort — nothing to recover from here.
  }
  return [];
}
