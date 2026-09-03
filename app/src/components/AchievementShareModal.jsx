import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { watchKhatamProgress, TOTAL_MUSHAF_PAGES } from '../lib/khatamProgress';
import { watchDzikirStreak } from '../lib/dzikirStreak';
import { watchMyContributions } from '../lib/donations';
import { highestTier } from '../lib/badges';
import { drawAchievementCard } from '../lib/achievementCardCanvas';
import { canvasToFile } from '../lib/ayatCardCanvas';
import { shareFile } from '../lib/share';
import { useEscapeKey } from '../lib/useEscapeKey';

function formatRupiah(n) {
  return `Rp${n.toLocaleString('id-ID')}`;
}

// A combined "Kartu Pencapaian" — pulls 3 stats that previously only had
// their own separate, single-metric share cards (Khatam certificate,
// Amalan daily progress, donation receipts) into one shareable summary.
// All 3 sources are one-shot reads here (unsubscribed right after the
// first snapshot) rather than kept live — this is a point-in-time
// snapshot for a share image, not a live-updating dashboard.
export default function AchievementShareModal({ onClose }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState(null);
  useEscapeKey(onClose);

  useEffect(() => {
    if (!user?.uid) return;
    let gotKhatam = false;
    let gotStreak = false;
    let gotContrib = false;
    let khatamPct = 0;
    let badgeLabel = 'Belum ada';
    let totalSedekah = 0;

    function maybeSettle() {
      if (gotKhatam && gotStreak && gotContrib) {
        setStats({ khatamPct, badgeLabel, totalSedekah });
      }
    }

    const unsubKhatam = watchKhatamProgress(user.uid, (k) => {
      khatamPct = Math.round(((k.pages?.length || 0) / TOTAL_MUSHAF_PAGES) * 100);
      gotKhatam = true;
      maybeSettle();
      unsubKhatam();
    });
    const unsubStreak = watchDzikirStreak(user.uid, (streaks) => {
      const bestDays = Math.max(streaks?.pagi?.best || 0, streaks?.petang?.best || 0);
      const tier = highestTier(bestDays);
      badgeLabel = tier ? `${tier.icon} ${tier.label}` : `${bestDays} Hari`;
      gotStreak = true;
      maybeSettle();
      unsubStreak();
    });
    const unsubContrib = watchMyContributions(user.uid, (rows) => {
      totalSedekah = rows.reduce((sum, r) => sum + (r.amount || 0), 0);
      gotContrib = true;
      maybeSettle();
      unsubContrib();
    });

    return () => {
      unsubKhatam();
      unsubStreak();
      unsubContrib();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!stats) return;
    let cancelled = false;
    setReady(false);
    drawAchievementCard(canvasRef.current, {
      displayName: user?.displayName || 'Sahabat airmoon',
      khatamPct: stats.khatamPct,
      badgeLabel: stats.badgeLabel,
      totalSedekah: formatRupiah(stats.totalSedekah),
      theme,
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [stats, user, theme]);

  async function handleDownload() {
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kartu-pencapaian-airmoon.png';
    a.click();
  }

  async function handleShare() {
    const file = await canvasToFile(canvasRef.current, 'kartu-pencapaian.png');
    await shareFile({ file, title: 'Kartu Pencapaian airmoon', onFallback: handleDownload });
  }

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <canvas ref={canvasRef} width={1080} height={1350} style={{ width: '100%', display: 'block', aspectRatio: '4 / 5' }} />
          {!ready && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a3630' }}>
              <div className="spinner" style={{ borderTopColor: '#fff' }} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" onClick={handleDownload} disabled={!ready} style={{ background: '#fff' }}>Simpan</button>
          <button className="btn" onClick={handleShare} disabled={!ready}>Bagikan</button>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', padding: 8 }}>
          Tutup
        </button>
      </div>
    </div>,
    document.body
  );
}
