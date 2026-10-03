import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { watchPuasaSunnahLog, markPuasaSunnah, unmarkPuasaSunnah, todayDateKey } from '../lib/puasaSunnahLog';
import { fetchAmalanHarianForMonth, DAILY_POINTS_MAX } from '../lib/amalanHarian';
import { highestPuasaTier } from '../lib/badges';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { PAGE_PHOTOS } from '../data/photos';
import Confetti from '../components/Confetti';
import { hapticTick, hapticSuccess } from '../lib/haptics';
import PuasaSunnahShareModal from '../components/PuasaSunnahShareModal';
import { Skeleton } from '../components/Skeleton';

const MONTH_FMT = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
const DAY_FMT = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const LONG_DAY_FMT = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const CELEBRATED_KEY = 'airmoon-puasa-badge-celebrated-count';
// Minggu → Sabtu. Senin (1) and Kamis (4) are the weekly sunnah fasting days.
const WEEKDAY_LABELS = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
const SUNNAH_WEEKDAYS = [1, 4];
const HIJRI_MONTHS = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Every dated occasion this calendar knows about. `kind` decides how a
// day is drawn: sunnah = gold ring, larangan (fasting is forbidden that
// day) = red dashed ring, wajib = just a corner mark. `test(hijriMonth,
// hijriDay)` is the Hijri rule; `dalil` is the evidence shown under
// "Dalil" at the bottom of the page.
//
// Ayyamul Bidh skips 13 Dzulhijjah (a hari tasyriq, fasting is forbidden)
// and Ramadhan (the whole month is already obligatory). Puasa Syawal is
// the one flexible entry: any six days of 2-30 Syawal, because 1 Syawal
// is Eid itself.
const OCCASIONS = [
  { id: 'ramadhan', kind: 'wajib', icon: '🌙', label: 'Ramadhan (puasa wajib)', test: (m) => m === 9, dalil: "QS. Al-Baqarah: 183 dan 185 — puasa Ramadhan diwajibkan atas orang beriman." },
  { id: 'bidh', kind: 'sunnah', icon: '🌕', label: 'Ayyamul Bidh (13-15 Hijriah)', test: (m, d) => d >= 13 && d <= 15 && m !== 9 && !(m === 12 && d === 13), dalil: "Abu Dzar: Rasulullah ﷺ bersabda, \"Jika engkau berpuasa tiga hari dalam sebulan, berpuasalah pada tanggal 13, 14 dan 15.\" (HR. At-Tirmidzi no. 761, An-Nasa'i no. 2424; dinilai hasan oleh Al-Albani)" },
  { id: 'syawal', kind: 'sunnah', icon: '6️⃣', label: 'Puasa Syawal (bebas 6 hari, 2-30 Syawal)', test: (m, d) => m === 10 && d >= 2, dalil: "Abu Ayyub Al-Anshari: \"Barangsiapa berpuasa Ramadhan lalu mengikutinya dengan enam hari di bulan Syawal, maka seperti berpuasa setahun penuh.\" (HR. Muslim no. 1164)" },
  { id: 'arafah', kind: 'sunnah', icon: '🕋', label: 'Puasa Arafah (9 Dzulhijjah, bagi yang tidak berhaji)', test: (m, d) => m === 12 && d === 9, dalil: "Abu Qatadah: puasa hari Arafah, \"aku berharap kepada Allah agar menghapus dosa setahun sebelum dan setahun sesudahnya.\" (HR. Muslim no. 1162)" },
  { id: 'tasua', kind: 'sunnah', icon: '📿', label: "Puasa Tasu'a & Asyura (9-10 Muharram)", test: (m, d) => m === 1 && (d === 9 || d === 10), dalil: "Asyura menghapus dosa setahun sebelumnya (HR. Muslim no. 1162). Ibnu Abbas: Nabi ﷺ bersabda, \"Jika aku masih hidup tahun depan, aku pasti berpuasa tanggal sembilan (Tasu'a).\" (HR. Muslim no. 1134)" },
  { id: 'idulfitri', kind: 'larangan', icon: '✕', label: 'Idul Fitri — dilarang puasa', test: (m, d) => m === 10 && d === 1, dalil: "Abu Sa'id Al-Khudri: Rasulullah ﷺ melarang puasa pada hari Idul Fitri dan Idul Adha. (HR. Bukhari no. 1991, Muslim no. 827)" },
  { id: 'iduladha', kind: 'larangan', icon: '✕', label: 'Idul Adha — dilarang puasa', test: (m, d) => m === 12 && d === 10, dalil: "Abu Sa'id Al-Khudri: Rasulullah ﷺ melarang puasa pada hari Idul Fitri dan Idul Adha. (HR. Bukhari no. 1991, Muslim no. 827)" },
  { id: 'tasyriq', kind: 'larangan', icon: '✕', label: 'Hari Tasyriq (11-13 Dzulhijjah) — dilarang puasa', test: (m, d) => m === 12 && d >= 11 && d <= 13, dalil: "Nubaisyah Al-Hudzali: \"Hari-hari tasyriq adalah hari makan, minum dan berdzikir kepada Allah.\" (HR. Muslim no. 1141)" },
];
const WEEKDAY_DALIL = {
  label: 'Puasa Senin & Kamis',
  dalil: "Abu Hurairah: \"Amal-amal diperlihatkan pada hari Senin dan Kamis, dan aku suka amalku diperlihatkan saat aku berpuasa.\" (HR. At-Tirmidzi no. 747; dishahihkan Al-Albani). Tentang puasa Senin: \"Itulah hari aku dilahirkan dan hari wahyu diturunkan kepadaku.\" (HR. Muslim no. 1162)",
};

