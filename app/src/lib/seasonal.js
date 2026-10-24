// Momen spesial yang diberi sentuhan khusus di hero Home. Murni dari tanggal
// Hijriah (dari Aladhan lewat usePrayerTimes) dan hari dalam pekan, tanpa
// perayaan yang tidak ada tuntunannya (tidak ada Maulid, tahun baru, dsb).
//   Ramadhan, Idul Fitri, Idul Adha, Hari Arafah, Asyura, Hari Jumat.
export function getSeason(hijri, date = new Date()) {
  const month = Number(hijri?.month?.number);
  const day = Number(hijri?.day);
  if (month === 9) return { id: 'ramadhan', label: `Ramadhan · hari ke-${day}` };
  if (month === 10 && day === 1) return { id: 'idulfitri', label: 'Idul Fitri · Taqabbalallahu minna wa minkum' };
  if (month === 12 && day === 10) return { id: 'iduladha', label: 'Idul Adha · Taqabbalallahu minna wa minkum' };
  if (month === 12 && day === 9) return { id: 'arafah', label: 'Hari Arafah · puasa bagi yang tidak berhaji' };
  if (month === 1 && day === 10) return { id: 'asyura', label: 'Hari Asyura · 10 Muharram' };
  if (date.getDay() === 5) return { id: 'jumat', label: 'Hari Jumat · sebaik-baik hari' };
  // Ayyamul Bidh (13-15 tiap bulan Hijriah, kecuali Ramadhan dan 13 Dzulhijjah/Tasyriq)
  if (day >= 13 && day <= 15 && month !== 9 && !(month === 12 && day === 13)) return { id: 'sunnah', label: 'Ayyamul Bidh · hari ini puasa sunnah' };
  if (date.getDay() === 1) return { id: 'sunnah', label: 'Senin · hari puasa sunnah' };
  if (date.getDay() === 4) return { id: 'sunnah', label: 'Kamis · hari puasa sunnah, besok Jumat' };
  return null;
}
