import { drawRaporBulananCard } from '../lib/raporBulananCardCanvas';
import ShareModalShell from './ShareModalShell';

export default function RaporBulananShareModal({ monthLabel, report, sholatStreak, puasaCount, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawRaporBulananCard}
      drawArgs={{ monthLabel, report, sholatStreak, puasaCount, theme }}
      filename={`rapor-ibadah-${monthLabel.replace(/\s+/g, '-').toLowerCase()}.png`}
      shareTitle="Rapor ibadah - airmoon"
      onClose={onClose}
    />
  );
}
