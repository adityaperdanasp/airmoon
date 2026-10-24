import { useEffect, useState } from 'react';
import SegButton from './SegButton';
import ToggleSwitch from './ToggleSwitch';
import { DIGEST_MODES, watchMorningDigest, setMorningDigest } from '../lib/morningDigest';

// Ringkasan Pagi: satu notifikasi per hari berisi jadwal lima waktu dan
// ajakan dzikir pagi. Ikut kategori "Pengingat Ibadah" dan Jam Tenang.
export default function MorningDigestCard({ uid }) {
  const [d, setD] = useState({ enabled: false, mode: 'after-fajr' });
  useEffect(() => watchMorningDigest(uid, setD), [uid]);
  function update(patch) {
    const next = { ...d, ...patch };
    setD(next);
    setMorningDigest(uid, next);
  }
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Ringkasan Pagi</span>
          <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.45 }}>Satu notifikasi tiap pagi: jadwal sholat hari ini dan ajakan dzikir pagi.</span>
        </div>
        <ToggleSwitch checked={d.enabled} onChange={(v) => update({ enabled: v })} />
      </div>
      {d.enabled && (
        <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)' }}>
          {DIGEST_MODES.map((m) => (
            <SegButton key={m.id} active={d.mode === m.id} onClick={() => update({ mode: m.id })}>{m.label}</SegButton>
          ))}
        </div>
      )}
    </div>
  );
}
