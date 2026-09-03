import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { isNativeApp } from '../lib/notifications';
import { AVATAR_COLORS, watchUserProfile, setAvatarColor } from '../lib/profile';
import InstallAppCard from '../components/InstallAppCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { exportAndDownloadUserData, importUserDataFromFile } from '../lib/exportData';

function SegButton({ active, onClick, children }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        textAlign: 'center',
        padding: '9px 0',
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer',
        color: active ? 'var(--on-primary)' : 'var(--muted)',
        background: active ? 'var(--primary)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
}

// Only rendered inside android-native/'s WebView shell (isNativeApp()) —
// a regular browser/PWA has no way to attach a custom sound to a
// notification at all, so there's nothing to pick between there. Reads/
// writes the selection through window.AndroidBridge (MainActivity.kt's
// AndroidBridge inner class), which is the source of truth — this
// component holds no state of its own beyond what's needed to render it.
function AzanSoundPicker() {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    try {
      setOptions(JSON.parse(window.AndroidBridge.getAzanSoundOptions()));
      setSelected(window.AndroidBridge.getAzanSound());
    } catch {
      // AndroidBridge not ready yet or malformed response — picker just
      // stays empty rather than crashing the settings page over it.
    }
  }, []);

  if (!options.length) return null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)">
            <path d="M9 18V5l11-2v13" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="18" r="3" strokeWidth="1.6" />
            <circle cx="17" cy="16" r="3" strokeWidth="1.6" />
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Suara Azan</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Dipakai untuk notifikasi waktu sholat</span>
        </div>
      </div>
      <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)' }}>
        {options.map((opt) => (
          <SegButton
            key={opt.id}
            active={selected === opt.id}
            onClick={() => {
              window.AndroidBridge.setAzanSound(opt.id);
              setSelected(opt.id);
            }}
          >
            {opt.label}
          </SegButton>
        ))}
      </div>
    </div>
  );
}

