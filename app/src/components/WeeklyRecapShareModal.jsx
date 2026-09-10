import { drawWeeklyRecapCard } from '../lib/weeklyRecapCardCanvas';
import ShareModalShell from './ShareModalShell';

export default function WeeklyRecapShareModal({ totalScore, maxScore, bestDayScore, bestDayMax, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawWeeklyRecapCard}
      drawArgs={{ totalScore, maxScore, bestDayScore, bestDayMax, theme }}
      filename="capaian-mingguan.png"
      shareTitle="Capaian Mingguan - airmoon"
      onClose={onClose}
    />
  );
}
