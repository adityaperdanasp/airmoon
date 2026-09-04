// Ekspor Jadwal Sholat ke Kalender — a plain .ics file (no library, no
// server round-trip — the whole RFC 5545 format needed here is a handful
// of lines) importable into Google Calendar/Apple Calendar/Outlook.
// Floating local time (no Z suffix, no TZID block) — every calendar app
// interprets a bare DTSTART/DTEND as the device's own local timezone,
// which is exactly right here since these times were already computed
// for wherever the user's location resolved to.
function pad(n) {
  return String(n).padStart(2, '0');
}

function formatIcsDate(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function escapeIcsText(text) {
  return String(text).replace(/([,;])/g, '\\$1');
}

// `prayers` is [{ label, time: 'HH:MM' }, ...] for a single day — each
// becomes a 15-minute VEVENT block at that exact time (long enough to
// show up as a real calendar entry, short enough not to visually block
// out other plans).
export function buildPrayerTimesIcs(prayers, { locationLabel, date = new Date() } = {}) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//airmoon//Jadwal Sholat//ID', 'CALSCALE:GREGORIAN'];

  prayers.forEach((p, i) => {
    const [h, m] = p.time.split(':').map(Number);
    const start = new Date(date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + 15 * 60000);
    lines.push(
      'BEGIN:VEVENT',
      `UID:airmoon-${formatIcsDate(start)}-${i}@jalanmenujusurga.web.id`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeIcsText(`Sholat ${p.label}`)}`,
      locationLabel ? `LOCATION:${escapeIcsText(locationLabel)}` : null,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.filter(Boolean).join('\r\n');
}

export function downloadIcs(icsContent, filename) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
