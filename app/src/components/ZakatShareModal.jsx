import { drawZakatCard } from '../lib/zakatCardCanvas';
import ShareModalShell from './ShareModalShell';

export default function ZakatShareModal({ typeLabel, amountLabel, formulaLabel, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawZakatCard}
      drawArgs={{ typeLabel, amountLabel, formulaLabel, theme }}
      filename="hasil-zakat.png"
      shareTitle="Hasil Kalkulator Zakat - airmoon"
      onClose={onClose}
    />
  );
}
