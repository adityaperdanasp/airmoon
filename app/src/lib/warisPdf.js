// Ekspor Hasil Waris ke PDF — this app has no PDF library anywhere, and
// a result like this (meant to be printed/attached for a notaris or
// kept as a family document) doesn't need one: opening a plain styled
// HTML page in a new window/tab and calling window.print() lets the
// browser's own print dialog save it as a real PDF ("Save as PDF"
// destination), with zero new dependency. This is a formal-document
// alternative to WarisShareModal's canvas image/text export, not a
// replacement for it.
import { formatRupiah } from './zakat';

export function exportWarisPdf({ totalHarta, results, warningTexts }) {
  const win = window.open('', '_blank');
  if (!win) return false; // popup blocked — caller can show a toast telling the user to allow popups

  const rows = results
    .map(
      (r) => `<tr><td>${r.label}</td><td class="num">${(r.fraction * 100).toFixed(2)}%</td><td class="num">${formatRupiah(r.amount)}</td></tr>`
    )
    .join('');
  const warnBlock = warningTexts.length
    ? `<div class="warn">${warningTexts.map((w) => `<p>${w}</p>`).join('')}</div>`
    : '';
  const today = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  win.document.write(`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Hasil Kalkulator Waris — airmoon</title>
<style>
  body { font-family: -apple-system, 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 640px; margin: 0 auto; }
  h1 { font-size: 20px; margin: 0 0 2px; }
  .sub { font-size: 12px; color: #666; margin: 0 0 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #e5e5e5; }
  th { color: #666; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .warn { margin-top: 20px; padding: 12px 14px; background: #fbf0d9; border-radius: 8px; font-size: 11.5px; color: #6b4f22; line-height: 1.5; }
  .warn p { margin: 0 0 6px; }
  .warn p:last-child { margin-bottom: 0; }
  .footer { margin-top: 28px; font-size: 10.5px; color: #999; line-height: 1.6; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h1>Hasil Kalkulator Waris</h1>
  <p class="sub">Dicetak ${today} melalui airmoon · Total Harta: ${formatRupiah(totalHarta)}</p>
  <table>
    <thead><tr><th>Ahli Waris</th><th class="num">Bagian</th><th class="num">Nominal</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  ${warnBlock}
  <p class="footer">Dihasilkan dari Kalkulator Waris airmoon — mengikuti tabel porsi dan syarat Ilmu Faraidh (pasangan, anak dan cucu, orang tua, kakek/nenek, saudara, dan ashabah jauh), setelah biaya jenazah, hutang, dan wasiat. Kasus yang sangat rumit tidak tercakup. Untuk kebutuhan resmi (notaris, pengadilan agama), tetap konsultasikan ke ahli faraidh/ulama.</p>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
  win.document.close();
  return true;
}
