import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { isNativeApp } from '../lib/notifications';
import { AVATAR_COLORS, watchUserProfile, setAvatarColor } from '../lib/profile';
import InstallAppCard from '../components/InstallAppCard';

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
                  setAvatarColor(user.uid, c.hex).catch(() => setAvatarColorState(avatarColor));
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

export default function Pengaturan() {
  const { t, lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { logOut } = useAuth();
  const navigate = useNavigate();

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
              <SegButton active={theme === 'light'} onClick={() => setTheme('light')}>{t('light')}</SegButton>
              <SegButton active={theme === 'dark'} onClick={() => setTheme('dark')}>{t('dark')}</SegButton>
            </div>
          </div>

          {isNativeApp() && <AzanSoundPicker />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t('pengaturan_lainnya')}
          </span>

          <InstallAppCard variant="settings" />

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
            onClick={async () => {
              await logOut();
              navigate('/login');
            }}
          >
            {t('keluar')}
          </button>
        </div>
      </div>
    </div>
  );
}
