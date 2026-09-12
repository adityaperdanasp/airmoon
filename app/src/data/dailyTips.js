// Tips Islami Harian (2026-09-12) — one tip per day per interest tag, so
// Home.jsx can show something that actually matches why someone opened
// the app (see lib/interestTag.js), not the same generic quote for
// everyone. Deterministic by day-of-year so every user sees the same
// tip on the same day and it doesn't reshuffle on every reload.

const TIPS = {
  quran: [
    'Baca satu halaman Al-Quran tiap abis sholat wajib — 5x sehari, sebulan udah khatam beberapa juz tanpa kerasa capek.',
    "Kalau lagi gak sempet baca, dengerin murottal aja pas di jalan. Tetep dapet pahala mendengarkan, dan kupingnya jadi hafal iramanya.",
    'Pilih satu ayat yang paling nempel di hati hari ini, tulis di catatan HP. Baca ulang pas lagi capek atau butuh pengingat.',
    'Belajar tajwid gak harus formal — cukup perhatiin bacaan qori favorit, dengerin di mana dia berhenti dan napas.',
    "Coba baca terjemahan surat yang udah hafal dari kecil. Sering kali artinya baru kerasa dalem setelah bertahun-tahun.",
  ],
  sholat: [
    'Datang 5 menit lebih awal buat sholat berjamaah — waktu itu biasanya kepake buat dzikir atau doa yang keburu kelewat.',
    'Coba sholat sunnah rawatib 2 rakaat sebelum Subuh — Rasulullah SAW bilang itu lebih baik dari dunia seisinya.',
    "Kalau susah khusyuk, coba pelan-pelan pas takbiratul ihram — rasain betul kalimat Allahu Akbar sebelum lanjut gerakan.",
    'Istighfar 3x abis salam itu ringan tapi sering kelewat — coba jadiin kebiasaan mulai hari ini.',
    'Dzikir pagi-petang 5 menit doang, tapi efeknya kerasa buat jaga hati sepanjang hari.',
  ],
  donasi: [
    'Sedekah gak harus nunggu banyak — subuh ini coba sisihkan recehan buat kotak amal masjid terdekat.',
    'Sedekah yang paling berat timbangannya itu yang dikasih pas kita juga lagi butuh, bukan cuma pas lagi lapang.',
    "Doain orang yang udah dibantu itu sedekah juga — gak keluar uang tapi pahalanya jalan terus.",
    'Coba cari 1 campaign di Donasi yang deket sama domisili kamu — dampaknya lebih kerasa langsung ke lingkungan sendiri.',
    "Sedekah jariyah (yang manfaatnya jalan terus) itu investasi akhirat — coba mulai dari yang kecil dulu, contoh wakaf Al-Quran.",
  ],
  semua: [
    'Muhasabah 2 menit sebelum tidur — apa yang udah disyukuri hari ini?',
    'Senyum ke orang di jalan itu sedekah paling murah yang sering dilupain.',
    'Coba amalan kecil yang konsisten tiap hari — itu lebih dicintai Allah daripada amalan besar yang cuma sesekali.',
    'Silaturahmi lewat chat singkat ke keluarga/teman lama itu tetep dapet keutamaan silaturahmi.',
    'Istighfar itu solusi buat hampir semua kegundahan — coba ulang-ulang pas lagi capek atau bingung.',
  ],
};

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

export function getDailyTip(interestTag) {
  const pool = TIPS[interestTag] || TIPS.semua;
  const idx = dayOfYear(new Date()) % pool.length;
  return pool[idx];
}
