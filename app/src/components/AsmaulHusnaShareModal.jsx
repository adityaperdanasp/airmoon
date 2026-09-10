import { drawAsmaulHusnaCard } from '../lib/asmaulHusnaCardCanvas';
import ShareModalShell from './ShareModalShell';

// Share one of the 99 names as an image — thin wrapper over ShareModalShell.
export default function AsmaulHusnaShareModal({ no, arabic, latin, meaning, photoIndex, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawAsmaulHusnaCard}
      drawArgs={{ no, arabic, latin, meaning, photoIndex, theme }}
      filename={`asmaul-husna-${latin.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`}
      shareTitle={`${latin} - airmoon`}
      onClose={onClose}
    />
  );
}
