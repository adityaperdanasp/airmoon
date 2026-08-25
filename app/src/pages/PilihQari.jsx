import { useNavigate, useParams } from 'react-router-dom';
import { RECITERS } from '../lib/quranApi';
import { hasWordSync } from '../lib/quranTimingApi';
import TopBar from '../components/TopBar';

export default function PilihQari() {
  const navigate = useNavigate();
  const { nomor } = useParams();
  const current = localStorage.getItem('airmoon-qari') || '05';

  function pick(id) {
    localStorage.setItem('airmoon-qari', id);
    navigate(`/quran/${nomor}`, { replace: true });
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Pilih Qari" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECITERS.map((r) => {
            const active = r.id === current;
            return (
              <button
                key={r.id}
                onClick={() => pick(r.id)}
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
                  background: active ? 'var(--mint)' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: active ? 'var(--primary)' : 'var(--mint-soft)',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 800, color: active ? '#fff' : 'var(--muted)' }}>
                    {r.name
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{r.name}</span>
                  {hasWordSync(r.id) && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>Highlight kata saat dibaca</span>
                  )}
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
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff"><path d="M5 12.5 10 17 19 7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
