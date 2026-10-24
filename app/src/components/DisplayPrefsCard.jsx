import { useState } from 'react';
import SegButton from './SegButton';
import ToggleSwitch from './ToggleSwitch';
import { getUiPrefs, setUiPref } from '../lib/uiPrefs';

// "Tampilan lanjutan": ukuran tampilan, kontras, hitam pekat OLED, kurangi
// efek, getar dan bunyi halus. Semua per perangkat (lib/uiPrefs.js) dan
// langsung berlaku di seluruh aplikasi.
function Row({ title, sub, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{title}</span>
        {sub && <span style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.4 }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

export default function DisplayPrefsCard() {
  const [p, setP] = useState(getUiPrefs);
  function set(name, value) {
    setUiPref(name, value);
    setP(getUiPrefs());
  }
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>Tampilan Lanjutan</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>Nyaman di mata dan hemat baterai, berlaku di perangkat ini.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700 }}>Ukuran tampilan</span>
        <div style={{ display: 'flex', padding: 3, borderRadius: 999, background: 'var(--mint-soft)' }}>
          <SegButton active={p.zoom === 100} onClick={() => set('zoom', 100)}>Normal</SegButton>
          <SegButton active={p.zoom === 110} onClick={() => set('zoom', 110)}>Besar</SegButton>
          <SegButton active={p.zoom === 125} onClick={() => set('zoom', 125)}>Lebih besar</SegButton>
        </div>
      </div>

      <Row title="Kontras tinggi" sub="Teks dan garis lebih tegas, cocok di bawah terik matahari.">
        <ToggleSwitch checked={p.contrast === 'high'} onChange={(v) => set('contrast', v ? 'high' : 'normal')} />
      </Row>
      <Row title="Hitam pekat (OLED)" sub="Latar mode gelap jadi hitam penuh, lebih hemat baterai di layar OLED.">
        <ToggleSwitch checked={p.oled} onChange={(v) => set('oled', v)} />
      </Row>
      <Row title="Kurangi efek" sub="Matikan blur, latar warna-warni, dan animasi. Lebih ringan di HP lama.">
        <ToggleSwitch checked={p.fx === 'reduced'} onChange={(v) => set('fx', v ? 'reduced' : 'full')} />
      </Row>
      <Row title="Buka ke halaman terakhir" sub="Saat aplikasi dibuka, langsung lanjut ke halaman yang terakhir kamu pakai.">
        <ToggleSwitch checked={p.resume} onChange={(v) => set('resume', v)} />
      </Row>
      <Row title="Statistik penggunaan anonim" sub="Hanya hitungan fitur apa yang dipakai (tanpa identitas, tanpa isi), supaya aplikasi bisa diperbaiki ke arah yang tepat.">
        <ToggleSwitch checked={p.analytics} onChange={(v) => set('analytics', v)} />
      </Row>
      <Row title="Getar halus" sub="Getaran singkat saat mencentang ibadah.">
        <ToggleSwitch checked={p.haptics} onChange={(v) => set('haptics', v)} />
      </Row>
      <Row title="Bunyi tik halus" sub="Suara pendek saat mencentang. Mati secara bawaan.">
        <ToggleSwitch checked={p.sound} onChange={(v) => set('sound', v)} />
      </Row>
    </div>
  );
}
