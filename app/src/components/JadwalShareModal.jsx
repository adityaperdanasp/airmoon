import { drawJadwalCard } from '../lib/jadwalCardCanvas';
import ShareModalShell from './ShareModalShell';
import { appLink } from '../lib/deepLink';

export default function JadwalShareModal({ timings, location, dateLabel, hijriLabel, methodLabel, source, theme, onClose }) {
  return (
    <ShareModalShell
      draw={drawJadwalCard}
      drawArgs={{ timings, location, dateLabel, hijriLabel, methodLabel, source, theme, dayIndex: new Date().getDate() }}
      filename="jadwal-sholat.png"
      shareTitle="Jadwal Sholat hari ini - airmoon"
      shareText={`Jadwal sholat hari ini di ${location || 'lokasiku'}\n${appLink('/jadwal-sholat')}`}
      onClose={onClose}
    />
  );
}
