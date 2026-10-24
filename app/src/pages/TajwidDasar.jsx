import { useState } from 'react';
import TopBar from '../components/TopBar';
import { TAJWID } from '../data/tajwidDasar';
import { hapticTick, hapticSuccess } from '../lib/haptics';

function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// Belajar tajwid dasar: kartu hukum bacaan, plus latihan "hukum apa pada
// contoh ini?". Hanya alat bantu belajar, bukan pengganti guru.
export default function TajwidDasar() {
  const [open, setOpen] = useState(null);
  const [quizOn, setQuizOn] = useState(false);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  const q = (() => {
    const target = TAJWID[(round * 7 + 3) % TAJWID.length];
    const wrong = shuffle(TAJWID.filter((t) => t.id !== target.id)).slice(0, 3);
    return { target, options: shuffle([target, ...wrong]) };
  })();

  function answer(t) {
    if (picked) return;
    setPicked(t.id);
    if (t.id === q.target.id) {
      setScore((s) => s + 1);
      hapticSuccess();
    } else {
      hapticTick();
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Tajwid Dasar" subtitle="Hukum bacaan, satu per satu" />
        <button className="btn-outline" onClick={() => { setQuizOn((v) => !v); setPicked(null); }}>{quizOn ? 'Kembali ke kartu belajar' : `Latihan soal${score ? ` (skor ${score})` : ''}`}</button>

        {quizOn ? (
          <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Hukum bacaan apa pada contoh ini?</span>
            <span style={{ fontFamily: "'Amiri', serif", fontSize: 40, lineHeight: 1.6, direction: 'rtl' }}>{q.target.ex}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              {q.options.map((o) => {
                const right = o.id === q.target.id;
                const show = picked !== null;
                return (
                  <button key={o.id} onClick={() => answer(o)} disabled={show} style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 14, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, cursor: show ? 'default' : 'pointer', color: 'var(--ink)', border: show && right ? '1.5px solid var(--success)' : show && picked === o.id ? '1.5px solid var(--danger)' : '1px solid var(--border)', background: show && right ? 'var(--success-bg)' : 'var(--mint-soft)' }}>
                    {o.name}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <>
                <span style={{ fontSize: 12, lineHeight: 1.55, textAlign: 'center' }}>{q.target.rule}</span>
                <button className="btn" onClick={() => { setPicked(null); setRound((r) => r + 1); }}>Soal berikutnya</button>
              </>
            )}
          </div>
        ) : (
          TAJWID.map((t) => (
            <div key={t.id} className="card" style={{ padding: 0 }}>
              <button onClick={() => setOpen(open === t.id ? null : t.id)} aria-expanded={open === t.id} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit', textAlign: 'left' }}>
                <span style={{ fontSize: 13.5, fontWeight: 800 }}>{t.name}</span>
                <span style={{ fontFamily: "'Amiri', serif", fontSize: 22 }}>{t.ex}</span>
              </button>
              {open === t.id && <div style={{ padding: '0 16px 16px', fontSize: 12.5, lineHeight: 1.6, color: 'var(--muted)' }}>{t.rule}</div>}
            </div>
          ))
        )}
        <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>Ini ringkasan untuk belajar awal. Belajar membaca Al-Qur'an dengan benar tetap sebaiknya langsung kepada guru yang bersanad (talaqqi).</span>
      </div>
    </div>
  );
}
