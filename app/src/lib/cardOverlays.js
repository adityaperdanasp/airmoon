// Preset overlay tints for the photo-backed share cards (Ayat Card,
// Kutipan Inspirasi). Those cards always drew one fixed brand-teal
// gradient over their photo — Kartu Ucapan already lets you pick colours,
// these didn't. A small *curated* set (not a free colour picker) keeps
// every result on-brand and legible: each pair is dark enough at the
// bottom for white body text to stay readable over any photo in the pool.
//
// `null` / 'auto' = keep the theme-derived default the card always used
// (teal in light, near-black in dark).
export const CARD_OVERLAYS = [
  { id: 'auto', label: 'Teal', from: 'rgba(13,77,71,0.6)', to: 'rgba(10,54,48,0.9)', swatch: '#0d4d47' },
  { id: 'bronze', label: 'Emas', from: 'rgba(92,63,22,0.55)', to: 'rgba(48,32,10,0.92)', swatch: '#5c3f16' },
  { id: 'maroon', label: 'Marun', from: 'rgba(84,26,38,0.55)', to: 'rgba(42,12,19,0.92)', swatch: '#541a26' },
  { id: 'navy', label: 'Navy', from: 'rgba(22,42,74,0.55)', to: 'rgba(10,20,40,0.92)', swatch: '#162a4a' },
  { id: 'ink', label: 'Gelap', from: 'rgba(16,18,16,0.5)', to: 'rgba(8,9,8,0.94)', swatch: '#101210' },
];

export function overlayStops(overlayId, theme) {
  if (overlayId && overlayId !== 'auto') {
    const o = CARD_OVERLAYS.find((x) => x.id === overlayId);
    if (o) return [o.from, o.to];
  }
  return theme === 'dark' ? ['rgba(11,12,10,0.55)', 'rgba(11,12,10,0.9)'] : ['rgba(13,77,71,0.6)', 'rgba(10,54,48,0.88)'];
}
