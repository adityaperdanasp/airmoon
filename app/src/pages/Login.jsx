import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { IconMoon } from '../components/icons';
import Logo from '../components/Logo';

function mapAuthError(code) {
  const m = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-not-found': 'Akun tidak ditemukan.',
    'auth/wrong-password': 'Password salah.',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/too-many-requests': 'Terlalu banyak percobaan, coba lagi nanti.',
  };
  return m[code] || 'Gagal masuk, coba lagi.';
}

export default function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signInWithEmail(email, password);
      navigate('/');
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
      navigate('/');
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
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-0.01em' }}>{t('login_title')}</h1>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>{t('login_sub')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted-soft)' }}>{t('atau')}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button type="button" className="btn-outline" onClick={handleGoogle} disabled={busy}>
            {t('google_masuk')}
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
