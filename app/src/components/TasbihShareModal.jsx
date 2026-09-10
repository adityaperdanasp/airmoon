import { drawTasbihCard } from '../lib/tasbihCardCanvas';
import { useTheme } from '../context/ThemeContext';
import ShareModalShell from './ShareModalShell';

export default function TasbihShareModal({ phraseLabel, phraseArab, count, laps, target, onClose }) {
  const { theme } = useTheme();
  return (
    <ShareModalShell
      draw={drawTasbihCard}
      drawArgs={{ phraseLabel, phraseArab, count, laps, target, theme }}
      filename="tasbih.png"
      shareTitle="Tasbih Digital - airmoon"
      onClose={onClose}
    />
  );
}
