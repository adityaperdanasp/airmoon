import { useState } from 'react';
import { KNOWLEDGE_TOPICS, KNOWLEDGE_SOURCE, HEIR_TABLE, TABLE_LEGEND } from '../data/warisKnowledge';

function Chevron({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-1) var(--ease)' }}>
      <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arabic({ text, note }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontFamily: "'Amiri', serif", fontSize: 19, lineHeight: 1.9, direction: 'rtl', textAlign: 'right' }}>{text}</div>
      <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{note}</div>
    </div>
  );
}

function Topic({ topic }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)', textAlign: 'left' }}
      >
        <span style={{ fontSize: 13, fontWeight: 700 }}>{topic.title}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--muted)' }}>{topic.intro}</p>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {topic.bullets.map((b) => (
              <li key={b} style={{ fontSize: 12.5, lineHeight: 1.6 }}>{b}</li>
            ))}
          </ul>
          {topic.arabic && <Arabic text={topic.arabic} note={topic.arabicNote} />}
          {topic.arabic2 && <Arabic text={topic.arabic2} note={topic.arabicNote2} />}
          {topic.extra && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--primary)' }}>{topic.extra.title}</span>
              {topic.extra.items.map(([ar, id], i) => (
                <div key={ar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 12px', borderRadius: 12, background: 'var(--bg)' }}>
                  <span style={{ fontSize: 12.5, minWidth: 0 }}>{i + 1}. {id}</span>
                  <span style={{ fontFamily: "'Amiri', serif", fontSize: 17, whiteSpace: 'nowrap', flexShrink: 0 }}>{ar}</span>
                </div>
              ))}
            </div>
          )}
          {topic.calcNote && (
            <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--mint-soft)', fontSize: 11.5, lineHeight: 1.55, color: 'var(--primary)' }}>
              {topic.calcNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HeirCard({ heir }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 16, background: 'var(--bg)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)', textAlign: 'left' }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 0 }}>{heir.nama}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Amiri', serif", fontSize: 17, whiteSpace: 'nowrap' }}>{heir.arab}</span>
          <Chevron open={open} />
        </span>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 14px 14px' }}>
          {heir.rows.map((row, i) => {
            const mahjub = row.porsi === 'Mahjub';
            return (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: mahjub ? 'var(--cream)' : 'var(--mint-soft)', color: mahjub ? 'var(--gold-ink-dark)' : 'var(--primary)' }}>
                  {row.porsi}
                </span>
                {row.ada.length > 0 && (
                  <div style={{ fontSize: 11.5, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--muted)' }}>Jika ada: </span>{row.ada.join(', ')}
                  </div>
                )}
                {row.tidak.length > 0 && (
                  <div style={{ fontSize: 11.5, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--muted)' }}>Jika tidak ada: </span>{row.tidak.join(', ')}
                  </div>
                )}
                {row.ada.length === 0 && row.tidak.length === 0 && (
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Tanpa syarat tambahan.</div>
                )}
                {row.catatan && <div style={{ fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>{row.catatan}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// "Pengetahuan Waris" — the teaching half of the Kalkulator Waris page:
// the book's topics (4 hak atas harta, syarat, penghalang, sebab, jalur
// nasab, fardh vs ta'shib) as collapsible topics, plus the per-heir
// porsi/syarat table. Collapsed by default so it never pushes the
// calculator down.
export default function WarisKnowledge() {
  const [open, setOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  return (
    <div className="card" style={{ padding: '4px 16px', display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)', textAlign: 'left' }}
      >
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--muted)' }}>📚 Pengetahuan Waris</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {KNOWLEDGE_TOPICS.map((t) => (
            <Topic key={t.id} topic={t} />
          ))}

          <div style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => setTableOpen((v) => !v)}
              aria-expanded={tableOpen}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--ink)', textAlign: 'left' }}
            >
              <span style={{ fontSize: 13, fontWeight: 700 }}>Tabel Porsi & Syarat per Ahli Waris</span>
              <Chevron open={tableOpen} />
            </button>
            {tableOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
                <div style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--cream)', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {TABLE_LEGEND.map(([k, v]) => (
                    <div key={k} style={{ fontSize: 10.5, lineHeight: 1.5, color: 'var(--gold-ink-dark)' }}>
                      <b>{k}</b> = {v}
                    </div>
                  ))}
                </div>
                {HEIR_TABLE.map((h) => (
                  <HeirCard key={h.id} heir={h} />
                ))}
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 0 14px', fontSize: 10.5, color: 'var(--muted-soft)', lineHeight: 1.5 }}>
            {KNOWLEDGE_SOURCE} Untuk kasus rumit atau kalau mazhab/ormas setempat berbeda pandangan, konsultasikan ke ahli faraidh/ulama.
          </div>
        </div>
      )}
    </div>
  );
}
