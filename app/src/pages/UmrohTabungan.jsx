import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import { formatRupiah } from '../lib/zakat';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { watchUmrohGoal, setUmrohGoal, clearUmrohGoal, watchUmrohDeposits, addUmrohDeposit, removeUmrohDeposit } from '../lib/umrohTabungan';
import ConfirmDialog from '../components/ConfirmDialog';

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function UmrohTabungan() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [goal, setGoal] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [target, setTarget] = useState('30000000');
  const [months, setMonths] = useState('12');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositNote, setDepositNote] = useState('');
  const [addingDeposit, setAddingDeposit] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pendingDeleteDeposit, setPendingDeleteDeposit] = useState(null);

  useEffect(() => watchUmrohGoal(user?.uid, setGoal), [user?.uid]);
  useEffect(() => watchUmrohDeposits(user?.uid, setDeposits), [user?.uid]);

  const targetNum = Number(target) || 0;
  const monthsNum = Number(months) || 0;
  const perMonth = monthsNum > 0 ? Math.ceil(targetNum / monthsNum) : 0;

  const saved = deposits.reduce((sum, d) => sum + (d.amount || 0), 0);
  const goalTarget = goal?.target || 0;
  const progressPercent = goalTarget > 0 ? Math.min(100, Math.round((saved / goalTarget) * 100)) : 0;

  async function handleStartSaving() {
    if (!user || targetNum <= 0 || monthsNum <= 0) return;
    await setUmrohGoal(user.uid, { target: targetNum, months: monthsNum });
    showToast('Target tabungan umroh dimulai');
  }

  async function handleAddDeposit(e) {
    e.preventDefault();
    const amount = Number(depositAmount.replace(/\D/g, ''));
    if (!user || !amount) return;
    setAddingDeposit(true);
    try {
      await addUmrohDeposit(user.uid, amount, depositNote.trim());
      setDepositAmount('');
      setDepositNote('');
      showToast('Setoran dicatat');
    } finally {
      setAddingDeposit(false);
    }
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Tabungan Umroh" />

        {goal ? (
          <>
            <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ borderRadius: 16, padding: '18px 16px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                  Terkumpul
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--on-primary)', marginTop: 6 }}>
                  {formatRupiah(saved)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--on-primary)', opacity: 0.8, marginTop: 4 }}>
                  dari target {formatRupiah(goal.target)} ({progressPercent}%)
                </div>
              </div>

              <div style={{ height: 8, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
              </div>

              <span style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
                Target: {formatRupiah(Math.ceil(goal.target / goal.months))}/bulan selama {goal.months} bulan &middot; mulai {dateFmt.format(new Date(`${goal.startDate}T00:00:00`))}
              </span>
            </div>

            <form onSubmit={handleAddDeposit} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 800 }}>Catat Setoran</span>
              <div className="input-row">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>Rp</span>
                <input
                  inputMode="numeric"
                  placeholder="500000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              <div className="input-row">
                <input placeholder="Catatan (opsional)" value={depositNote} onChange={(e) => setDepositNote(e.target.value)} />
              </div>
              <button className="btn" type="submit" disabled={addingDeposit || !depositAmount}>
                {addingDeposit ? 'Menyimpan…' : 'Simpan Setoran'}
              </button>
            </form>

            {deposits.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="section-label">Riwayat Setoran</span>
                {deposits.map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, background: 'var(--card)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>+{formatRupiah(d.amount)}</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {d.createdAt ? dateFmt.format(d.createdAt.toDate()) : 'Baru saja'}{d.note ? ` · ${d.note}` : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => setPendingDeleteDeposit(d)}
                      aria-label="Hapus setoran"
                      style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: 'var(--muted-soft)', flexShrink: 0 }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => setShowResetConfirm(true)}>
              Reset Target
            </button>
          </>
        ) : (
          <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Hitung Tabungan Bulanan</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Target biaya umroh (Rp)</span>
              <div className="input-row">
                <input type="number" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="30000000" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>Target waktu (bulan)</span>
              <div className="input-row">
                <input type="number" inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="12" />
              </div>
            </div>

            <div style={{ borderRadius: 16, padding: '16px', textAlign: 'center', background: `linear-gradient(135deg, var(--primary), var(--primary-dark))` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                Perlu ditabung tiap bulan
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--on-primary)', marginTop: 6 }}>
                {formatRupiah(perMonth)}
              </div>
            </div>

            <button className="btn" onClick={handleStartSaving} disabled={!user || targetNum <= 0 || monthsNum <= 0}>
              Mulai Menabung
            </button>
          </div>
        )}

        <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>Tips Menabung untuk Umroh</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Pisahkan rekening/tabungan khusus umroh dari rekening harian, biar gak kepakai buat kebutuhan lain.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Autodebet di awal bulan (pas gajian) lebih konsisten daripada nabung sisa di akhir bulan.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Hindari produk tabungan/pinjaman berbasis riba (bunga) — cari yang syariah kalau mau ikut program tabungan travel.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Sedekah tetap jalan meski lagi nabung — bukan menunda kebaikan, insyaallah dimudahkan rezekinya.</li>
            <li style={{ fontSize: 12.5, lineHeight: 1.55 }}>Cek juga kurs & waktu keberangkatan — harga paket umroh biasanya naik musim liburan/Ramadan.</li>
          </ul>
        </div>
      </div>

      {showResetConfirm && (
        <ConfirmDialog
          title="Reset target tabungan?"
          message="Target & riwayat setoran kamu bakal dihapus. Kamu bisa mulai lagi dari awal kapan aja."
          confirmLabel="Ya, Reset"
          danger
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={async () => {
            if (user) await clearUmrohGoal(user.uid);
            showToast('Target tabungan direset');
            setShowResetConfirm(false);
          }}
        />
      )}

      {pendingDeleteDeposit && (
        <ConfirmDialog
          title="Hapus setoran ini?"
          message={`Setoran ${formatRupiah(pendingDeleteDeposit.amount)} bakal dihapus dari riwayat.`}
          confirmLabel="Ya, Hapus"
          danger
          onCancel={() => setPendingDeleteDeposit(null)}
          onConfirm={async () => {
            if (user) await removeUmrohDeposit(user.uid, pendingDeleteDeposit.id);
            showToast('Setoran dihapus');
            setPendingDeleteDeposit(null);
          }}
        />
      )}
    </div>
  );
}
