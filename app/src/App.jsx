import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import SurahList from './pages/SurahList';
import SurahReader from './pages/SurahReader';
import PilihQari from './pages/PilihQari';
import JadwalSholat from './pages/JadwalSholat';
import PilihAdzan from './pages/PilihAdzan';
import Donasi from './pages/Donasi';
import AskMe from './pages/AskMe';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Umroh from './pages/Umroh';
import Pengaturan from './pages/Pengaturan';
import Lainnya from './pages/Lainnya';
import NamaNamaAllah from './pages/NamaNamaAllah';
import KalenderHijriah from './pages/KalenderHijriah';
import KalkulatorZakat from './pages/KalkulatorZakat';
import KartuUcapan from './pages/KartuUcapan';
import DoaHarian from './pages/DoaHarian';
import KutipanInspirasi from './pages/KutipanInspirasi';
import CariMasjid from './pages/CariMasjid';
import MakkahLive from './pages/MakkahLive';
import QiblaCompass from './pages/QiblaCompass';

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route path="/" element={<P><Home /></P>} />
      <Route path="/quran" element={<P><SurahList /></P>} />
      <Route path="/quran/:nomor" element={<P><SurahReader /></P>} />
      <Route path="/quran/:nomor/qari" element={<P><PilihQari /></P>} />
      <Route path="/jadwal-sholat" element={<P><JadwalSholat /></P>} />
      <Route path="/jadwal-sholat/adzan" element={<P><PilihAdzan /></P>} />
      <Route path="/donasi" element={<P><Donasi /></P>} />
      <Route path="/ask-me" element={<P><AskMe /></P>} />
      <Route path="/umroh" element={<P><Umroh /></P>} />
      <Route path="/pengaturan" element={<P><Pengaturan /></P>} />

      <Route path="/lainnya" element={<P><Lainnya /></P>} />
      <Route path="/lainnya/asmaul-husna" element={<P><NamaNamaAllah /></P>} />
      <Route path="/lainnya/kalender-hijriah" element={<P><KalenderHijriah /></P>} />
      <Route path="/lainnya/kalkulator-zakat" element={<P><KalkulatorZakat /></P>} />
      <Route path="/lainnya/kartu-ucapan" element={<P><KartuUcapan /></P>} />
      <Route path="/lainnya/doa-harian" element={<P><DoaHarian /></P>} />
      <Route path="/lainnya/kutipan-inspirasi" element={<P><KutipanInspirasi /></P>} />
      <Route path="/lainnya/cari-masjid" element={<P><CariMasjid /></P>} />
      <Route path="/lainnya/makkah-live" element={<P><MakkahLive /></P>} />
      <Route path="/lainnya/kiblat" element={<P><QiblaCompass /></P>} />
    </Routes>
  );
}
