import { drawRamadanCard } from '../lib/ramadanCardCanvas';
import ShareModalShell from './ShareModalShell';

// drawRamadanCard doesn't take a theme (its palette is fixed) — hence no
// useTheme() here.
export default function RamadanShareModal({ puasaCount, tarawihCount, monthDays, hijriYear, onClose }) {
  return (
    <ShareModalShell
      draw={drawRamadanCard}
      drawArgs={{ puasaCount, tarawihCount, monthDays, hijriYear }}
      filename="progress-ramadan.png"
      shareTitle="Progress Ramadan - airmoon"
      onClose={onClose}
    />
  );
}
