// Bagikan Panduan sebagai PDF Ringkasan — sama pendekatan kayak
// lib/warisPdf.js (window.print() ke HTML yang di-style, "Save as PDF"
// dari dialog print browser, zero new dependency), diterapkan ke
// ringkasan seluruh tahap + checklist + hasil kalkulator kain kafan,
// biar bisa dicetak/dibagikan ke yang bantu-bantu di lokasi.
import { JENAZAH_STEPS } from '../data/jenazahGuide';

export function exportJenazahPdf({ checklist, kafanResult }) {
  const win = window.open('', '_blank');
  if (!win) return false;

  const stepsHtml = JENAZAH_STEPS.map(
    (s, i) => `
    <h2>${i + 1}. ${s.title} <span class="hukum">(${s.hukum})</span></h2>
    <p class="intro">${s.intro}</p>
    <ol>${s.poin.map((p) => `<li>${p}</li>`).join('')}</ol>
  `
  ).join('');

  const checklistHtml = checklist
    .map(
      (group) => `
    <h3>${group.title}</h3>
    <ul class="checklist">${group.items.map((item) => `<li>${item}</li>`).join('')}</ul>
  `
    )
    .join('');

  const kafanHtml = kafanResult
    ? `<p>Estimasi kebutuhan kain kafan: <b>${kafanResult.totalMeterDibulatkan.toFixed(1)} meter</b> (${kafanResult.jumlahLapis} lapis × ${kafanResult.panjangPerLapisM.toFixed(1)}m/lapis).</p>`
    : '';

  win.document.write(`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Tatacara Penanganan Jenazah — airmoon</title>
<style>
  body { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 640px; margin: 0 auto; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .sub { font-size: 12px; color: #666; margin: 0 0 24px; }
  h2 { font-size: 15px; margin: 22px 0 4px; }
  h3 { font-size: 13px; margin: 18px 0 6px; color: #0d4d47; }
  .hukum { font-size: 11px; font-weight: 400; color: #999; }
  .intro { font-size: 12.5px; color: #444; margin: 0 0 8px; line-height: 1.5; }
  ol, ul { font-size: 12.5px; line-height: 1.6; padding-left: 20px; }
  ul.checklist li { list-style: square; }
  .footer { margin-top: 28px; font-size: 10.5px; color: #999; line-height: 1.6; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h1>Tatacara Penanganan Jenazah</h1>
  <p class="sub">Ringkasan dari airmoon</p>
  ${stepsHtml}
  ${checklistHtml ? `<h2>Checklist Perlengkapan</h2>${checklistHtml}` : ''}
  ${kafanHtml}
  <p class="footer">Panduan umum sesuai pendapat mayoritas mazhab Sunni — praktik detail bisa beda tipis antar daerah/ormas. Kalau ada kasus khusus, tetep konsultasi ke ustadz/DKM setempat.</p>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
  win.document.close();
  return true;
}