// Aladhan's `hijri-calendar` returns one row per Gregorian day in the
// month, each carrying that day's Hijri date — through the same
// /api/aladhan proxy KalenderHijriah.jsx used (api.aladhan.com's IPv6
// endpoint hangs on many Indonesian carriers, see CLAUDE.md). Cached by
// month so the hero ("today's Hijri date") and the grid never fetch the
// same month twice.
const hijriCache = new Map();
function loadHijriMonth(year, month) {
  const key = `${year}-${month}`;
  if (!hijriCache.has(key)) {
    const p = fetch(`https://airmoon.vercel.app/api/aladhan?type=hijri-calendar&month=${month}&year=${year}`)
      .then((r) => r.json())
      .then((json) => {
        const out = new Map();
        for (const d of json.data || []) {
          const hMonth = Number(d.hijri.month.number);
          out.set(Number(d.gregorian.day), {
            day: Number(d.hijri.day),
            month: hMonth,
            monthName: HIJRI_MONTHS[hMonth - 1] || d.hijri.month.en,
            year: Number(d.hijri.year),
          });
        }
        if (!out.size) throw new Error('empty');
        return out;
      })
      .catch((e) => {
        hijriCache.delete(key);
        throw e;
      });
    hijriCache.set(key, p);
  }
  return hijriCache.get(key);
}

// `days`: Map<gregorianDay, {day, month, monthName, year}> once loaded,
// null while loading, `failed` if the request errored (grid still renders
// without Hijri numbers rather than blocking on a secondary datum).
function useHijriMonth(viewMonth, retryTick = 0) {
  const [state, setState] = useState({ key: '', days: null, failed: false });
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth() + 1;
  const key = `${year}-${month}-${retryTick}`;

  useEffect(() => {
    let cancelled = false;
    loadHijriMonth(year, month)
      .then((days) => !cancelled && setState({ key, days, failed: false }))
      .catch(() => !cancelled && setState({ key, days: null, failed: true }));
    return () => {
      cancelled = true;
    };
  }, [year, month, key]);

  // A result from a different month than the one on screen is stale.
  return state.key === key ? state : { key, days: null, failed: false };
}

function occasionsFor(hijri) {
  if (!hijri) return [];
  return OCCASIONS.filter((o) => o.test(hijri.month, hijri.day));
}

// "Warna ibadah": same continuous-opacity scale AmalanHeatmap uses, but
// painted on its own layer so the day number on top stays crisp.
function scoreOpacity(score, max) {
  return 0.3 + 0.7 * (score / max);
}

