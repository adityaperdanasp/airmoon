import { useEffect, useState } from 'react';
import { watchKhatamProgress, resetKhatamProgress, TOTAL_MUSHAF_PAGES, TOTAL_JUZ } from '../lib/khatamProgress';
import { watchReadingStats } from '../lib/readingTime';
import ConfirmDialog from './ConfirmDialog';
import KhatamCertificateModal from './KhatamCertificateModal';

// A compact progress display on SurahList.jsx — "how much of the whole
// Mushaf have I actually paged through" (filled in by MushafReader.jsx's
// own markPageRead() call every time a page loads), plus total time spent
// reading (Mode Ayat + Mode Mushaf combined — see lib/readingTime.js).
// Read-only display plus a reset action for the page progress; no direct
// "mark as read" control since a page only counts by actually being
// opened in Mode Mushaf.
export default function KhatamProgressCard({ uid }) {
  const [progress, setProgress] = useState({ pages: [], juz: [] });
  const [readingStats, setReadingStats] = useState({ totalMinutes: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => watchKhatamProgress(uid, setProgress), [uid]);
  useEffect(() => watchReadingStats(uid, setReadingStats), [uid]);

  const pageCount = progress.pages.length;
  const totalMinutes = readingStats.totalMinutes || 0;
  if (pageCount === 0 && totalMinutes === 0) return null; // nothing to show before any reading has happened at all

  const pct = pageCount > 0 ? Math.min(100, Math.round((pageCount / TOTAL_MUSHAF_PAGES) * 100)) : 0;
  const juzCount = progress.juz.length;
  const isKhatam = pageCount >= TOTAL_MUSHAF_PAGES;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, fontWeight: 800 }}>📖 Progress Khatam Qur'an</span>
        {pageCount > 0 && (
          <button
            onClick={() => setShowResetConfirm(true)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 10.5, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
          >
            Reset
          </button>
        )}
      </div>

      {pageCount > 0 && (
        <>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold-ink)', transition: 'width 0.25s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
            <span>{pageCount}/{TOTAL_MUSHAF_PAGES} halaman ({pct}%)</span>
            <span>{juzCount}/{TOTAL_JUZ} juz disentuh</span>
          </div>
        </>
      )}

      {totalMinutes > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
          <span>⏱ Total waktu baca: <strong style={{ color: 'var(--ink)' }}>{timeLabel}</strong></span>
        </div>
      )}

      {isKhatam && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--cream)' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--gold-ink)' }}>🎉 Alhamdulillah, khatam selesai!</span>
          <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => setShowCertificate(true)}>
            Bagikan
          </button>
        </div>
      )}

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

      {showCertificate && <KhatamCertificateModal onClose={() => setShowCertificate(false)} />}
    </div>
  );
}
