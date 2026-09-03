import { useEffect, useState } from 'react';
import { watchKhatamProgress, resetKhatamProgress, TOTAL_MUSHAF_PAGES, TOTAL_JUZ } from '../lib/khatamProgress';
import ConfirmDialog from './ConfirmDialog';

// A compact progress display on SurahList.jsx — "how much of the whole
// Mushaf have I actually paged through", filled in by MushafReader.jsx's
// own markPageRead() call every time a page loads. Read-only display plus
// a reset action; no direct "mark as read" control here since a page only
// counts by actually being opened in Mode Mushaf.
export default function KhatamProgressCard({ uid }) {
  const [progress, setProgress] = useState({ pages: [], juz: [] });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => watchKhatamProgress(uid, setProgress), [uid]);

  const pageCount = progress.pages.length;
  if (pageCount === 0) return null; // nothing to show before a first Mushaf page has ever been opened

  const pct = Math.min(100, Math.round((pageCount / TOTAL_MUSHAF_PAGES) * 100));
  const juzCount = progress.juz.length;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, fontWeight: 800 }}>📖 Progress Khatam Qur'an</span>
        <button
          onClick={() => setShowResetConfirm(true)}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 10.5, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
        >
          Reset
        </button>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold-ink)', transition: 'width 0.25s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
        <span>{pageCount}/{TOTAL_MUSHAF_PAGES} halaman ({pct}%)</span>
        <span>{juzCount}/{TOTAL_JUZ} juz disentuh</span>
      </div>

      {showResetConfirm && (
        <ConfirmDialog
          title="Reset progress khatam?"
          message="Riwayat halaman Mushaf yang udah pernah dibuka bakal dihapus, mulai dari 0 lagi."
          confirmLabel="Ya, Reset"
          danger
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={() => {
            resetKhatamProgress(uid);
            setShowResetConfirm(false);
          }}
        />
      )}
    </div>
  );
}
