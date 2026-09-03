import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Logo from './components/Logo';
import NotificationForegroundListener from './components/NotificationForegroundListener';
import OfflineBanner from './components/OfflineBanner';

// Route-level code splitting (2026-09-02) — every build was warning about
// a single 1MB+ JS chunk holding all ~29 page components at once, so a
// first visit had to download/parse every page (Mushaf reader, Umroh
// checklist, Kartu Ucapan, everything) before it could show Login. Each
// page is now its own chunk, fetched only when its route is actually
// visited — Vite/Rollup does this automatically for a dynamic import(),
// no bundler config needed beyond switching these from static imports.
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Home = lazy(() => import('./pages/Home'));
const SurahList = lazy(() => import('./pages/SurahList'));
const SurahReader = lazy(() => import('./pages/SurahReader'));
const MushafReader = lazy(() => import('./pages/MushafReader'));
const PilihQari = lazy(() => import('./pages/PilihQari'));
const JadwalSholat = lazy(() => import('./pages/JadwalSholat'));
const PilihAdzan = lazy(() => import('./pages/PilihAdzan'));
const Donasi = lazy(() => import('./pages/Donasi'));
const Doa = lazy(() => import('./pages/Doa'));
const AskMe = lazy(() => import('./pages/AskMe'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Umroh = lazy(() => import('./pages/Umroh'));
const UmrohManasik = lazy(() => import('./pages/UmrohManasik'));
const UmrohBadal = lazy(() => import('./pages/UmrohBadal'));
const UmrohChecklist = lazy(() => import('./pages/UmrohChecklist'));
const UmrohTabungan = lazy(() => import('./pages/UmrohTabungan'));
const Pengaturan = lazy(() => import('./pages/Pengaturan'));
const Lainnya = lazy(() => import('./pages/Lainnya'));
const NamaNamaAllah = lazy(() => import('./pages/NamaNamaAllah'));
const KalenderHijriah = lazy(() => import('./pages/KalenderHijriah'));
const KalkulatorZakat = lazy(() => import('./pages/KalkulatorZakat'));
const KartuUcapan = lazy(() => import('./pages/KartuUcapan'));
const DoaHarian = lazy(() => import('./pages/DoaHarian'));
const KutipanInspirasi = lazy(() => import('./pages/KutipanInspirasi'));
const CariMasjid = lazy(() => import('./pages/CariMasjid'));
const MakkahLive = lazy(() => import('./pages/MakkahLive'));
const QiblaCompass = lazy(() => import('./pages/QiblaCompass'));
const ModeRamadan = lazy(() => import('./pages/ModeRamadan'));
const Tasbih = lazy(() => import('./pages/Tasbih'));
const CariAyat = lazy(() => import('./pages/CariAyat'));
const AyatFavorit = lazy(() => import('./pages/AyatFavorit'));
const NotifikasiCenter = lazy(() => import('./pages/NotifikasiCenter'));
const CariGlobal = lazy(() => import('./pages/CariGlobal'));
const KalkulatorWaris = lazy(() => import('./pages/KalkulatorWaris'));
const Changelog = lazy(() => import('./pages/Changelog'));

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

// Matches the plain center-spinner loading state every page already uses
// for its own data fetches (see e.g. SurahReader.jsx) — so the brief gap
// while a route's chunk downloads looks like the same familiar "loading"
// moment, not a distinct new loading UI.
// The brand's own mark instead of a bare spinner — this is what shows
// during the very first paint (before any route's own chunk, let alone
// its data, has loaded), so it's the actual first thing a visitor sees of
// the app. A gentle pulse (`animation` on the wrapper, not the mark's own
// SVG) says "loading" without needing a spinner glyph competing with it.
function RouteFallback() {
  return (
    <div className="screen">
      <div className="screen-content center" style={{ minHeight: '100vh' }}>
        <div className="splash-pulse">
          <Logo size={40} showWordmark={false} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
    <NotificationForegroundListener />
    <OfflineBanner />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/" element={<P><Home /></P>} />
        <Route path="/quran" element={<P><SurahList /></P>} />
        <Route path="/quran/:nomor" element={<P><SurahReader /></P>} />
        <Route path="/quran/mushaf/:page" element={<P><MushafReader /></P>} />
        <Route path="/quran/:nomor/qari" element={<P><PilihQari /></P>} />
        <Route path="/quran/cari" element={<P><CariAyat /></P>} />
        <Route path="/jadwal-sholat" element={<P><JadwalSholat /></P>} />
        <Route path="/jadwal-sholat/adzan" element={<P><PilihAdzan /></P>} />
        <Route path="/donasi" element={<P><Donasi /></P>} />
        <Route path="/doa" element={<P><Doa /></P>} />
        <Route path="/ask-me" element={<P><AskMe /></P>} />
        <Route path="/umroh" element={<P><Umroh /></P>} />
        <Route path="/umroh/manasik" element={<P><UmrohManasik /></P>} />
        <Route path="/umroh/badal" element={<P><UmrohBadal /></P>} />
        <Route path="/umroh/checklist" element={<P><UmrohChecklist /></P>} />
        <Route path="/umroh/tabungan" element={<P><UmrohTabungan /></P>} />
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
        <Route path="/lainnya/mode-ramadan" element={<P><ModeRamadan /></P>} />
        <Route path="/lainnya/tasbih" element={<P><Tasbih /></P>} />
        <Route path="/lainnya/ayat-favorit" element={<P><AyatFavorit /></P>} />
        <Route path="/notifikasi" element={<P><NotifikasiCenter /></P>} />
        <Route path="/cari" element={<P><CariGlobal /></P>} />
        <Route path="/lainnya/kalkulator-waris" element={<P><KalkulatorWaris /></P>} />
        <Route path="/yang-baru" element={<P><Changelog /></P>} />
      </Routes>
    </Suspense>
    </>
  );
}
