// Skenario tersimpan — Kalkulator Waris only ever held one set of inputs
// at a time before this, so comparing "kalau ada anak laki-laki" against
// "kalau cuma anak perempuan" meant re-entering every field from scratch.
// localStorage only (same as Tasbih/Amalan-local features) — this is a
// personal what-if scratchpad, not something that needs to sync devices.
const KEY = 'airmoon-waris-scenarios';
const MAX = 10;

export function loadWarisScenarios() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveWarisScenario(name, inputs) {
  try {
    const next = [{ id: `${Date.now()}`, name, inputs, savedAt: Date.now() }, ...loadWarisScenarios()].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadWarisScenarios();
  }
}

export function deleteWarisScenario(id) {
  try {
    const next = loadWarisScenarios().filter((s) => s.id !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return loadWarisScenarios();
  }
}
