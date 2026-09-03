import { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';

const STORAGE_KEY = 'airmoon-umroh-checklist';
const CUSTOM_KEY = 'airmoon-umroh-checklist-custom';

function loadCustomItems() {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// General, widely-known preparation items (visa/vaccine requirements,
// standard packing) — not fiqh content, so this doesn't carry the same
// "verify against a mu'tabar source" caveat as UmrohManasik/UmrohBadal.
// Meningitis vaccination specifically is a real Saudi entry requirement
// for umrah/hajj visas (not just a generic health tip), worth calling
// out as such rather than lumping it in as "nice to have".
const GROUPS = [
  {
    title: 'Dokumen',
    items: [
      'Paspor (masa berlaku minimal 6 bulan sejak keberangkatan)',
      'Visa umrah',
      'Kartu vaksin meningitis (International Certificate of Vaccination / buku kuning) — syarat wajib visa umrah',
      'Tiket pesawat & jadwal keberangkatan/kepulangan',
      'Bukti pemesanan hotel/travel (voucher)',
    ],
  },
  {
    title: 'Kesehatan',
    items: [
      'Vaksin meningitis meningokokus (wajib, minimal 10 hari sebelum berangkat)',
      'Obat-obatan pribadi rutin (bawa cukup untuk seluruh durasi + cadangan)',
      'Surat keterangan sehat dari dokter (kalau punya riwayat penyakit tertentu)',
    ],
  },
  {
    title: 'Perlengkapan Ibadah',
    items: [
      'Kain ihram 2 lembar + 1 cadangan (laki-laki)',
      'Pakaian ihram/gamis yang menutup aurat sempurna (perempuan)',
      'Sajadah kecil / alas sholat portable',
      "Al-Qur'an kecil atau pastikan app-nya bisa dipakai offline",
      'Tasbih',
    ],
  },
  {
    title: 'Perlengkapan Pribadi',
    items: [
      'Sandal jepit (buat masuk-keluar masjid)',
      'Powerbank & adaptor colokan tipe G (standar Arab Saudi)',
      'Pakaian secukupnya sesuai durasi (cuaca panas & kering)',
      'Sunblock, pelembap bibir, kacamata hitam',
    ],
  },
  {
    title: 'Persiapan Diri',
    items: [
      'Pelajari tata cara manasik sebelum berangkat (lihat halaman Panduan Manasik)',
      'Luruskan niat — umrah karena Allah, bukan sekadar jalan-jalan',
      'Selesaikan hutang & minta maaf/restu ke keluarga sebelum berangkat',
      'Siapkan wasiat (kalau ada tanggungan/amanah yang perlu diketahui keluarga)',
    ],
  },
];

export default function UmrohChecklist() {
  const [checked, setChecked] = useState({});
  const [customItems, setCustomItems] = useState(() => loadCustomItems());
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setChecked(saved);
    } catch {
      // Corrupt/missing localStorage value — just start from an empty
      // checklist rather than crashing the page over it.
    }
  }, []);

  function toggle(key) {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function addCustomItem() {
    const text = newItem.trim();
    if (!text) return;
    const next = [...customItems, text];
    setCustomItems(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
    setNewItem('');
  }

  function removeCustomItem(item) {
    const next = customItems.filter((i) => i !== item);
    setCustomItems(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
    // Also drop its checked state — "Tambahan Saya":item was that item's
    // own checklist key, no reason to keep a stray true/false around for
    // an item that no longer exists.
    setChecked((prev) => {
      const { [`Tambahan Saya:${item}`]: _removed, ...rest } = prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      return rest;
    });
  }

  // Custom items fold into the same progress count as the built-in
  // groups — someone's own added items are just as real a preparation
  // step as the curated ones.
  const totalItems = GROUPS.reduce((sum, g) => sum + g.items.length, 0) + customItems.length;
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Checklist Persiapan" />

        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Progres persiapan</div>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${totalItems ? (doneCount / totalItems) * 100 : 0}%`,
                  background: 'var(--primary)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)' }}>
            {doneCount}/{totalItems}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {GROUPS.map((group) => (
            <div key={group.title} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h2 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{group.title}</h2>
              {group.items.map((item) => {
                const key = `${group.title}:${item}`;
                const isChecked = !!checked[key];
                return (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--primary)', flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        color: isChecked ? 'var(--muted)' : 'var(--ink)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          ))}

          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>Tambahan Saya</h2>
            {customItems.length === 0 && (
              <p style={{ margin: '0 0 8px', fontSize: 11.5, color: 'var(--muted)' }}>Belum ada item tambahan.</p>
            )}
            {customItems.map((item) => {
              const key = `Tambahan Saya:${item}`;
              const isChecked = !!checked[key];
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--primary)', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12.5, lineHeight: 1.5, color: isChecked ? 'var(--muted)' : 'var(--ink)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                      {item}
                    </span>
                  </label>
                  <button
                    onClick={() => removeCustomItem(item)}
                    aria-label={`Hapus ${item}`}
                    style={{ background: 'none', border: 'none', color: 'var(--muted-soft)', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6l12 12M18 6 6 18" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                placeholder="Tambah barang/persiapan sendiri…"
                style={{ flex: 1, padding: '9px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 12.5 }}
              />
              <button className="btn-outline" style={{ padding: '0 16px', fontSize: 12 }} onClick={addCustomItem} disabled={!newItem.trim()}>
                Tambah
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
