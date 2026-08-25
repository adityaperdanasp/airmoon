import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from '../components/TopBar';

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
        color: active ? '#fff' : 'var(--muted)',
        background: active ? 'var(--primary)' : 'transparent',
      }}
    >
      {children}
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
  );
}
