import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import { submitCampaignRequest, watchMyCampaignRequests } from '../lib/leadForms';

const STATUS_LABEL = { pending: 'Menunggu Peninjauan', approved: 'Disetujui', rejected: 'Belum Bisa Diproses' };
const STATUS_COLOR = { pending: 'var(--gold-ink-dark)', approved: 'var(--success)', rejected: 'var(--muted)' };

// Ajukan Campaign Masjid (2026-09-12) — an in-app alternative to the
// existing Google Form intake (Donasi.jsx's DaftarkanMasjidCard, still
// live). Deliberately NOT auto-published: a real human on the team still
// reviews every submission (same trust boundary `donations` itself is
// built around — see firestore.rules) and manually creates the real
// campaign via the existing approve-masjid.js pipeline if it checks out.
// What this actually adds over the Google Form: it's tied to the
// submitter's own account, so they can check status here instead of
// wondering if their form response got seen.
export default function AjukanMasjid() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [myRequests, setMyRequests] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [namaMasjid, setNamaMasjid] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [plnCustomerId, setPlnCustomerId] = useState('');
  const [waContact, setWaContact] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => watchMyCampaignRequests(user?.uid, setMyRequests), [user?.uid]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !namaMasjid.trim() || submitting) return;
    setSubmitting(true);
    try {
      await submitCampaignRequest(user.uid, {
        namaMasjid: namaMasjid.trim(),
        lokasi: lokasi.trim(),
        plnCustomerId: plnCustomerId.trim(),
        waContact: waContact.trim(),
        targetAmount,
        deskripsi: deskripsi.trim(),
      });
      setNamaMasjid('');
      setLokasi('');
      setPlnCustomerId('');
      setWaContact('');
      setTargetAmount('');
      setDeskripsi('');
      setShowForm(false);
      showToast('Pengajuan terkirim, tim kami bakal tinjau dalam 1-2 hari.');
    } catch (err) {
      showToast(err.message || 'Gagal kirim pengajuan.', { type: 'danger' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Ajukan Campaign Masjid" />

        {!user ? (
          <p className="state-msg">Masuk dulu buat mengajukan campaign masjid.</p>
        ) : (
          <>
            {!showForm ? (
              <button className="btn" onClick={() => setShowForm(true)}>+ Ajukan Campaign Baru</button>
            ) : (
              <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="input-row">
                  <input required placeholder="Nama Masjid/Mushola" value={namaMasjid} onChange={(e) => setNamaMasjid(e.target.value)} maxLength={200} />
                </div>
                <div className="input-row">
                  <input placeholder="Lokasi (kota/kecamatan)" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                </div>
                <div className="input-row">
                  <input placeholder="ID Pelanggan PLN" value={plnCustomerId} onChange={(e) => setPlnCustomerId(e.target.value)} />
                </div>
                <div className="input-row">
                  <input placeholder="No. WA kontak pengurus" value={waContact} onChange={(e) => setWaContact(e.target.value)} />
                </div>
                <div className="input-row">
                  <input type="number" placeholder="Target dana (Rp)" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                </div>
                <textarea
                  placeholder="Ceritakan kondisi & kebutuhan masjid (opsional)"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Batal</button>
                  <button type="submit" className="btn" style={{ flex: 1 }} disabled={submitting || !namaMasjid.trim()}>
                    {submitting ? 'Mengirim...' : 'Kirim Pengajuan'}
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Pengajuan Kamu
              </span>
              {myRequests === null ? null : myRequests.length === 0 ? (
                <EmptyState icon="🕌" title="Belum ada pengajuan" subtitle="Ajukan campaign masjid/musholamu di atas." />
              ) : (
                myRequests.map((r) => (
                  <div key={r.id} className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{r.namaMasjid}</span>
                      <span style={{ flexShrink: 0, fontSize: 9.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999, color: '#fff', background: STATUS_COLOR[r.status] || 'var(--muted)' }}>
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                    </div>
                    {r.lokasi && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.lokasi}</span>}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
