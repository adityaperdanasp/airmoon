import { useState } from 'react';
import TopBar from '../components/TopBar';

// Low-risk, well-known quotes — verify against a mu'tabar source before production.
const QUOTES = [
  { arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Maka sesungguhnya bersama kesulitan ada kemudahan.', source: 'QS. Al-Insyirah: 6' },
  { arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', translation: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.', source: 'QS. Al-Baqarah: 286' },
  { arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ', translation: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain.', source: 'Hadits' },
];

export default function KutipanInspirasi() {
  const [idx, setIdx] = useState(0);
  const q = QUOTES[idx];

  async function handleShare() {
    const text = `"${q.translation}" — ${q.source}`;
    if (navigator.share) await navigator.share({ text, title: 'Kutipan dari airmoon' });
    else await navigator.clipboard.writeText(text);
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title="Kutipan Inspirasi" />

        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            padding: '32px 26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            textAlign: 'center',
            background: `linear-gradient(160deg, var(--primary), var(--primary-dark))`,
            minHeight: 300,
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: "'Amiri', serif", fontSize: 26, lineHeight: 1.9, color: '#fff', direction: 'rtl' }}>{q.arabic}</span>
          <span style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>"{q.translation}"</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>{q.source}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 18 : 5,
                height: 5,
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: i === idx ? 'var(--primary)' : 'var(--border)',
              }}
              aria-label={`Kutipan ${i + 1}`}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" onClick={() => setIdx((i) => (i + 1) % QUOTES.length)}>Berikutnya</button>
          <button className="btn" onClick={handleShare}>Bagikan</button>
        </div>
      </div>
    </div>
  );
}
