import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

// Target Ramadan: disusun jauh sebelum Ramadan supaya masuk bulan itu sudah
// punya rencana. Tersimpan di users/{uid}.ramadanTarget. Hanya perhitungan
// bantu (berapa halaman per hari, berapa sesudah tiap sholat), bukan ketentuan.
const KHATAM = [1, 2, 3];
const SEDEKAH = [0, 5000, 10000, 20000];
const TOTAL_PAGES = 604; // mushaf Madinah

export default function RamadanTargetCard() {
  const { user } = useAuth();
  const [t, setT] = useState({ khatam: 1, sedekahPerHari: 5000, itikaf: false });
  useEffect(() => {
    if (!user?.uid) return undefined;
    return onSnapshot(doc(db, 'users', user.uid), (snap) => {
      const v = snap.data()?.ramadanTarget;
      if (v) setT((prev) => ({ ...prev, ...v }));
    });
  }, [user?.uid]);

  function update(patch) {
    const next = { ...t, ...patch };
    setT(next);
    if (user?.uid) setDoc(doc(db, 'users', user.uid), { ramadanTarget: next }, { merge: true });
  }

  const perDay = Math.ceil((t.khatam * TOTAL_PAGES) / 30);
  const perSholat = Math.ceil(perDay / 5);
  const totalSedekah = t.sedekahPerHari * 30;
  const chip = (active) => ({ padding: '7px 14px', borderRadius: 999, border: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: active ? 'var(--primary)' : 'var(--mint-soft)', color: active ? 'var(--on-primary)' : 'var(--ink)' });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 14, fontWeight: 800 }}>Target Ramadan Kamu</span>
        <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>Susun dari sekarang, supaya masuk Ramadan sudah punya rencana.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>Khatam Qur'an</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {KHATAM.map((k) => <button key={k} style={chip(t.khatam === k)} aria-pressed={t.khatam === k} onClick={() => update({ khatam: k })}>{k}x</button>)}
        </div>
        <span style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
          Sekitar <b style={{ color: 'var(--ink)' }}>{perDay} halaman per hari</b>, atau {perSholat} halaman setelah tiap sholat fardhu.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>Sedekah per hari</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SEDEKAH.map((v) => <button key={v} style={chip(t.sedekahPerHari === v)} aria-pressed={t.sedekahPerHari === v} onClick={() => update({ sedekahPerHari: v })}>{v === 0 ? 'Belum' : `Rp ${v.toLocaleString('id-ID')}`}</button>)}
        </div>
        {t.sedekahPerHari > 0 && (
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Total satu bulan: <b style={{ color: 'var(--ink)' }}>Rp {totalSedekah.toLocaleString('id-ID')}</b></span>
        )}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
        <input type="checkbox" checked={!!t.itikaf} onChange={(e) => update({ itikaf: e.target.checked })} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
        Ingin i'tikaf di 10 malam terakhir
      </label>
    </div>
  );
}
