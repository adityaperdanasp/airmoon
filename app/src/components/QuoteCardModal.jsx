import { useState } from 'react';
import { drawQuoteCard } from '../lib/quoteCardCanvas';
import { useTheme } from '../context/ThemeContext';
import ShareModalShell from './ShareModalShell';
import CardOverlayPicker from './CardOverlayPicker';

// Kutipan Inspirasi share card — has the "Lock Screen HP" wallpaper option
// (one of the 4 cards scoped for it, 2026-09-07) and an overlay-tint
// picker (2026-09-10).
export default function QuoteCardModal({ quote, quoteIndex, onClose }) {
  const { theme } = useTheme();
  const [overlayId, setOverlayId] = useState('auto');
  return (
    <ShareModalShell
      draw={drawQuoteCard}
      drawArgs={{ arabic: quote.arabic, translation: quote.id, source: quote.source, quoteIndex, theme, overlayId }}
      filename={`kutipan-${quoteIndex + 1}.png`}
      wallpaperFilename={`kutipan-${quoteIndex + 1}-lockscreen.png`}
      shareTitle="Kutipan dari airmoon"
      wallpaper
      extra={<CardOverlayPicker value={overlayId} onChange={setOverlayId} />}
      onClose={onClose}
    />
  );
}
