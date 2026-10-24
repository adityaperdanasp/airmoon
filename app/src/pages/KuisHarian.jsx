import { useMemo, useState } from 'react';
import TopBar from '../components/TopBar';
import { todaysQuiz } from '../data/kuisAgama';
import { hapticTick, hapticSuccess } from '../lib/haptics';

const KEY = 'airmoon-kuis-state';
const todayKey = () => new Date().toISOString().slice(0, 10);

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

// Kuis Agama Harian: 3 soal dasar per hari dengan dalil. Skor dan hari
// beruntun hanya disimpan di perangkat ini dan tidak dibandingkan dengan siapa pun.
export default function KuisHarian() {
  const questions = useMemo(() => todaysQuiz(), []);
  const [state, setState] = useState(load);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const doneToday = state.lastDone === todayKey();

  function save(next) {
    setState(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function choose(idx) {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === questions[i].a) {
      setScore((s) => s + 1);
      hapticSuccess();
    } else {
      hapticTick();
    }
  }

  function next() {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
      return;
    }
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const streak = state.lastDone === y.toISOString().slice(0, 10) ? (state.streak || 0) + 1 : 1;
    save({ lastDone: todayKey(), streak, lastScore: score, total: (state.total || 0) + 1 });
    setI(questions.length);
  }

  const q = questions[i];
  const finished = i >= questions.length;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Kuis Agama Harian" subtitle="3 soal dasar, lengkap dengan dalil" />

        {(finished || (doneToday && i === 0 && picked === null)) ? (
          <div className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: 42, fontWeight: 800, color: 'var(--primary)' }}>{finished ? `${score}/${questions.length}` : '✓'}</span>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{finished ? 'Kuis hari ini selesai' : 'Kuis hari ini sudah kamu kerjakan'}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
              {state.streak ? `${state.streak} hari beruntun. ` : ''}Soal baru muncul besok. Skor ini hanya untukmu.
            </span>
          </div>
        ) : (
          <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Soal {i + 1} dari {questions.length}</span>
            <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.35 }}>{q.q}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.o.map((opt, idx) => {
                const right = idx === q.a;
                const chosen = picked === idx;
                const show = picked !== null;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(idx)}
                    disabled={show}
                    style={{
                      textAlign: 'left', padding: '12px 14px', borderRadius: 14, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: show ? 'default' : 'pointer', color: 'var(--ink)',
                      border: show && right ? '1.5px solid var(--success)' : show && chosen ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                      background: show && right ? 'var(--success-bg)' : 'var(--mint-soft)',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <>
                <div style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--cream)', fontSize: 12, lineHeight: 1.55 }}>
                  <b>{picked === q.a ? 'Benar. ' : 'Belum tepat. '}</b>
                  {q.d}
                </div>
                <button className="btn" onClick={next}>{i + 1 < questions.length ? 'Soal berikutnya' : 'Selesai'}</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
