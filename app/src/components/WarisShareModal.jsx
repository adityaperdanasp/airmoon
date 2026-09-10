import { drawWarisCard } from '../lib/warisCardCanvas';
import { shareText } from '../lib/share';
import { formatRupiah } from '../lib/zakat';
import { useTheme } from '../context/ThemeContext';
import ShareModalShell from './ShareModalShell';

// Waris result share card. The image card is a fixed-size canvas that
// truncates past a handful of heirs ("+N lagi"), so it also offers a
// plain-text export listing every share in full — rendered in
// ShareModalShell's `footer` slot below the Unduh/Bagikan row.
export default function WarisShareModal({ totalHarta, results, onClose }) {
  const { theme } = useTheme();

  async function handleShareText() {
    const lines = [
      'Hasil Kalkulator Waris — airmoon',
      `Total Harta: ${formatRupiah(totalHarta)}`,
      '',
      ...results.map((r) => `${r.label}: ${formatRupiah(r.amount)} (${(r.fraction * 100).toFixed(2)}%)`),
    ];
    await shareText({ text: lines.join('\n'), title: 'Hasil Kalkulator Waris' });
  }

  return (
    <ShareModalShell
      draw={drawWarisCard}
      drawArgs={{ totalHarta, results, theme }}
      filename="kalkulator-waris.png"
      shareTitle="Kalkulator Waris - airmoon"
      footer={
        <button
          onClick={handleShareText}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', opacity: 0.9 }}
        >
          ↗ Bagikan sebagai Teks
        </button>
      }
      onClose={onClose}
    />
  );
}
