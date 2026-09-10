import { CARD_OVERLAYS } from '../lib/cardOverlays';

// The swatch row shown inside AyatCardModal / QuoteCardModal (via
// ShareModalShell's `extra` slot) for picking the card's overlay tint —
// the photo-backed cards' equivalent of Kartu Ucapan's colour pickers.
export default function CardOverlayPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'center' }}>
      {CARD_OVERLAYS.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          aria-label={`Warna ${o.label}`}
          aria-pressed={value === o.id}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: value === o.id ? '2.5px solid #fff' : '2.5px solid transparent',
            background: o.swatch,
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
