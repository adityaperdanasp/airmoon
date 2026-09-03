import Portal from './Portal';
import { useEscapeKey } from '../lib/useEscapeKey';

// iOS Safari has no API to trigger "Add to Home Screen" programmatically —
// the whole flow only exists behind the Share sheet, which JS can't open.
// InstallAppCard's iOS variant used to be a plain text line with nothing
// to actually tap ("gak bisa dipencet" — a real, reported complaint: the
// card looked like a button but had no real interactive purpose beyond
// its tiny dismiss X). This sheet gives that tap something genuinely
// useful to do — real numbered steps with the actual Safari icon shapes,
// not just repeating the one-line hint that was already there.
export default function AddToHomeScreenSheet({ onClose }) {
  useEscapeKey(onClose);

  return (
    <Portal>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: 'var(--card)', borderRadius: '20px 20px 0 0', padding: '0 20px 24px' }}
        >
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border)', margin: '10px auto 16px' }} />
          <span style={{ fontSize: 15, fontWeight: 800, display: 'block', marginBottom: 4 }}>Pasang airmoon di Layar Utama</span>
          <span style={{ fontSize: 11.5, color: 'var(--muted)', display: 'block', marginBottom: 18 }}>
            Safari gak ngasih tombol pasang langsung — ikuti 3 langkah ini:
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)', fontSize: 12.5, fontWeight: 800, color: 'var(--primary)' }}>1</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>Ketuk ikon <strong>Share</strong> di bar bawah Safari</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" style={{ flexShrink: 0 }}>
                  <path d="M12 3v13M12 3 8 7M12 3l4 4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 14v4.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V14" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)', fontSize: 12.5, fontWeight: 800, color: 'var(--primary)' }}>2</div>
              <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>Scroll ke bawah, ketuk <strong>"Add to Home Screen"</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)', fontSize: 12.5, fontWeight: 800, color: 'var(--primary)' }}>3</div>
              <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>Ketuk <strong>"Add"</strong> di pojok kanan atas</span>
            </div>
          </div>

          <button className="btn-outline" style={{ marginTop: 20 }} onClick={onClose}>
            Mengerti
          </button>
        </div>
      </div>
    </Portal>
  );
}
