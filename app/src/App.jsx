import { lazy, Suspense, useEffect } from 'react';
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
const SejarahIslam = lazy(() => import('./pages/SejarahIslam'));
const PuasaSunnah = lazy(() => import('./pages/PuasaSunnah'));
const RingkasanIbadah = lazy(() => import('./pages/RingkasanIbadah'));
const KalenderIbadah = lazy(() => import('./pages/KalenderIbadah'));
const DesignSystem = lazy(() => import('./pages/DesignSystem'));
const UsulanFitur = lazy(() => import('./pages/UsulanFitur'));
const Bantuan = lazy(() => import('./pages/Bantuan'));
const AjukanMasjid = lazy(() => import('./pages/AjukanMasjid'));
const GrupIbadah = lazy(() => import('./pages/GrupIbadah'));
const DampakAirmoon = lazy(() => import('./pages/DampakAirmoon'));
const ZakatKorporat = lazy(() => import('./pages/ZakatKorporat'));
const Relawan = lazy(() => import('./pages/Relawan'));
const DoaBersama = lazy(() => import('./pages/DoaBersama'));

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

// Two different loading treatments:
//  • First paint of the app (before any route chunk or its data) gets a
//    real branded splash — a full-bleed teal wash with the crescent +
//    wordmark, fading out as the first page fades in. This is the actual
//    first thing a visitor sees; a bare pulsing glyph on white sold the
//    app short.
//  • Every subsequent route-chunk swap gets the light version (just the
//    pulsing mark on the page background) — a full teal screen flashing
//    on every in-app navigation would be exhausting.
let bootSplashShown = false;

function RouteFallback() {
  const firstBoot = !bootSplashShown;
  useEffect(() => {
    bootSplashShown = true;
  }, []);

  if (firstBoot) {
    return (
      <div
        className="boot-splash"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          background: 'linear-gradient(160deg, #0d4d47 0%, #0a3630 100%)',
        }}
      >
        <div className="splash-pulse">
          <Logo size={54} showWordmark color="#ffffff" />
        </div>
      </div>
    );
  }

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
        <Route path="/dampak" element={<DampakAirmoon />} />
        {/* Internal design reference — no nav link, not login-gated, one
            URL away for a design review. See pages/DesignSystem.jsx. */}
        <Route path="/design-system" element={<DesignSystem />} />

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
        <Route path="/lainnya/sejarah-islam" element={<P><SejarahIslam /></P>} />
        <Route path="/lainnya/puasa-sunnah" element={<P><PuasaSunnah /></P>} />
        <Route path="/lainnya/ringkasan-ibadah" element={<P><RingkasanIbadah /></P>} />
        <Route path="/lainnya/kalender-ibadah" element={<P><KalenderIbadah /></P>} />
        <Route path="/lainnya/usulan-fitur" element={<P><UsulanFitur /></P>} />
        <Route path="/lainnya/bantuan" element={<P><Bantuan /></P>} />
        <Route path="/lainnya/ajukan-masjid" element={<P><AjukanMasjid /></P>} />
        <Route path="/lainnya/grup-ibadah" element={<P><GrupIbadah /></P>} />
        <Route path="/lainnya/zakat-korporat" element={<P><ZakatKorporat /></P>} />
        <Route path="/lainnya/relawan" element={<P><Relawan /></P>} />
        <Route path="/lainnya/doa-bersama" element={<P><DoaBersama /></P>} />
      </Routes>
    </Suspense>
    </>
  );
}
