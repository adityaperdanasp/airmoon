import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LangContext';
import TopBar from '../components/TopBar';

const TEMPLATES = [
  { id: 0, colors: ['#0d4d47', '#0a3630'], title: 'Selamat Idul Fitri', sub: 'Mohon maaf lahir & batin' },
  { id: 1, colors: ['#a9761f', '#6b4a12'], title: 'Selamat Menunaikan Ibadah Puasa', sub: 'Marhaban Ya Ramadhan' },
  { id: 2, colors: ['#3f5c68', '#23343b'], title: "Jumat Berkah", sub: 'Semoga Allah limpahkan rahmat-Nya' },
  { id: 3, colors: ['#a9622f', '#6b3d1c'], title: 'Selamat Idul Adha', sub: 'Taqabbalallahu minna wa minkum' },
];

function draw(canvas, tpl) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, tpl.colors[0]);
  grad.addColorStop(1, tpl.colors[1]);
  ctx.fillStyle = grad;
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
  const tpl = TEMPLATES[tplId];

  useEffect(() => {
    if (canvasRef.current) draw(canvasRef.current, tpl);
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
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Kartu Ucapan airmoon' });
      } else {
        handleDownload();
      }
    });
  }

  return (
    <div className="screen">
      <div className="screen-content">
        <TopBar title={t('item_kartu_ucapan')} />

        <canvas
          ref={canvasRef}
          width={800}
          height={1000}
          style={{ width: '100%', borderRadius: 22, aspectRatio: '4 / 5', boxShadow: 'var(--shadow-card)' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="section-label">{t('pilih_template')}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTplId(t.id)}
                style={{
                  width: 56,
                  height: 70,
                  borderRadius: 12,
                  border: t.id === tplId ? '2px solid var(--primary)' : 'none',
                  cursor: 'pointer',
                  background: `linear-gradient(160deg, ${t.colors[0]}, ${t.colors[1]})`,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" onClick={handleDownload}>{t('simpan')}</button>
          <button className="btn" onClick={handleShare}>{t('bagikan')}</button>
        </div>
      </div>
    </div>
  );
}
