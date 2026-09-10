import { drawPuasaSunnahCard } from '../lib/puasaSunnahCardCanvas';
import ShareModalShell from './ShareModalShell';

export default function PuasaSunnahShareModal({ totalCount, thisMonthCount, monthLabel, badgeLabel, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawPuasaSunnahCard}
      drawArgs={{ totalCount, thisMonthCount, monthLabel, badgeLabel, theme }}
      filename="puasa-sunnah.png"
      shareTitle="Progress Puasa Sunnah - airmoon"
      onClose={onClose}
    />
  );
}
