import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import { HURUF } from '../data/hijaiyah';
import { hapticTick, hapticSuccess } from '../lib/haptics';

const KEY = 'airmoon-hijaiyah-stars';

function loadStars() {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}

function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// Belajar Huruf Hijaiyah (mode anak): kenali 28 huruf, lalu tebak huruf
// untuk mengumpulkan bintang. Tanpa suara, tanpa akun anak, tanpa data
// yang dikirim ke mana pun; bintang hanya disimpan di perangkat. Belajar
// membaca Al-Qur'an yang benar tetap dengan guru (talaqqi).
export default function Hijaiyah() {
  const [mode, setMode] = useState('belajar'); // belajar | tebak
  const [sel, setSel] = useState(null);
  const [stars, setStars] = useState(loadStars);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);

  const q = useMemo(() => {
    const target = HURUF[Math.floor(Math.random() * HURUF.length)];
    const wrong = shuffle(HURUF.filter((h) => h[1] !== target[1])).slice(0, 3);
    return { target, options: shuffle([target, ...wrong]) };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-roll only when the round counter changes
  }, [round]);

  function answer(opt) {
    if (picked) return;
    setPicked(opt[1]);
    if (opt[1] === q.target[1]) {
      hapticSuccess();
      const next = stars + 1;
      setStars(next);
      try {
        localStorage.setItem(KEY, String(next));
      } catch {
        // ignore
      }
    } else {
      hapticTick();
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Huruf Hijaiyah" subtitle="Belajar untuk si kecil" />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)', flex: 1 }}>
            {[['belajar', 'Belajar'], ['tebak', 'Tebak Huruf']].map(([id, label]) => (
              <button key={id} onClick={() => { setMode(id); setPicked(null); }} aria-pressed={mode === id} style={{ flex: 1, border: 'none', padding: '9px 0', borderRadius: 999, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', background: mode === id ? 'var(--primary)' : 'transparent', color: mode === id ? 'var(--on-primary)' : 'var(--muted)' }}>{label}</button>
            ))}
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--gold-ink)', whiteSpace: 'nowrap' }}>⭐ {stars}</span>
        </div>

        {mode === 'belajar' ? (
          <>
            {sel && (
              <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: "'Amiri', serif", fontSize: 96, lineHeight: 1.2 }}>{sel[0]}</span>
                <span style={{ fontSize: 22, fontWeight: 800 }}>{sel[1]}</span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, direction: 'rtl' }}>
              {HURUF.map((h) => (
                <button key={h[1]} onClick={() => { setSel(h); hapticTick(); }} aria-label={`Huruf ${h[1]}`} className="card" style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Amiri', serif", fontSize: 40, cursor: 'pointer', color: 'var(--ink)', border: sel?.[1] === h[1] ? '2px solid var(--primary)' : undefined }}>
                  {h[0]}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Huruf apa ini?</span>
            <span style={{ fontFamily: "'Amiri', serif", fontSize: 110, lineHeight: 1.2 }}>{q.target[0]}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
              {q.options.map((o) => {
                const right = o[1] === q.target[1];
                const show = picked !== null;
                return (
                  <button key={o[1]} onClick={() => answer(o)} disabled={show} style={{ padding: '16px 8px', borderRadius: 16, fontFamily: 'inherit', fontSize: 16, fontWeight: 800, cursor: show ? 'default' : 'pointer', color: 'var(--ink)', border: show && right ? '2px solid var(--success)' : show && picked === o[1] ? '2px solid var(--danger)' : '1px solid var(--border)', background: show && right ? 'var(--success-bg)' : 'var(--mint-soft)' }}>
                    {o[1]}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <button className="btn" onClick={() => { setPicked(null); setRound((r) => r + 1); }}>
                {picked === q.target[1] ? 'Hebat! Lanjut' : 'Coba huruf lain'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
