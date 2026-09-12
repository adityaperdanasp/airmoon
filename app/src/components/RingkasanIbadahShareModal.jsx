import { drawRingkasanIbadahCard } from '../lib/ringkasanIbadahCardCanvas';
import ShareModalShell from './ShareModalShell';

export default function RingkasanIbadahShareModal({ displayName, khatamPct, badgeLabel, totalSedekah, puasaCount, readingStreakDays, readingTimeLabel, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawRingkasanIbadahCard}
      drawArgs={{ displayName, khatamPct, badgeLabel, totalSedekah, puasaCount, readingStreakDays, readingTimeLabel, theme }}
      filename="ringkasan-ibadah.png"
      shareTitle="Ringkasan Ibadah - airmoon"
      onClose={onClose}
    />
  );
}
