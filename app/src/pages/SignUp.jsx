import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { IconMoon, GoogleLogo, FacebookLogo } from '../components/icons';
import Logo from '../components/Logo';

function mapAuthError(code) {
  const m = {
    'auth/email-already-in-use': 'Email ini sudah terdaftar.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/weak-password': 'Password minimal 6 karakter.',
    'auth/account-exists-with-different-credential':
      'Email ini udah kedaftar pakai cara masuk lain (misal Google). Coba masuk pakai itu dulu.',
    'auth/popup-closed-by-user': 'Popup ditutup sebelum selesai. Coba lagi.',
  };
  return m[code] || 'Gagal daftar, coba lagi.';
}

export default function SignUp() {
  const { user, signUpWithEmail, signInWithGoogle, signInWithFacebook } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
      await signUpWithEmail(name, email, password);
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

  return (
    <div className="screen">
      <div className="screen-content" style={{ paddingTop: 52, gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo size={30} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{t('signup_title')}</h1>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>{t('signup_sub')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{t('nama_lengkap')}</span>
            <div className="input-row">
              <input required placeholder="Nama kamu" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
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
                minLength={6}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}

          <button type="submit" className="btn" disabled={busy}>
            {busy ? t('loading') : t('daftar')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted-soft)' }}>{t('atau')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button type="button" className="btn-outline btn-google" onClick={handleGoogle} disabled={busy}>
            <GoogleLogo />
            {t('google_daftar')}
          </button>

          <button type="button" className="btn-outline btn-google" onClick={handleFacebook} disabled={busy}>
            <FacebookLogo />
            {t('facebook_daftar')}
          </button>
        </form>

        <p style={{ margin: 0, textAlign: 'center', fontSize: 13 }} className="muted">
          {t('sudah_akun')}{' '}
          <Link to="/login" style={{ fontWeight: 700, textDecoration: 'none' }}>
            {t('masuk')}
          </Link>
        </p>
      </div>
    </div>
  );
}
