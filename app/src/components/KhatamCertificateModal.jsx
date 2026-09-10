import { drawKhatamCertificate } from '../lib/khatamCertificateCanvas';
import { useTheme } from '../context/ThemeContext';
import ShareModalShell from './ShareModalShell';

// The Khatam-completion certificate — a milestone card (double frame, see
// lib/cardFrame.js), shown once Progress Khatam Qur'an reaches all 604
// pages.
export default function KhatamCertificateModal({ onClose }) {
  const { theme } = useTheme();
  return (
    <ShareModalShell
      draw={drawKhatamCertificate}
      drawArgs={{ theme }}
      filename="khatam-quran.png"
      shareTitle="Khatam Qur'an - airmoon"
      onClose={onClose}
    />
  );
}
