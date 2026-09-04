import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';
import { DECORATIVE_PHOTOS_LIGHT } from '../data/photos';
import { shareFile } from '../lib/share';
import { getKartuUcapanHistory, logKartuUcapan } from '../lib/kartuUcapanHistory';

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

// Draws from fully custom inputs now (title/sub/2 colors/photo index) —
// the 4 TEMPLATES below are just starting points that populate these same
// inputs, not a fixed set the render is locked to. Was `draw(canvas, tpl)`
// reading straight off a TEMPLATES entry before the "custom text/foto/
// warna" ask; kept the same drawing logic, just parameterized.
async function draw(canvas, { title, sub, color1, color2, photoIndex, arabicText, arabicFont }) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Widget Kaligrafi Nama — the Arabic line was a fixed hardcoded string
  // with no way to personalize it (a name, a different du'a); now a free
  // RTL text input with a choice of the same 2 Arabic fonts this app
  // already offers Mode Ayat readers (lib/readingPrefs.js's useArabicFont)
  // — Scheherazade New is purpose-built for Quranic/classical Arabic,
  // giving a genuinely different calligraphic feel than Amiri.
  await document.fonts.load(`600 34px '${arabicFont}'`);

  const photoSrc = DECORATIVE_PHOTOS_LIGHT[((photoIndex % DECORATIVE_PHOTOS_LIGHT.length) + DECORATIVE_PHOTOS_LIGHT.length) % DECORATIVE_PHOTOS_LIGHT.length];
  try {
    const img = await loadImage(photoSrc);
    drawImageCover(ctx, img, w, h);
  } catch {
    // Offline or the photo failed to load — fall back to a flat two-color
    // gradient from the same chosen colors rather than leaving a blank canvas.
    const fallback = ctx.createLinearGradient(0, 0, w, h);
    fallback.addColorStop(0, color1);
    fallback.addColorStop(1, color2);
    ctx.fillStyle = fallback;
    ctx.fillRect(0, 0, w, h);
  }

  // The chosen 2-color gradient as a tinted overlay over the photo,
  // rather than a flat fill.
  const overlay = ctx.createLinearGradient(0, 0, w, h);
  overlay.addColorStop(0, `${color1}b3`); // ~70% opacity (hex alpha)
  overlay.addColorStop(1, `${color2}e6`); // ~90% opacity
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
  ctx.font = `600 34px '${arabicFont}', serif`;
  ctx.textAlign = 'center';
  ctx.fillText(arabicText || ' ', w / 2, h * 0.42);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 40px Poppins, sans-serif';
  wrapText(ctx, title || ' ', w / 2, h * 0.56, w * 0.8, 46);

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '400 20px Poppins, sans-serif';
  wrapText(ctx, sub || ' ', w / 2, h * 0.68, w * 0.8, 26);
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

function photoIndexForTemplate(tp) {
  return (tp.id * 3 + 1) % DECORATIVE_PHOTOS_LIGHT.length;
}

