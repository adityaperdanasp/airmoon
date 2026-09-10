import { useState } from 'react';
import TopBar from '../components/TopBar';
import Logo from '../components/Logo';
import { MedalIcon } from '../components/serviceIcons';

// Internal design-system reference (route /design-system, no nav link, not
// behind ProtectedRoute so it's one URL away for a design review). Every
// palette/spacing/motion decision this app makes lived only in scattered
// prose in CLAUDE.md — this is the living visual version, rendered from
// the real theme.css tokens so it can never drift from what ships. Not a
// user-facing page; keep it plain and functional.

const COLOR_GROUPS = [
  {
    label: 'Brand',
    tokens: ['--primary', '--primary-dark', '--accent', '--gold-ink', '--gold-ink-dark'],
  },
  {
    label: 'Surface & text',
    tokens: ['--bg', '--card', '--ink', '--muted', '--muted-soft', '--border'],
  },
  {
    label: 'Tile tints (stat/service cards)',
    tokens: ['--mint', '--mint-soft', '--cream', '--peach', '--blue-gray'],
  },
  {
    label: 'Semantic',
    tokens: ['--success', '--success-bg', '--danger', '--on-primary', '--on-gold', '--on-danger'],
  },
];

const TYPE_SCALE = [
  { px: 20, weight: 800, label: 'Display / page hero', sample: 'Assalamualaikum' },
  { px: 15, weight: 800, label: 'Section title (.title)', sample: 'Jadwal Sholat Hari Ini' },
  { px: 13, weight: 800, label: 'Card heading (.section-label)', sample: 'Amalan Harian' },
  { px: 12.5, weight: 700, label: 'Body strong', sample: 'Perang Khandaq (Ahzab)' },
  { px: 12, weight: 400, label: 'Body', sample: 'Madinah dikepung koalisi besar suku-suku Arab.' },
  { px: 11.5, weight: 700, label: 'Label / tile caption', sample: 'Kalkulator Zakat' },
  { px: 10.5, weight: 700, label: 'Micro / uppercase eyebrow', sample: 'TERAKHIR DIBUKA' },
];

const SPACING = [
  { v: 4, use: 'icon ↔ label, tight inline gaps' },
  { v: 8, use: 'chip rows, list item internals' },
  { v: 10, use: 'button rows' },
  { v: 12, use: 'grid gap (Lainnya tiles)' },
  { v: 18, use: '.screen-content section gap (default vertical rhythm)' },
  { v: 20, use: '.screen-content side padding, card padding' },
];

const MOTION = [
  { token: '--dur-1 / --ease', v: '0.12s', use: 'tap & press feedback' },
  { token: '--dur-2 / --ease', v: '0.22s', use: 'page enter, toggles, sheet slide' },
  { token: '--dur-3 / --ease', v: '0.35s', use: 'draw-ins, stagger, checkmark' },
  { token: '--dur-2 / --ease-bounce', v: '0.22s', use: 'pop / medal / celebration overshoot' },
];

function Swatch({ token }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          height: 46,
          borderRadius: 10,
          background: `var(${token})`,
          border: '1px solid var(--border)',
        }}
      />
      <code style={{ fontSize: 10, color: 'var(--muted)' }}>{token}</code>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span className="section-label">{title}</span>
      {children}
    </div>
  );
}

export default function DesignSystem() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Design System" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo size={34} />
          <span style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
            Referensi internal. Semua warna & ukuran di sini ditarik langsung dari{' '}
            <code>theme.css</code> — kalau berubah di sini, berubah juga di seluruh app.
          </span>
        </div>

        <Block title="Warna">
          {COLOR_GROUPS.map((g) => (
            <div key={g.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>{g.label}</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {g.tokens.map((t) => (
                  <Swatch key={t} token={t} />
                ))}
              </div>
            </div>
          ))}
        </Block>

        <Block title="Tipografi">
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {TYPE_SCALE.map((r) => (
              <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 9.5, color: 'var(--muted-soft)', letterSpacing: '0.03em' }}>
                  {r.px}px · {r.weight} · {r.label}
                </span>
                <span style={{ fontSize: r.px, fontWeight: r.weight, lineHeight: 1.35 }}>{r.sample}</span>
              </div>
            ))}
            <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 9.5, color: 'var(--muted-soft)' }}>Amiri — teks Arab</span>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 24, direction: 'rtl' }}>بِسْمِ اللَّهِ</span>
              <span style={{ fontSize: 9.5, color: 'var(--muted-soft)' }}>Fredoka — wordmark logo saja</span>
            </div>
          </div>
        </Block>

        <Block title="Spasi (skala 4px)">
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SPACING.map((s) => (
              <div key={s.v} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: s.v, height: 18, background: 'var(--primary)', borderRadius: 3, flexShrink: 0 }} />
                <span style={{ fontSize: 10.5, fontWeight: 700, width: 34, flexShrink: 0 }}>{s.v}px</span>
                <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>{s.use}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Radius & elevasi">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 90, height: 70, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--muted)' }}>
              12 · tile
            </div>
            <div style={{ flex: 1, minWidth: 90, height: 70, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--muted)' }}>
              20 · .card
            </div>
            <div style={{ flex: 1, minWidth: 90, height: 70, borderRadius: 999, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--muted)' }}>
              999 · pill
            </div>
          </div>
        </Block>

        <Block title="Tombol">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn">Primary — .btn</button>
            <button className="btn-outline">Secondary — .btn-outline</button>
            <button
              className="btn"
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              onMouseLeave={() => setPressed(false)}
              style={{ background: 'var(--card)', color: 'var(--ink)', border: '1px solid var(--border)' }}
            >
              {pressed ? 'ditekan…' : 'Tekan buat lihat feedback tap'}
            </button>
          </div>
        </Block>

        <Block title="Gerak">
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MOTION.map((m) => (
              <div key={m.token} style={{ display: 'flex', flexDirection: 'column' }}>
                <code style={{ fontSize: 10.5, fontWeight: 700 }}>{m.token}</code>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                  {m.v} — {m.use}
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Medali (poin)">
          <div style={{ display: 'flex', gap: 14, justifyContent: 'space-around', padding: '4px 0' }}>
            {['perunggu', 'perak', 'emas', 'platinum'].map((tier) => (
              <div key={tier} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <MedalIcon tier={tier} size={40} />
                <span style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'capitalize' }}>{tier}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Nada bahasa">
          <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>
            <div><strong style={{ color: 'var(--ink)' }}>Sapaan:</strong> selalu "kamu", tidak pernah "Anda".</div>
            <div><strong style={{ color: 'var(--ink)' }}>Tombol/aksi:</strong> Title Case, kata kerja — "Tandai Selesai", "Bagikan", "Coba Lagi".</div>
            <div><strong style={{ color: 'var(--ink)' }}>Teks bantuan / caption:</strong> kalimat biasa, boleh santai — "Tap ikon ☆ buat menyimpannya di sini."</div>
            <div><strong style={{ color: 'var(--ink)' }}>Tutup sheet/modal:</strong> selalu "Tutup".</div>
            <div><strong style={{ color: 'var(--ink)' }}>Error:</strong> jelaskan apa yang salah + cara lanjut, tanpa minta maaf berlebihan.</div>
          </div>
        </Block>
      </div>
    </div>
  );
}
