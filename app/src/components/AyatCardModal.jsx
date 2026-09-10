import { useState } from 'react';
import { drawAyatCard } from '../lib/ayatCardCanvas';
import { useTheme } from '../context/ThemeContext';
import ShareModalShell from './ShareModalShell';
import CardOverlayPicker from './CardOverlayPicker';

// Bagikan Ayat sebagai gambar — has the "Lock Screen HP" wallpaper option
// (one of the 4 cards scoped for it, 2026-09-07) and an overlay-tint
// picker (2026-09-10). `ayat` carries
// { arabic, translation, chapterName, chapter, verse }.
export default function AyatCardModal({ ayat, onClose }) {
  const { theme } = useTheme();
  const [overlayId, setOverlayId] = useState('auto');
  return (
    <ShareModalShell
      draw={drawAyatCard}
      drawArgs={{ ...ayat, theme, overlayId }}
      filename={`ayat-${ayat.chapter}-${ayat.verse}.png`}
      wallpaperFilename={`ayat-${ayat.chapter}-${ayat.verse}-lockscreen.png`}
      shareTitle="Ayat dari airmoon"
      wallpaper
      extra={<CardOverlayPicker value={overlayId} onChange={setOverlayId} />}
      onClose={onClose}
    />
  );
}
