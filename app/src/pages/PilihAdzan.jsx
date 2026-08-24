import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';

const SOUNDS = [
  { name: 'Adzan Makkah', sub: 'Syaikh Ali Mulla' },
  { name: 'Adzan Madinah', sub: 'Masjid Nabawi' },
  { name: 'Adzan Mishary Rasyid', sub: 'Al-Afasy' },
  { name: 'Nada Pengingat', sub: 'Tanpa suara adzan, cuma beep' },
];

export default function PilihAdzan() {
  const navigate = useNavigate();
  const current = localStorage.getItem('airmoon-adzan-sound') || 'Adzan Makkah';

  function pick(name) {
    localStorage.setItem('airmoon-adzan-sound', name);
    navigate('/jadwal-sholat', { replace: true });
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Suara Adzan" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SOUNDS.map((s) => {
            const active = s.name === current;
            return (
              <button
                key={s.name}
                onClick={() => pick(s.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                  color: 'inherit',
                  background: active ? 'var(--cream)' : 'transparent',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: active ? 'var(--primary)' : 'var(--mint-soft)' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'var(--muted)'}>
                    <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M15.5 9a4.5 4.5 0 0 1 0 6" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{s.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</span>
                </div>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: active ? 'var(--primary)' : 'transparent',
                    border: active ? 'none' : '1.5px solid var(--border)',
                  }}
                >
                  {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M5 12.5 10 17 19 7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
