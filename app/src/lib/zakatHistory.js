// Riwayat Perhitungan Zakat — every previous calculation used to vanish
// the moment you changed a number or left the page, with no way to look
// back at "berapa zakat penghasilan bulan lalu". localStorage-only, same
// personal-scratch-record precedent as lib/warisScenarios.js (a
// calculation result, not a payment record — lib/donations.js's
// `contributions` subcollection is the real server-tracked money trail,
// this is just personal note-taking on top of it).
const KEY = 'airmoon-zakat-history';
const MAX = 15;

export function loadZakatHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// `type` is 'penghasilan' | 'maal'. `inputs` and `amount` are kept
// separate (rather than just storing the final number) so a past entry
// still shows what income/needs or assets/gold-price actually produced it.
export function saveZakatHistoryEntry(type, inputs, amount) {
  try {
    const next = [{ id: `${Date.now()}`, type, inputs, amount, at: Date.now() }, ...loadZakatHistory()].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadZakatHistory();
  }
}

export function deleteZakatHistoryEntry(id) {
  try {
    const next = loadZakatHistory().filter((e) => e.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadZakatHistory();
  }
}
