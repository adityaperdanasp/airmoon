import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { watchUpcomingDoaBersama, createDoaBersama, deleteDoaBersama, watchIsJoined, joinDoaBersama, leaveDoaBersama } from '../lib/doaBersama';

const dateFmt = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function DoaCard({ doa, user, showToast }) {
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const isOwner = user && doa.uid === user.uid;

  useEffect(() => watchIsJoined(doa.id, user?.uid, setJoined), [doa.id, user?.uid]);

  async function handleToggleJoin() {
    if (!user || busy) return;
    setBusy(true);
    try {
      if (joined) {
        await leaveDoaBersama(doa.id, user.uid);
      } else {
        await joinDoaBersama(doa.id, user.uid);
        showToast('Kamu ikut Doa Bersama ini — bakal diingetin nanti.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    await deleteDoaBersama(doa.id);
    showToast('Doa Bersama dihapus.');
  }

  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 700 }}>{doa.title}</span>
        {isOwner && (
          <button onClick={handleDelete} aria-label="Hapus" style={{ background: 'none', border: 'none', color: 'var(--muted-soft)', fontSize: 13, cursor: 'pointer', padding: 0, flexShrink: 0 }}>
            Hapus
          </button>
        )}
      </div>
      {doa.description && <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{doa.description}</p>}
      <span style={{ fontSize: 11.5, color: 'var(--primary)', fontWeight: 700 }}>{dateFmt.format(doa.scheduledFor.toDate())} WIB</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{doa.participantCount || 0} orang ikut</span>
        {user && (
          <button
            onClick={handleToggleJoin}
            disabled={busy}
            className={joined ? 'btn-outline' : 'btn'}
            style={{ width: 'auto', padding: '6px 14px', fontSize: 12 }}
          >
            {joined ? 'Batal Ikut' : 'Ikut Doa Ini'}
          </button>
        )}
      </div>
    </div>
  );
}

// Doa Bersama Terjadwal (2026-09-12) — a public schedule anyone signed in
// can post to (e.g. "Doa bareng buat ujian, Jumat 20:00") and anyone can
// join. See lib/doaBersama.js for the participantCount-vs-participants
// subcollection split and why. No reminder/notification is actually sent
// yet when the scheduled time arrives — that would need folding into
// check-campaign-deadlines.js's cron, not done this round.
export default function DoaBersama() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [doaList, setDoaList] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('20:00');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => watchUpcomingDoaBersama(setDoaList), []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !title.trim() || !date || submitting) return;
    setSubmitting(true);
    try {
      await createDoaBersama(user.uid, {
        title: title.trim(),
        description: description.trim(),
        scheduledFor: `${date}T${time}:00`,
      });
      setTitle('');
      setDescription('');
      setDate('');
      setShowForm(false);
      showToast('Doa Bersama berhasil dijadwalkan!');
    } catch (err) {
      showToast(err.message || 'Gagal menjadwalkan.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Doa Bersama" />

        {user && (
          !showForm ? (
            <button className="btn" onClick={() => setShowForm(true)}>+ Jadwalkan Doa Bersama</button>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="input-row">
                <input required placeholder="Untuk apa doa bersama ini?" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
              </div>
              <textarea
                placeholder="Detail tambahan (opsional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 13 }} />
                <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 13 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="btn" style={{ flex: 1 }} disabled={submitting || !title.trim() || !date}>
                  {submitting ? 'Menjadwalkan...' : 'Jadwalkan'}
                </button>
              </div>
            </form>
          )
        )}

        {doaList === null ? null : doaList.length === 0 ? (
          <EmptyState icon="🤲" title="Belum ada Doa Bersama terjadwal" subtitle="Jadwalkan satu di atas, atau tunggu ajakan dari sahabat airmoon lain." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {doaList.map((doa) => (
              <DoaCard key={doa.id} doa={doa} user={user} showToast={showToast} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
