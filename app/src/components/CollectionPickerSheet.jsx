import { useState } from 'react';
import Portal from './Portal';

// A small bottom sheet for assigning an ayat favorite to a collection —
// existing collection names as tappable rows, plus a text field to create
// a new one. Reused nowhere else yet, but built as its own component
// (rather than inlined in AyatFavorit.jsx) the same way TafsirSheet/
// AyahActionSheet are, since a picker like this is a natural fit for a
// future "collections" feature elsewhere (e.g. Kutipan Inspirasi) too.
export default function CollectionPickerSheet({ existingCollections, current, onPick, onClose }) {
  const [newName, setNewName] = useState('');

  function submitNew(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onPick(name);
  }

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 52, display: 'flex', alignItems: 'flex-end' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--card)', borderRadius: '20px 20px 0 0', paddingBottom: 16 }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 12px' }} />
          <div style={{ padding: '0 20px 12px', textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--gold-ink)' }}>
            Pindahkan ke Koleksi
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
            <button
              onClick={() => onPick(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 12px',
                borderRadius: 12,
                border: 'none',
                background: !current ? 'var(--mint)' : 'transparent',
                color: !current ? 'var(--primary)' : 'inherit',
                fontSize: 13,
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Semua (tanpa koleksi)
            </button>
            {existingCollections.map((name) => (
              <button
                key={name}
                onClick={() => onPick(name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 12px',
                  borderRadius: 12,
                  border: 'none',
                  background: current === name ? 'var(--mint)' : 'transparent',
                  color: current === name ? 'var(--primary)' : 'inherit',
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                📁 {name}
              </button>
            ))}
          </div>

          <form onSubmit={submitNew} style={{ display: 'flex', gap: 8, padding: '12px 20px 0' }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Koleksi baru…"
              style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13 }}
            />
            <button type="submit" className="btn-outline" style={{ padding: '0 16px' }} disabled={!newName.trim()}>
              Buat
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
}
