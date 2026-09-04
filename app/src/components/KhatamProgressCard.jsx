import { useEffect, useState } from 'react';
import { watchKhatamProgress, resetKhatamProgress, TOTAL_MUSHAF_PAGES, TOTAL_JUZ } from '../lib/khatamProgress';
import { watchReadingStats } from '../lib/readingTime';
import { watchReadingGoal, setReadingGoalTarget } from '../lib/readingGoal';
import { watchReadingStreak } from '../lib/readingStreak';
import ConfirmDialog from './ConfirmDialog';
import KhatamCertificateModal from './KhatamCertificateModal';
import Confetti from './Confetti';

const CELEBRATED_KEY = 'airmoon-khatam-celebrated';
const GOAL_OPTIONS = [1, 2, 3, 5];

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
  const [readingGoal, setReadingGoalState] = useState({ pagesPerDay: 0, pagesToday: [] });
  const [readingStreak, setReadingStreak] = useState({ current: 0, best: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGoalPicker, setShowGoalPicker] = useState(false);

  useEffect(() => watchKhatamProgress(uid, setProgress), [uid]);
  useEffect(() => watchReadingStats(uid, setReadingStats), [uid]);
  useEffect(() => watchReadingGoal(uid, setReadingGoalState), [uid]);
  useEffect(() => watchReadingStreak(uid, setReadingStreak), [uid]);

  const pageCount = progress.pages.length;
  const totalMinutes = readingStats.totalMinutes || 0;
  const isKhatam = pageCount >= TOTAL_MUSHAF_PAGES;

  // Celebrates once per completion, not once per visit — a localStorage
  // flag rather than comparing against a previous render, since this
  // card unmounts/remounts every time someone navigates away from
  // SurahList and back. Cleared on reset (below) so a future re-khatam
  // gets its own celebration.
  useEffect(() => {
    if (!isKhatam) return;
    if (localStorage.getItem(CELEBRATED_KEY) === '1') return;
    localStorage.setItem(CELEBRATED_KEY, '1');
    setShowConfetti(true);
  }, [isKhatam]);

  if (pageCount === 0 && totalMinutes === 0) return null; // nothing to show before any reading has happened at all

  const pct = pageCount > 0 ? Math.min(100, Math.round((pageCount / TOTAL_MUSHAF_PAGES) * 100)) : 0;
  const juzCount = progress.juz.length;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeLabel = hours > 0 ? `${hours} jam ${mins} menit` : `${mins} menit`;

  return (
    <div
      className="card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 14,
        background: 'linear-gradient(155deg, var(--card) 55%, var(--mint-soft) 130%)',
      }}
    >
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
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

      {readingStreak.current > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
          <span>🔥 Streak baca: <strong style={{ color: 'var(--ink)' }}>{readingStreak.current} hari</strong> berturut-turut{readingStreak.best > readingStreak.current ? ` (rekor ${readingStreak.best} hari)` : ''}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px', borderRadius: 12, background: 'var(--bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>🎯 Target Baca Harian</span>
          <button
            onClick={() => setShowGoalPicker((v) => !v)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            {readingGoal.pagesPerDay > 0 ? 'Ubah' : 'Atur'}
          </button>
        </div>

        {showGoalPicker && (
          <div style={{ display: 'flex', gap: 6 }}>
            {GOAL_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => {
                  setReadingGoalTarget(uid, n);
                  setShowGoalPicker(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  border: readingGoal.pagesPerDay === n ? 'none' : '1px solid var(--border)',
                  background: readingGoal.pagesPerDay === n ? 'var(--primary)' : 'var(--card)',
                  color: readingGoal.pagesPerDay === n ? 'var(--on-primary)' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                {n} hlm
              </button>
            ))}
          </div>
        )}

        {readingGoal.pagesPerDay > 0 && !showGoalPicker && (
          <>
            <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.round((readingGoal.pagesToday.length / readingGoal.pagesPerDay) * 100))}%`,
                  background: readingGoal.pagesToday.length >= readingGoal.pagesPerDay ? 'var(--success)' : 'var(--gold-ink)',
                  transition: 'width 0.25s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>
              {readingGoal.pagesToday.length >= readingGoal.pagesPerDay
                ? '✅ Target hari ini tercapai!'
                : `${readingGoal.pagesToday.length}/${readingGoal.pagesPerDay} halaman hari ini`}
            </span>
          </>
        )}
      </div>

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
            localStorage.removeItem(CELEBRATED_KEY);
            setShowResetConfirm(false);
          }}
        />
      )}

      {showCertificate && <KhatamCertificateModal onClose={() => setShowCertificate(false)} />}
    </div>
  );
}
