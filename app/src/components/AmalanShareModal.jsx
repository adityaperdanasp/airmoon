import { useMemo } from 'react';
import { drawAmalanCard } from '../lib/amalanCardCanvas';
import { useTheme } from '../context/ThemeContext';
import ShareModalShell from './ShareModalShell';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// Share today's Amalan Harian progress as an image — thin wrapper over the
// shared ShareModalShell (see that file's header).
export default function AmalanShareModal({ totalDone, totalItems, onClose }) {
  const { theme } = useTheme();
  const dateLabel = useMemo(() => dateFmt.format(new Date()), []);
  return (
    <ShareModalShell
      draw={drawAmalanCard}
      drawArgs={{ totalDone, totalItems, dateLabel, theme }}
      filename="amalan-harian.png"
      shareTitle="Progress Amalan Harian - airmoon"
      onClose={onClose}
    />
  );
}
