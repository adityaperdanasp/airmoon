import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import { DECORATIVE_PHOTOS_LIGHT } from '../data/photos';
import { shareFile } from '../lib/share';

const TEMPLATES = [
  { id: 0, colors: ['#0d4d47', '#0a3630'], title: 'Selamat Idul Fitri', sub: 'Mohon maaf lahir & batin' },
  { id: 1, colors: ['#a9761f', '#6b4a12'], title: 'Selamat Menunaikan Ibadah Puasa', sub: 'Marhaban Ya Ramadhan' },
  { id: 2, colors: ['#3f5c68', '#23343b'], title: "Jumat Berkah", sub: 'Semoga Allah limpahkan rahmat-Nya' },
  { id: 3, colors: ['#a9622f', '#6b3d1c'], title: 'Selamat Idul Adha', sub: 'Taqabbalallahu minna wa minkum' },
];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Same object-fit: cover math as lib/ayatCardCanvas.js's drawImageCover.
function drawImageCover(ctx, img, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
}

async function draw(canvas, tpl) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // A real photo backdrop instead of a flat two-color gradient — same
  // brand-tinted-overlay-over-photo approach lib/ayatCardCanvas.js's Ayat
  // Card and KutipanInspirasi.jsx's quote card both already use. Picked
  // deterministically per template (not randomly) so "Selamat Idul Fitri"
  // always shows the same photo rather than a different one each time the
  // card re-renders.
  const photoSrc = DECORATIVE_PHOTOS_LIGHT[(tpl.id * 3 + 1) % DECORATIVE_PHOTOS_LIGHT.length];
  try {
    const img = await loadImage(photoSrc);
    drawImageCover(ctx, img, w, h);
  } catch {
    // Offline or the photo failed to load — fall back to this card's own
    // flat two-color gradient rather than leaving a blank canvas.
    const fallback = ctx.createLinearGradient(0, 0, w, h);
    fallback.addColorStop(0, tpl.colors[0]);
    fallback.addColorStop(1, tpl.colors[1]);
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, w, h);
  }

  // Each template keeps its own two-color identity as a tinted overlay
  // over the photo, rather than a flat fill — "Idul Fitri" stays teal-
  // toned, "Idul Adha" stays terracotta-toned, etc.
  const overlay = ctx.createLinearGradient(0, 0, w, h);
  overlay.addColorStop(0, `${tpl.colors[0]}b3`); // ~70% opacity (hex alpha)
  overlay.addColorStop(1, `${tpl.colors[1]}e6`); // ~90% opacity
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    const x = w * 1.15 - i * 60;
    ctx.moveTo(x, -40);
    ctx.bezierCurveTo(x - 70, h * 0.25, x - 70, h * 0.5, x, h * 0.75);
    ctx.bezierCurveTo(x - 70, h * 0.9, x - 70, h + 40, x, h + 40);
    ctx.stroke();
  }

  ctx.fillStyle = '#e8b84b';
  ctx.font = '600 34px Amiri, serif';
  ctx.textAlign = 'center';
  ctx.fillText('تقبل الله منا ومنكم', w / 2, h * 0.42);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 40px Poppins, sans-serif';
  wrapText(ctx, tpl.title, w / 2, h * 0.56, w * 0.8, 46);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '400 20px Poppins, sans-serif';
  ctx.fillText(tpl.sub, w / 2, h * 0.68);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = test;
    }
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
}

export default function KartuUcapan() {
  const { t } = useLang();
  const canvasRef = useRef(null);
  const [tplId, setTplId] = useState(0);
  const [ready, setReady] = useState(false);
  const tpl = TEMPLATES[tplId];

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    draw(canvasRef.current, tpl).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [tpl]);

  function handleDownload() {
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kartu-ucapan-airmoon.png';
    a.click();
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'kartu-ucapan.png', { type: 'image/png' });
      await shareFile({ file, title: 'Kartu Ucapan airmoon', onFallback: handleDownload });
    });
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('item_kartu_ucapan')} />

        <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={1000}
            style={{ width: '100%', display: 'block', aspectRatio: '4 / 5' }}
          />
          {!ready && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(160deg, ${tpl.colors[0]}, ${tpl.colors[1]})` }}>
              <div className="spinner" style={{ borderTopColor: '#fff' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="section-label">{t('pilih_template')}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {TEMPLATES.map((tp) => (
              <button
                key={tp.id}
                onClick={() => setTplId(tp.id)}
                aria-label={`Template ${tp.title}`}
                aria-pressed={tp.id === tplId}
                style={{
                  width: 56,
                  height: 70,
                  borderRadius: 12,
                  border: tp.id === tplId ? '2px solid var(--primary)' : 'none',
                  cursor: 'pointer',
                  background: `linear-gradient(160deg, ${tp.colors[0]}, ${tp.colors[1]})`,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" onClick={handleDownload} disabled={!ready}>{t('simpan')}</button>
          <button className="btn" onClick={handleShare} disabled={!ready}>{t('bagikan')}</button>
        </div>
      </div>
    </div>
  );
}