function PuasaCalendar({ dateSet, amalan, viewMonth, hijriDays, selected, onSelect, onPrevMonth, onNextMonth, today }) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  // "Rabiul Awal – Rabiul Akhir 1448 H" for the month on screen.
  let hijriRange = null;
  if (hijriDays) {
    const first = hijriDays.get(1);
    const last = hijriDays.get(daysInMonth);
    if (first && last) {
      hijriRange = first.month === last.month
        ? `${first.monthName} ${first.year} H`
        : first.year === last.year
          ? `${first.monthName} – ${last.monthName} ${last.year} H`
          : `${first.monthName} ${first.year} – ${last.monthName} ${last.year} H`;
    }
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onPrevMonth} aria-label="Bulan sebelumnya" style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 6, fontSize: 15 }}>
          ←
        </button>
        <div style={{ textAlign: 'center', lineHeight: 1.25 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>{MONTH_FMT.format(viewMonth)}</div>
          <div style={{ fontSize: 10.5, color: 'var(--gold-ink)', fontWeight: 700, minHeight: 13 }}>{hijriRange}</div>
        </div>
        <button onClick={onNextMonth} aria-label="Bulan berikutnya" style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 6, fontSize: 15 }}>
          →
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {WEEKDAY_LABELS.map((w, i) => (
          <span
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 9.5,
              fontWeight: 800,
              color: SUNNAH_WEEKDAYS.includes(i) ? 'var(--gold-ink)' : 'var(--muted)',
            }}
          >
            {w}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const key = `${year}-${pad2(month + 1)}-${pad2(day)}`;
          const hijri = hijriDays?.get(day);
          const occ = occasionsFor(hijri);
          const sunnah = occ.filter((o) => o.kind === 'sunnah');
          const isLarangan = occ.some((o) => o.kind === 'larangan');
          const isWajib = occ.some((o) => o.kind === 'wajib');
          const isMarked = dateSet.has(key);
          const isToday = key === today;
          const isSelected = key === selected;
          const entry = amalan?.get(key);
          const dark = entry && entry.score / entry.max > 0.55;
          const ring = isLarangan
            ? '1.5px dashed var(--danger)'
            : sunnah.length
              ? '1.5px solid var(--gold-ink)'
              : '1.5px solid transparent';
          return (
            <button
              key={i}
              onClick={() => onSelect(key)}
              aria-label={`${day} ${MONTH_FMT.format(viewMonth)}${hijri ? `, ${hijri.day} ${hijri.monthName} ${hijri.year} H` : ''}${isMarked ? ', puasa tercatat' : ''}`}
              aria-pressed={isSelected}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 9,
                border: ring,
                background: entry ? 'transparent' : 'var(--card)',
                outline: 'none',
                boxShadow: isSelected ? '0 0 0 2px var(--primary)' : isToday ? '0 0 0 1.5px var(--primary)' : 'none',
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                color: dark ? 'var(--on-primary)' : 'var(--ink)',
                transition: 'box-shadow var(--dur-1) var(--ease)',
              }}
            >
              {entry && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: entry.score === 0 ? 'var(--border)' : 'var(--primary)',
                    opacity: entry.score === 0 ? 0.7 : scoreOpacity(entry.score, entry.max),
                  }}
                />
              )}
              <span style={{ position: 'relative', fontSize: 11.5, fontWeight: 800, lineHeight: 1 }}>{day}</span>
              <span style={{ position: 'relative', fontSize: 7.5, fontWeight: 600, lineHeight: 1, opacity: 0.8, minHeight: 8 }}>
                {hijri ? hijri.day : ''}
              </span>
              {(sunnah.length > 0 || isLarangan || isWajib) && (
                <span aria-hidden="true" style={{ position: 'absolute', top: 1, right: 2, fontSize: 6.5, lineHeight: 1, display: 'flex', color: isLarangan ? 'var(--danger)' : undefined }}>
                  {(sunnah.length ? sunnah : occ).map((o) => (
                    <span key={o.id}>{o.icon}</span>
                  ))}
                </span>
              )}
              {isMarked && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: 'var(--gold-ink)',
                    color: 'var(--on-gold)',
                    border: '1px solid var(--card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 7,
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <Legend />
    </div>
  );
}

