import { useState } from 'react';
import TopBar from '../components/TopBar';
import { loadReadProgress, toggleReadProgress } from '../lib/readProgress';

const PAGE_KEY = 'badal';

// Content written originally based on rumaysho.com/12952-badal-umrah-adakah-dalilnya.html
// and rumaysho.com/2873-10-ketentuan-badal-haji.html (badal umrah follows
// the same ruling as badal haji, by qiyas) — same sourcing/caveat note as
// UmrohManasik.jsx. This is a genuinely nuanced fiqh topic where scholars
// differ on some details (e.g. permission requirements for a still-living,
// capable person) — treat this as an overview, not a fatwa; a real case
// should go through a qualified ustadz.
const SECTIONS = [
  {
    title: 'Apa itu Badal Umrah?',
    body: 'Badal umrah artinya melaksanakan ibadah umrah atas nama orang lain — biasanya karena orang tersebut sudah meninggal, atau masih hidup tapi sudah tidak mampu secara fisik buat berangkat sendiri (sakit permanen, lanjut usia, dll).',
  },
  {
    title: 'Hukumnya',
    body: 'Jumhur (mayoritas) ulama membolehkan badal umrah, dengan meng-qiyaskan (menganalogikan) pada hukum badal haji — karena keduanya sama-sama ibadah yang melibatkan fisik dan harta, dan haji/umrah termasuk ibadah yang boleh diwakilkan dalam kondisi tertentu.',
  },
  {
    title: 'Untuk Siapa Boleh Dibadalkan?',
    body: null,
    list: [
      'Orang yang sudah meninggal — semua mazhab membolehkan, bahkan tanpa perlu wasiat/izin sebelumnya dari yang bersangkutan.',
      'Orang hidup yang tidak mampu secara fisik (sakit menahun, sudah sangat tua) — mazhab Syafi\'i membolehkan.',
      'Orang hidup yang sebenarnya mampu — sebagian mazhab (Hanafi, Hanbali) mensyaratkan harus ada izin/persetujuan dari orang yang bersangkutan.',
    ],
  },
  {
    title: 'Syarat Orang yang Membadalkan',
    body: null,
    list: [
      'Sudah pernah melaksanakan umrah (atau haji) untuk dirinya sendiri terlebih dahulu — sebelum membadalkan orang lain.',
      'Dalam satu kali perjalanan, hanya boleh membadalkan untuk satu orang saja.',
    ],
  },
  {
    title: 'Catatan Penting',
    body: 'Ini ringkasan umum, bukan pengganti fatwa. Kalau kamu berencana membadalkan umrah untuk keluarga (misal yang sudah wafat), sebaiknya konsultasikan ke ustadz atau pembimbing manasik travel umrah kamu buat mastiin caranya sesuai dan niatnya benar.',
  },
];

export default function UmrohBadal() {
  const [progress, setProgress] = useState(() => loadReadProgress(PAGE_KEY));
  const doneCount = Object.values(progress).filter(Boolean).length;

  function toggle(title) {
    setProgress(toggleReadProgress(PAGE_KEY, title));
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Badal Umrah" subtitle={`${doneCount}/${SECTIONS.length} bagian ditandai`} />
        <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(doneCount / SECTIONS.length) * 100}%`, background: 'var(--primary)', transition: 'width 0.25s ease' }} />
        </div>
        <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
          Dirangkum dari{' '}
          <a href="https://rumaysho.com/12952-badal-umrah-adakah-dalilnya.html" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Rumaysho.com
          </a>{' '}
          (Ustadz M. Abduh Tuasikal).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SECTIONS.map((s) => (
            <div key={s.title} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{s.title}</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
                  <input type="checkbox" checked={!!progress[s.title]} onChange={() => toggle(s.title)} style={{ width: 15, height: 15, accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Sudah dibaca</span>
                </label>
              </div>
              {s.body && <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--ink)' }}>{s.body}</p>}
              {s.list && (
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {s.list.map((item, i) => (
                    <li key={i} style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