export default function KartuUcapan() {
  const { t } = useLang();
  const canvasRef = useRef(null);
  const [tplId, setTplId] = useState(0);
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState(() => getKartuUcapanHistory());

  // Free-text title/subtitle, a photo pick, and a 2-color gradient — all
  // independently editable now, seeded from whichever template was last
  // tapped (see selectTemplate below) rather than locked to it. This is
  // the actual state the card draws from; TEMPLATES is just presets.
  const [title, setTitle] = useState(TEMPLATES[0].title);
  const [sub, setSub] = useState(TEMPLATES[0].sub);
  const [color1, setColor1] = useState(TEMPLATES[0].colors[0]);
  const [color2, setColor2] = useState(TEMPLATES[0].colors[1]);
  const [photoIndex, setPhotoIndex] = useState(photoIndexForTemplate(TEMPLATES[0]));
  const [arabicText, setArabicText] = useState('تقبل الله منا ومنكم');
  const [arabicFont, setArabicFont] = useState('Amiri');

  function selectTemplate(tp) {
    setTplId(tp.id);
    setTitle(tp.title);
    setSub(tp.sub);
    setColor1(tp.colors[0]);
    setColor2(tp.colors[1]);
    setPhotoIndex(photoIndexForTemplate(tp));
  }

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    draw(canvasRef.current, { title, sub, color1, color2, photoIndex, arabicText, arabicFont }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [title, sub, color1, color2, photoIndex, arabicText, arabicFont]);

  function handleDownload() {
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kartu-ucapan-airmoon.png';
    a.click();
    logKartuUcapan(tplId);
    setHistory(getKartuUcapanHistory());
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'kartu-ucapan.png', { type: 'image/png' });
      await shareFile({ file, title: 'Kartu Ucapan airmoon', onFallback: handleDownload });
    });
    logKartuUcapan(tplId);
    setHistory(getKartuUcapanHistory());
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('item_kartu_ucapan')} />

        {/* [UI] Preview enlarged slightly (a small negative margin eating
            into .screen-content's own 20px side padding) so photo/text
            detail reads more clearly before committing to a download —
            was capped at the same width as every other element on the
            page, which is narrower than it needs to be for the one thing
            on this page that's actually an image. */}
        <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', boxShadow: 'var(--shadow-card)', margin: '0 -10px' }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={1000}
            style={{ width: '100%', display: 'block', aspectRatio: '4 / 5' }}
          />
          {!ready && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(160deg, ${color1}, ${color2})` }}>
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
                onClick={() => selectTemplate(tp)}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="section-label">Teks Ucapan</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul, misal 'Selamat Idul Fitri'"
            maxLength={60}
            style={{ padding: '11px 13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 13.5, fontWeight: 700 }}
          />
          <input
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            placeholder="Sub-judul, misal 'Mohon maaf lahir & batin'"
            maxLength={80}
            style={{ padding: '11px 13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 12.5 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="section-label">Kaligrafi Arab</span>
          <input
            value={arabicText}
            onChange={(e) => setArabicText(e.target.value)}
            placeholder="مثال: تقبل الله منا ومنكم"
            dir="rtl"
            maxLength={40}
            style={{ padding: '11px 13px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--ink)', fontSize: 16, fontFamily: `'${arabicFont}', serif` }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {['Amiri', 'Scheherazade New'].map((f) => (
              <button
                key={f}
                onClick={() => setArabicFont(f)}
                aria-pressed={arabicFont === f}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 999,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: `'${f}', serif`,
                  color: arabicFont === f ? 'var(--on-primary)' : 'var(--ink)',
                  background: arabicFont === f ? 'var(--primary)' : 'var(--mint-soft)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="section-label">Foto Latar</span>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {DECORATIVE_PHOTOS_LIGHT.map((src, i) => (
              <button
                key={src}
                onClick={() => setPhotoIndex(i)}
                aria-label={`Foto latar ${i + 1}`}
                aria-pressed={photoIndex === i}
                style={{
                  flexShrink: 0,
                  width: 52,
                  height: 65,
                  borderRadius: 10,
                  padding: 0,
                  overflow: 'hidden',
                  border: photoIndex === i ? '2.5px solid var(--primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  background: 'none',
                }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="section-label">Warna Gradasi</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ width: 34, height: 34, border: 'none', borderRadius: 8, padding: 0, background: 'none', cursor: 'pointer' }} />
              Warna 1
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ width: 34, height: 34, border: 'none', borderRadius: 8, padding: 0, background: 'none', cursor: 'pointer' }} />
              Warna 2
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" onClick={handleDownload} disabled={!ready}>{t('simpan')}</button>
          <button className="btn" onClick={handleShare} disabled={!ready}>{t('bagikan')}</button>
        </div>

        {history.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="section-label" style={{ color: 'var(--muted)', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Riwayat Dibuat
            </span>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {history.map((h) => {
                const t2 = TEMPLATES[h.templateId];
                if (!t2) return null;
                return (
                  <button
                    key={h.templateId}
                    onClick={() => selectTemplate(t2)}
                    style={{
                      flexShrink: 0,
                      width: 46,
                      height: 58,
                      borderRadius: 10,
                      border: h.templateId === tplId ? '2px solid var(--primary)' : 'none',
                      cursor: 'pointer',
                      background: `linear-gradient(160deg, ${t2.colors[0]}, ${t2.colors[1]})`,
                    }}
                    aria-label={`Pakai lagi template ${t2.title}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
