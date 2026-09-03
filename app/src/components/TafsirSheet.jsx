import Portal from './Portal';
import { useEscapeKey } from '../lib/useEscapeKey';

// A shared bottom sheet for tafsir text, used by both SurahReader.jsx
// (its own toolbar button) and MushafReader.jsx's AyahActionSheet (a new
// row inside a sheet that's already open) — z-index sits above the
// regular modal layer (50) so it can stack on top of AyahActionSheet
// without fighting it for paint order.
export default function TafsirSheet({ title, loading, text, onClose }) {
  useEscapeKey(onClose);
  return (
    <Portal>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 52, display: 'flex', alignItems: 'flex-end' }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            maxHeight: '75vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--card)',
            borderRadius: '20px 20px 0 0',
          }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 4px', flexShrink: 0 }} />
          <div style={{ padding: '6px 20px 10px', textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--gold-ink)', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
            Tafsir · {title}
          </div>
          <div style={{ padding: '16px 20px 28px', overflowY: 'auto', fontSize: 13, lineHeight: 1.75, color: 'var(--ink)', whiteSpace: 'pre-line' }}>
            {loading ? (
              <div className="center" style={{ minHeight: 100 }}>
                <div className="spinner" />
              </div>
            ) : (
              text || 'Tafsir belum tersedia untuk ayat ini.'
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
