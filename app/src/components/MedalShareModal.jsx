import { drawMedalCard } from '../lib/medalCardCanvas';
import ShareModalShell from './ShareModalShell';

// Reserved for the moment PointsBadge.jsx's lifetime points cross a new
// medal tier — a milestone card (tier-coloured double frame, see
// lib/cardFrame.js).
export default function MedalShareModal({ tierId, tierLabel, tierColor, points, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawMedalCard}
      drawArgs={{ tierId, tierLabel, tierColor, points, theme }}
      filename="medali-airmoon.png"
      shareTitle={`Medali ${tierLabel} - airmoon`}
      onClose={onClose}
    />
  );
}
