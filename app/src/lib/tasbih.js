// Tasbih Digital — a real physical tasbih's counting behavior (each dzikir
// phrase keeps its own running count, you switch between them, taps ring
// a bead) rather than one flat "counter app" number. Local-only, no
// Firestore doc: the point is a fast frictionless tally, not a synced or
// shared record.

export const DZIKIR_PHRASES = [
  { id: 'subhanallah', arab: 'سُبْحَانَ اللّٰهِ', label: 'Subhanallah', arti: 'Maha Suci Allah' },
  { id: 'alhamdulillah', arab: 'اَلْحَمْدُ لِلّٰهِ', label: 'Alhamdulillah', arti: 'Segala puji bagi Allah' },
  { id: 'allahuakbar', arab: 'اَللّٰهُ أَكْبَرُ', label: 'Allahu Akbar', arti: 'Allah Maha Besar' },
  { id: 'astaghfirullah', arab: 'أَسْتَغْفِرُ اللّٰهَ', label: 'Astaghfirullah', arti: 'Aku memohon ampun kepada Allah' },
  { id: 'lailahaillallah', arab: 'لَا إِلٰهَ إِلَّا اللّٰهُ', label: 'Laa ilaaha illallah', arti: 'Tiada Tuhan selain Allah' },
];

export const TARGETS = [33, 99, 100];

const STORAGE_KEY = 'airmoon-tasbih-counts';

export function loadCounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    // Private-browsing mode or a corrupted value — start from zero rather
    // than crashing the page over a non-essential local cache.
    return {};
  }
}

export function saveCounts(counts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Storage unavailable/full — the count still works for this session,
    // it just won't survive a reload.
  }
}