function Legend() {
  const swatch = { width: 12, height: 12, borderRadius: 4, flexShrink: 0 };
  const row = { display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, color: 'var(--muted)', lineHeight: 1.35 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
      <div style={row}>
        <span style={{ display: 'flex', gap: 2 }}>
          {[0.3, 0.55, 0.8, 1].map((o) => (
            <span key={o} style={{ ...swatch, width: 9, background: 'var(--primary)', opacity: o }} />
          ))}
        </span>
        <span>Warna ibadah — poin Amalan Harian (sholat, tilawah, dzikir, login; maks {DAILY_POINTS_MAX}). Makin pekat, makin banyak.</span>
      </div>
      <div style={row}>
        <span style={{ ...swatch, width: 12, borderRadius: '50%', background: 'var(--gold-ink)', color: 'var(--on-gold)', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
        <span>Kamu puasa sunnah hari itu</span>
      </div>
      <div style={row}>
        <span style={{ ...swatch, border: '1.5px solid var(--gold-ink)' }} />
        <span>Hari puasa sunnah: Ayyamul Bidh 🌕, Syawal 6️⃣, Arafah 🕋, Tasu'a &amp; Asyura 📿. Senin &amp; Kamis ditandai pada huruf harinya.</span>
      </div>
      <div style={row}>
        <span style={{ ...swatch, border: '1.5px dashed var(--danger)' }} />
        <span>Dilarang puasa: Idul Fitri, Idul Adha, dan hari Tasyriq</span>
      </div>
    </div>
  );
}

function DayDetail({ dateKey, hijri, entry, isMarked, isToday, isFuture }) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const occ = occasionsFor(hijri);
  const isSunnahWeekday = SUNNAH_WEEKDAYS.includes(date.getDay());
  const larangan = occ.find((o) => o.kind === 'larangan');
  const label = { fontSize: 10.5, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800 }}>{LONG_DAY_FMT.format(date)}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-ink)', marginTop: 2, minHeight: 16 }}>
          {hijri ? `${hijri.day} ${hijri.monthName} ${hijri.year} H` : ''}
        </div>
      </div>

      {larangan && (
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--danger)' }}>{larangan.label}</div>
      )}
      {!larangan && (isSunnahWeekday || occ.some((o) => o.kind !== 'larangan')) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={label}>Puasa</span>
          {isSunnahWeekday && <span style={{ fontSize: 12 }}>{date.getDay() === 1 ? 'Senin' : 'Kamis'} — hari sunnah berpuasa</span>}
          {occ.map((o) => (
            <span key={o.id} style={{ fontSize: 12 }}>{o.icon} {o.label}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={label}>Catatan ibadah</span>
        <span style={{ fontSize: 12 }}>
          {isMarked ? '✓ Puasa sunnah tercatat' : isToday ? 'Puasa belum kamu catat hari ini' : isFuture ? 'Belum terjadi' : 'Tidak ada catatan puasa'}
        </span>
        {!isFuture && (
          <span style={{ fontSize: 12 }}>
            {entry ? `Poin Amalan Harian: ${entry.score} dari ${entry.max}` : 'Poin Amalan Harian: memuat…'}
          </span>
        )}
      </div>
    </div>
  );
}

function DalilCard() {
  const [open, setOpen] = useState(false);
  const items = [
    WEEKDAY_DALIL,
    ...OCCASIONS.filter((o) => o.id !== 'iduladha'),
  ].map((o) => (o.id === 'idulfitri' ? { ...o, label: 'Idul Fitri & Idul Adha — dilarang puasa' } : o));
  return (
    <div className="card" style={{ padding: 0 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 13, fontWeight: 800, fontFamily: 'inherit' }}
      >
        <span>Dalil &amp; Keterangan</span>
        <span aria-hidden="true" style={{ color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-2) var(--ease)' }}>⌄</span>
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px 16px' }}>
          {items.map((o) => (
            <div key={o.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 800 }}>{o.label}</span>
              <span style={{ fontSize: 11.5, lineHeight: 1.55, color: 'var(--muted)' }}>{o.dalil}</span>
            </div>
          ))}
          <span style={{ fontSize: 10.5, lineHeight: 1.55, color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
            Tanggal Hijriah di sini dihitung secara hisab (Aladhan), jadi bisa selisih satu hari dengan penetapan pemerintah atau rukyat setempat. Untuk Ramadhan, Idul Fitri dan Idul Adha, ikuti pengumuman resmi di daerahmu. Nomor hadits mengikuti penomoran yang umum dipakai; bila ada perbedaan cetakan, rujuk kitabnya.
          </span>
        </div>
      )}
    </div>
  );
}

// Kalender Puasa Sunnah — the one calendar in the app. It used to be
// three pages (Puasa Sunnah, Kalender Ibadah, Kalender Hijriah) that each
// showed a slice of the same month; now every day shows its Gregorian and
// Hijri date, the warna ibadah (Amalan Harian score), whether you fasted,
// and which sunnah (or forbidden) fasting day it is. Only TODAY can be
// logged — past days are a record, not something to edit retroactively.
export default function PuasaSunnah() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [dates, setDates] = useState(null);
  const [marking, setMarking] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const [amalan, setAmalan] = useState(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const today = todayDateKey();
  const [selected, setSelected] = useState(today);
  const isMarkedToday = dates?.includes(today);
  const totalCount = dates?.length || 0;
  const badgeTier = highestPuasaTier(totalCount);

  const hijri = useHijriMonth(viewMonth, retryTick);
  const nowMonth = new Date();
  const hijriNow = useHijriMonth(new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1));
  const hijriToday = hijriNow.days?.get(nowMonth.getDate());

  useEffect(() => watchPuasaSunnahLog(user?.uid, setDates), [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return undefined;
    let cancelled = false;
    setAmalan(null);
    fetchAmalanHarianForMonth(user.uid, viewMonth.getFullYear(), viewMonth.getMonth())
      .then((rows) => !cancelled && setAmalan(new Map(rows.map((r) => [r.dateKey, r]))))
      .catch(() => !cancelled && setAmalan(new Map()));
    return () => {
      cancelled = true;
    };
  }, [user?.uid, viewMonth]);

  // Celebrates the moment a NEW milestone is actually reached, not every
  // time this page happens to render with an already-earned tier —
  // same localStorage-tracked-highest-celebrated pattern as
  // AmalanHarianCard.jsx's own dzikir-badge celebration.
  useEffect(() => {
    if (!badgeTier) return;
    const lastCelebrated = Number(localStorage.getItem(CELEBRATED_KEY)) || 0;
    if (badgeTier.count > lastCelebrated) {
      localStorage.setItem(CELEBRATED_KEY, String(badgeTier.count));
      hapticSuccess();
      setShowConfetti(true);
    }
  }, [badgeTier]);

  async function handleToggleToday() {
    if (!user) return;
    hapticTick();
    setMarking(true);
    try {
      if (isMarkedToday) {
        await unmarkPuasaSunnah(user.uid, today);
      } else {
        await markPuasaSunnah(user.uid, today);
        showToast('Alhamdulillah, tercatat 🌙');
      }
    } finally {
      setMarking(false);
    }
  }

  const thisMonthPrefix = today.slice(0, 7);
  const thisMonthCount = dates?.filter((d) => d.startsWith(thisMonthPrefix)).length || 0;

  const viewPrefix = `${viewMonth.getFullYear()}-${pad2(viewMonth.getMonth() + 1)}`;
  const shownKey = selected && selected.startsWith(viewPrefix) ? selected : today.startsWith(viewPrefix) ? today : null;
  const shownHijri = shownKey ? hijri.days?.get(Number(shownKey.slice(8))) : null;

  return (
    <div className="screen">
      <div className="screen-content">
        <PageHeaderPhoto
          title="Kalender Puasa Sunnah"
          photo={PAGE_PHOTOS.kalenderHijriah}
          subtitle="Tanggal Hijriah, warna ibadah & puasa sunnah"
          right={
            dates !== null && (
              <button className="icon-btn" onClick={() => setShowShareModal(true)} aria-label="Bagikan progress" title="Bagikan progress">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="5" r="3" strokeWidth="1.6" /><circle cx="6" cy="12" r="3" strokeWidth="1.6" /><circle cx="18" cy="19" r="3" strokeWidth="1.6" />
                  <path d="M8.6 10.5 15.4 6.5M8.6 13.5 15.4 17.5" strokeWidth="1.6" />
                </svg>
              </button>
            )
          }
        />

        <div style={{ borderRadius: 20, padding: 22, textAlign: 'center', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            {DAY_FMT.format(new Date())}
          </span>
          <div style={{ marginTop: 3, fontSize: 13, fontWeight: 700, color: '#fff', minHeight: 18 }}>
            {hijriToday ? `${hijriToday.day} ${hijriToday.monthName} ${hijriToday.year} H` : ''}
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              className="btn"
              onClick={handleToggleToday}
              disabled={!user || marking}
              style={{
                background: isMarkedToday ? 'var(--on-primary)' : '#fff',
                color: 'var(--primary-dark)',
                padding: '11px 24px',
                width: 'auto',
                opacity: marking ? 0.7 : 1,
              }}
            >
              {marking ? (
                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'var(--primary-dark)' }} />
              ) : isMarkedToday ? (
                '✓ Puasa Hari Ini Tercatat'
              ) : (
                'Tandai Puasa Hari Ini'
              )}
            </button>
          </div>
          {!user && <span style={{ display: 'block', marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Masuk dulu buat mulai mencatat.</span>}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{thisMonthCount}</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)', textAlign: 'center' }}>Kali Bulan {MONTH_FMT.format(new Date())}</span>
          </div>
          <div className="card" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: 16, alignItems: 'center' }}>
            {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold-ink)' }}>{totalCount}</span>
            <span style={{ fontSize: 10.5, color: 'var(--muted)', textAlign: 'center' }}>Total Sepanjang Waktu</span>
            {badgeTier && (
              <span style={{ marginTop: 2, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, color: 'var(--primary)', background: 'var(--mint)' }}>
                {badgeTier.icon} {badgeTier.label}
              </span>
            )}
          </div>
        </div>

        {dates === null && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16 }}>
            <Skeleton width={120} height={16} style={{ alignSelf: 'center' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} radius={9} style={{ aspectRatio: '1', height: 'auto' }} />
              ))}
            </div>
          </div>
        )}

        {dates && (
          <>
            <PuasaCalendar
              dateSet={new Set(dates)}
              amalan={amalan}
              viewMonth={viewMonth}
              hijriDays={hijri.days}
              selected={shownKey}
              onSelect={setSelected}
              onPrevMonth={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              onNextMonth={() => setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              today={today}
            />
            {hijri.failed && (
              <button
                className="btn-outline"
                style={{ width: 'auto', alignSelf: 'center', padding: '8px 16px', fontSize: 12 }}
                onClick={() => setRetryTick((n) => n + 1)}
              >
                Tanggal Hijriah belum termuat — Coba Lagi
              </button>
            )}
            {shownKey ? (
              <DayDetail
                dateKey={shownKey}
                hijri={shownHijri}
                entry={amalan?.get(shownKey)}
                isMarked={dates.includes(shownKey)}
                isToday={shownKey === today}
                isFuture={shownKey > today}
              />
            ) : (
              <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)' }}>Ketuk tanggal untuk melihat detailnya.</div>
            )}
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 14px', borderRadius: 14, background: 'var(--card)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" strokeWidth="1.6" /><path d="M12 11v5.5M12 8v.01" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--muted)' }}>
            Pencatatan puasa manual — tandai sendiri tiap kali kamu berpuasa sunnah. Kamu bakal diingatkan lewat notifikasi, tapi yang mencatat tetap kamu. Warna sel diambil otomatis dari Amalan Harian.
          </span>
        </div>

        <DalilCard />
      </div>

      {showShareModal && (
        <PuasaSunnahShareModal
          totalCount={totalCount}
          thisMonthCount={thisMonthCount}
          monthLabel={MONTH_FMT.format(new Date())}
          badgeLabel={badgeTier ? `${badgeTier.icon} ${badgeTier.label}` : ''}
          theme={theme}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
