import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import EmptyState from '../components/EmptyState';
import { PAGE_PHOTOS } from '../data/photos';
import { MUHASABAH_QUESTIONS, todayKey, loadMuhasabah, saveMuhasabah, watchRecentMuhasabah } from '../lib/muhasabah';

const dateFmt = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

// Muhasabah malam: tiga pertanyaan, catatan pribadi. Landasan yang dipakai
// hanya ayat: QS. Al-Hasyr: 18 ("hendaklah setiap diri memperhatikan apa yang
// telah diperbuatnya untuk hari esok"). Ungkapan populer lain sengaja tidak
// dipakai sebagai dalil di sini.
export default function Muhasabah() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const dateKey = todayKey();
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    loadMuhasabah(user.uid, dateKey).then(setAnswers).catch(() => {});
  }, [user?.uid, dateKey]);
  useEffect(() => watchRecentMuhasabah(user?.uid, setRecent), [user?.uid]);

  const filled = MUHASABAH_QUESTIONS.some((q) => (answers[q.key] || '').trim());

  async function handleSave() {
    if (!user?.uid || !filled) return;
    setSaving(true);
    try {
      await saveMuhasabah(user.uid, dateKey, answers);
      showToast('Muhasabah malam ini tersimpan');
    } catch {
      showToast('Gagal menyimpan, coba lagi', { type: 'danger' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto title="Muhasabah Malam" subtitle="Tiga pertanyaan, 30 detik" photo={PAGE_PHOTOS.modeRamadan} />

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>
            "Hendaklah setiap diri memperhatikan apa yang telah diperbuatnya untuk hari esok." (QS. Al-Hasyr: 18). Catatan ini hanya untukmu, tidak dibagikan dan tidak dinilai.
          </span>
          {MUHASABAH_QUESTIONS.map((q) => (
            <label key={q.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700 }}>{q.label}</span>
              <textarea
                value={answers[q.key] || ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value.slice(0, 500) }))}
                placeholder={q.placeholder}
                rows={3}
                style={{ resize: 'vertical', padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--mint-soft)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.5 }}
              />
            </label>
          ))}
          <button className="btn" disabled={!filled || saving} onClick={handleSave}>
            {saving ? 'Menyimpan…' : 'Simpan Muhasabah'}
          </button>
        </div>

        <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>Catatan sebelumnya</span>
        {recent === null && <div className="card" style={{ height: 90 }} />}
        {recent && recent.filter((r) => r.id !== dateKey).length === 0 && (
          <EmptyState icon="📝" title="Belum ada catatan sebelumnya" subtitle="Muhasabah malam pertamamu akan muncul di sini besok." />
        )}
        {recent && recent.filter((r) => r.id !== dateKey).map((r) => {
          const [y, m, d] = r.id.split('-').map(Number);
          return (
            <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold-ink)' }}>{dateFmt.format(new Date(y, m - 1, d))}</span>
              {MUHASABAH_QUESTIONS.filter((q) => r.answers?.[q.key]).map((q) => (
                <div key={q.key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700 }}>{q.label}</span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{r.answers[q.key]}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
