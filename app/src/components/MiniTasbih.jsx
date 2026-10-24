import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DZIKIR_PHRASES, loadCounts, saveCounts } from '../lib/tasbih';
import { hapticTick, hapticSuccess } from '../lib/haptics';

// Tasbih mini di Home (di dalam "Lihat semua" pada Hari ini): hitung dzikir
// langsung tanpa pindah halaman. Memakai penyimpanan hitungan yang sama
// dengan halaman Tasbih Digital, jadi angkanya nyambung. Tiga dzikir
// sesudah sholat (33x masing-masing).
const QUICK = DZIKIR_PHRASES.slice(0, 3);

export default function MiniTasbih() {
  const [active, setActive] = useState(QUICK[0].id);
  const [counts, setCounts] = useState(loadCounts);
  const count = counts[active] || 0;
  const lap = count % 33;
  const phrase = QUICK.find((p) => p.id === active);

  function tap() {
    const next = { ...counts, [active]: count + 1 };
    setCounts(next);
    saveCounts(next);
    if ((count + 1) % 33 === 0) hapticSuccess();
    else hapticTick();
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 800 }}>Tasbih Cepat</span>
        <Link to="/lainnya/tasbih" style={{ fontSize: 11.5, fontWeight: 700, textDecoration: 'none' }}>Buka lengkap ›</Link>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {QUICK.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            aria-pressed={active === p.id}
            style={{ padding: '6px 12px', borderRadius: 999, border: 'none', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', background: active === p.id ? 'var(--primary)' : 'var(--mint-soft)', color: active === p.id ? 'var(--on-primary)' : 'var(--ink)' }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <button
        onClick={tap}
        aria-label={`Hitung ${phrase.label}, sekarang ${count}`}
        style={{ position: 'relative', alignSelf: 'center', width: 132, height: 132, borderRadius: '50%', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)', background: `conic-gradient(var(--primary) ${(lap / 33) * 360}deg, color-mix(in srgb, var(--ink) 10%, transparent) 0)` }}
      >
        <span style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: 'var(--sheet)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontFamily: "'Amiri', serif", fontSize: 20, lineHeight: 1 }}>{phrase.arab}</span>
          <span style={{ fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{count}</span>
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>{lap}/33 putaran</span>
        </span>
      </button>
    </div>
  );
}