// Name + avatar color, both writing to the same users/{uid} doc (the
// color) and Firebase Auth + users/{uid} (the name, via AuthContext's
// updateDisplayName — see that file for why a plain updateProfile() call
// alone wouldn't re-render anything). No photo upload here on purpose —
// this project has no Firebase Storage bucket set up anywhere (see
// lib/profile.js's own note); a color picker is a real customization
// option without needing new upload infrastructure.
function ProfileCard() {
  const { user, updateDisplayName } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.displayName || '');
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState('');
  const [avatarColor, setAvatarColorState] = useState(null);

  useEffect(() => setName(user?.displayName || ''), [user?.displayName]);
  useEffect(() => watchUserProfile(user?.uid, (p) => setAvatarColorState(p?.avatarColor || null)), [user?.uid]);

  const currentColor = avatarColor || 'var(--primary)';
  const nameChanged = name.trim() !== '' && name.trim() !== (user?.displayName || '');

  async function handleSaveName() {
    setNameError('');
    setSavingName(true);
    try {
      await updateDisplayName(name);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (err) {
      setNameError(err.message || 'Gagal menyimpan nama.');
    } finally {
      setSavingName(false);
    }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 17,
            color: '#fff',
            background: currentColor,
            flexShrink: 0,
          }}
        >
          {(user?.displayName || 'A')[0].toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Profil</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Nama & warna avatar kamu</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>Nama Tampilan</span>
        <div className="input-row">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
        </div>
        {nameError && <span style={{ fontSize: 11.5, color: 'var(--danger)' }}>{nameError}</span>}
        {nameChanged && (
          <button className="btn" style={{ padding: '11px' }} onClick={handleSaveName} disabled={savingName}>
            {savingName ? 'Menyimpan…' : 'Simpan Nama'}
          </button>
        )}
        {nameSaved && <span style={{ fontSize: 11.5, color: 'var(--success)', fontWeight: 600 }}>Nama berhasil diubah ✓</span>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>Warna Avatar</span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {AVATAR_COLORS.map((c) => {
            const isActive = avatarColor === c.hex;
            return (
              <button
                key={c.id}
                aria-label={c.id}
                onClick={() => {
                  setAvatarColorState(c.hex);
                  setAvatarColor(user.uid, c.hex)
                    .then(() => showToast('Warna avatar disimpan'))
                    .catch(() => setAvatarColorState(avatarColor));
                }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: c.hex,
                  border: isActive ? '2.5px solid var(--ink)' : '2.5px solid transparent',
                  boxShadow: isActive ? '0 0 0 2px var(--bg)' : 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SHARE_TEXT = "Yuk pakai airmoon — baca Qur'an, jadwal sholat, & donasi listrik masjid langsung dari HP kamu.";
// The custom domain, not the vercel.app one — a shared link is meant to
// look like a real, permanent address, not an internal hosting detail.
// api/* calls elsewhere in the app stay pointed at vercel.app on purpose
// (Firebase Hosting is static-only and can't run those serverless
// functions), but this URL is only ever shown to a human, never fetched.
const SHARE_URL = 'https://jalanmenujusurga.web.id';

// navigator.share() (the real OS share sheet — WhatsApp, Telegram, SMS,
// whatever's installed) when available; WhatsApp's own wa.me deep link as
// the fallback for browsers that don't support it (mainly desktop) rather
// than a dead button.
async function handleShareApp() {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'airmoon', text: SHARE_TEXT, url: SHARE_URL });
    } catch {
      // Share sheet cancelled by the user — nothing to do.
    }
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`, '_blank');
}

export default function Pengaturan() {
  const { t, lang, setLang } = useLang();
  const { preference: themePreference, setTheme } = useTheme();
  const { logOut, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState(null); // File awaiting confirmation, or null

  // Export/backup personal data — dzikir streak, ayat favorit, tabungan
  // umroh, and a few other personal records had no way for a user to get
  // a copy of their own data before this. See lib/exportData.js for what
  // gets bundled in.
  async function handleExportData() {
    if (!user || exporting) return;
    setExporting(true);
    try {
      await exportAndDownloadUserData(user);
      showToast('Data kamu berhasil diunduh');
    } catch {
      showToast('Gagal ekspor data, coba lagi.');
    } finally {
      setExporting(false);
    }
  }

  // File picker just stages the file — actually applying it needs
  // confirmation first, since it can silently overwrite whatever's
  // currently saved (dzikir streak, tabungan umroh goal, ayat favorit).
  function handlePickImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // so picking the same file again still fires onChange
    if (file) setPendingImportFile(file);
  }

  async function handleConfirmImport() {
    const file = pendingImportFile;
    setPendingImportFile(null);
    if (!user || !file) return;
    setImporting(true);
    try {
      const result = await importUserDataFromFile(user, file);
      showToast(`Data dipulihkan (${result.restoredFavorites} ayat favorit)`);
    } catch (err) {
      showToast(err.message || 'Gagal impor data.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('pengaturan')} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t('pengaturan_akun')}
          </span>
          <ProfileCard />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t('pengaturan_preferensi')}
          </span>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
                  <circle cx="12" cy="12" r="9" strokeWidth="1.6" />
                  <path d="M3 12h18M12 3c2.3 2.5 3.6 5.6 3.6 9s-1.3 6.5-3.6 9c-2.3-2.5-3.6-5.6-3.6-9s1.3-6.5 3.6-9Z" strokeWidth="1.6" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{t('bahasa_aplikasi')}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t('bahasa_sub')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)' }}>
              <SegButton active={lang === 'id'} onClick={() => setLang('id')}>Indonesia</SegButton>
              <SegButton active={lang === 'en'} onClick={() => setLang('en')}>English</SegButton>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)">
                  <circle cx="12" cy="12" r="4.3" strokeWidth="1.6" />
                  <path d="M12 2.5v3M12 18.5v3M4.7 4.7l2.1 2.1M17.2 17.2l2.1 2.1M1.5 12h3M19.5 12h3M4.7 19.3l2.1-2.1M17.2 6.8l2.1-2.1" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{t('tampilan')}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t('tampilan_sub')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)' }}>
              <SegButton active={themePreference === 'light'} onClick={() => setTheme('light')}>{t('light')}</SegButton>
              <SegButton active={themePreference === 'dark'} onClick={() => setTheme('dark')}>{t('dark')}</SegButton>
              <SegButton active={themePreference === 'system'} onClick={() => setTheme('system')}>{t('system')}</SegButton>
            </div>
          </div>

          {isNativeApp() && <AzanSoundPicker />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t('pengaturan_lainnya')}
          </span>

          <InstallAppCard variant="settings" />

          <button
            onClick={handleShareApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: 18,
              border: '1px solid var(--border)',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              color: 'inherit',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--mint)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)">
                  <circle cx="18" cy="5" r="2.6" strokeWidth="1.6" /><circle cx="6" cy="12" r="2.6" strokeWidth="1.6" /><circle cx="18" cy="19" r="2.6" strokeWidth="1.6" />
                  <path d="m8.3 10.7 7.4-4.2M8.3 13.3l7.4 4.2" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Ajak Teman Pakai airmoon</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <button
            onClick={handleExportData}
            disabled={exporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: 18,
              border: '1px solid var(--border)',
              background: 'none',
              textAlign: 'left',
              cursor: exporting ? 'default' : 'pointer',
              opacity: exporting ? 0.6 : 1,
              color: 'inherit',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)">
                  <path d="M12 3v12m0 0-4-4m4 4 4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{exporting ? 'Menyiapkan data…' : 'Ekspor Data Saya'}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Unduh cadangan dzikir, ayat favorit, tabungan umroh, dll</span>
              </div>
            </div>
            {!exporting && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </button>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: 18,
              border: '1px solid var(--border)',
              cursor: importing ? 'default' : 'pointer',
              opacity: importing ? 0.6 : 1,
              color: 'inherit',
              fontFamily: 'inherit',
            }}
          >
            <input type="file" accept="application/json" onChange={handlePickImportFile} disabled={importing} style={{ display: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--cream)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)">
                  <path d="M12 15V3m0 0 4 4m-4-4L8 7M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{importing ? 'Memulihkan data…' : 'Impor / Pulihkan Data'}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Pulihkan dari file cadangan hasil Ekspor Data Saya</span>
              </div>
            </div>
            {!importing && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </label>

          <Link
            to="/privacy-policy"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderRadius: 18,
              border: '1px solid var(--border)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>Kebijakan Privasi</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)"><path d="m9 6 6 6-6 6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>

          <button
            className="btn-outline"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
            onClick={() => setShowLogoutConfirm(true)}
          >
            {t('keluar')}
          </button>
        </div>
      </div>

      {pendingImportFile && (
        <ConfirmDialog
          title="Pulihkan data dari file ini?"
          message={`Dzikir streak, tabungan umroh, ayat favorit, dan bookmark yang tersimpan sekarang bakal ditimpa isi "${pendingImportFile.name}".`}
          confirmLabel="Ya, Pulihkan"
          danger
          onCancel={() => setPendingImportFile(null)}
          onConfirm={handleConfirmImport}
        />
      )}

      {showLogoutConfirm && (
        <ConfirmDialog
          title="Keluar dari akun?"
          message="Kamu bisa masuk lagi kapan aja pakai email & password yang sama."
          confirmLabel="Ya, Keluar"
          danger
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={async () => {
            setShowLogoutConfirm(false);
            await logOut();
            navigate('/login');
          }}
        />
      )}
    </div>
  );
}
