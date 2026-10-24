import { useState } from 'react';
import { IQAMAH_KEYS, IQAMAH_LABELS, MIN_IQAMAH, MAX_IQAMAH, getIqamahOffsets, setIqamahOffset } from '../lib/iqamah';

// Jeda adzan ke iqamah per waktu sholat, buat "Waktu Mustajab" di Home.
export default function IqamahCard() {
  const [offsets, setOffsets] = useState(getIqamahOffsets);
  const step = { width: 30, height: 30, borderRadius: 10, border: 'none', background: 'var(--mint-soft)', color: 'var(--ink)', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', padding: 0 };
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Jeda Adzan ke Iqamah</span>
        <span style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.45 }}>
          Sesuaikan dengan masjid tempat kamu biasa sholat. Dipakai untuk pengingat waktu mustajab "antara adzan dan iqamah" di Home.
        </span>
      </div>
      {IQAMAH_KEYS.map((k) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{IQAMAH_LABELS[k]}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={step} aria-label={`Kurangi jeda ${IQAMAH_LABELS[k]}`} disabled={offsets[k] <= MIN_IQAMAH} onClick={() => setOffsets(setIqamahOffset(k, offsets[k] - 1))}>−</button>
            <span style={{ minWidth: 56, textAlign: 'center', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{offsets[k]} menit</span>
            <button style={step} aria-label={`Tambah jeda ${IQAMAH_LABELS[k]}`} disabled={offsets[k] >= MAX_IQAMAH} onClick={() => setOffsets(setIqamahOffset(k, offsets[k] + 1))}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
