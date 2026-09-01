import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { IconMoon, GoogleLogo, FacebookLogo } from '../components/icons';
import Logo from '../components/Logo';
import { AUTH_PHOTO_LIGHT, AUTH_PHOTO_DARK } from '../data/photos';

function mapAuthError(code) {
  const m = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-not-found': 'Akun tidak ditemukan.',
    'auth/wrong-password': 'Password salah.',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/too-many-requests': 'Terlalu banyak percobaan, coba lagi nanti.',
    'auth/account-exists-with-different-credential':
      'Email ini udah kedaftar pakai cara masuk lain (misal Google). Coba masuk pakai itu dulu.',
    'auth/popup-closed-by-user': 'Popup ditutup sebelum selesai. Coba lagi.',
  };
  return m[code] || 'Gagal masuk, coba lagi.';
}

export default function Login() {
  const { user, signInWithEmail, signInWithGoogle, signInWithFacebook } = useAuth();
  const { t } = useLang();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setBusy(false);
    }
  }

  async function handleFacebook() {
    setError('');
    setBusy(true);
    try {
      await signInWithFacebook();
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setBusy(false);
    }
  }

  const heroPhoto = theme === 'dark' ? AUTH_PHOTO_DARK : AUTH_PHOTO_LIGHT;

  return (
    <div className="screen">
      {/* Full-bleed hero, deliberately a sibling of .screen-content (not
          inside it) so it isn't constrained by that element's horizontal
          padding — the photo needs to reach the screen edges. A different
          photo per theme (not the same one dimmed) per an explicit ask;
          see data/photos.js. */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={heroPhoto}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
        />
        {/* Fade stretched out over a much longer stretch (45%→92%, was a
            flat 60%→100%) — a short fade made the photo feel like it was
            just abruptly cut off right above the headline; a slower fade
            reads as one continuous surface instead of "photo card" +
            "separate text block" stacked on top of each other. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              theme === 'dark'
                ? 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.5) 70%, var(--bg) 94%)'
                : 'linear-gradient(180deg, rgba(10,20,15,0.05) 0%, rgba(10,20,15,0.05) 45%, rgba(255,255,255,0.4) 70%, var(--bg) 94%)',
          }}
        />
        <div style={{ position: 'absolute', top: 22, left: 22 }}>
          <Logo size={26} color={theme === 'dark' ? 'var(--accent)' : '#fff'} />
        </div>
      </div>

      {/* Pulled up under the hero's long fade (negative margin) so the
          headline sits right where the photo has already faded to
          var(--bg) — the two blend into one surface instead of the
          content area starting with a hard visible seam. */}
      <div className="screen-content" style={{ paddingTop: 0, gap: 28, marginTop: -36, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{t('login_title')}</h1>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>{t('login_sub')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              aria-label={t('google_masuk')}
              style={{
                flex: 1,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
                borderRadius: 16,
                background: 'var(--bg)',
                cursor: busy ? 'default' : 'pointer',
              }}
            >
              <GoogleLogo width={22} height={22} />
            </button>

            <button
              type="button"
              onClick={handleFacebook}
              disabled={busy}
              aria-label={t('facebook_masuk')}
              style={{
                flex: 1,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
                borderRadius: 16,
                background: 'var(--bg)',
                cursor: busy ? 'default' : 'pointer',
              }}
            >
              <FacebookLogo width={22} height={22} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted-soft)' }}>{t('atau')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{t('email')}</span>
            <div className="input-row">
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{t('password')}</span>
            <div className="input-row">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}

          <button type="submit" className="btn" disabled={busy}>
            {busy ? t('loading') : t('masuk')}
          </button>
        </form>

        <p style={{ margin: 0, textAlign: 'center', fontSize: 13 }} className="muted">
          {t('belum_akun')}{' '}
          <Link to="/signup" style={{ fontWeight: 700, textDecoration: 'none' }}>
            {t('daftar')}
          </Link>
        </p>
      </div>
    </div>
  );
}
