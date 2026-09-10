import { drawSejarahIslamCard } from '../lib/sejarahIslamCardCanvas';
import ShareModalShell from './ShareModalShell';

// Sejarah Islam share card — has the "Lock Screen HP" wallpaper option
// (one of the 4 cards scoped for it, 2026-09-07). theme comes in as a prop.
export default function SejarahIslamShareModal({ title, year, text, photoIndex, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawSejarahIslamCard}
      drawArgs={{ title, year, text, photoIndex, theme }}
      filename="sejarah-islam.png"
      wallpaperFilename="sejarah-islam-lockscreen.png"
      shareTitle="Sejarah Islam - airmoon"
      wallpaper
      onClose={onClose}
    />
  );
}
