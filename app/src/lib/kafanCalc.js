// Kalkulator Kebutuhan Kain Kafan — estimasi praktis (bukan ketentuan
// fiqh yang baku, jumlah lapis sudah ketentuan fiqh tapi panjang kain
// persisnya memang disesuaikan kondisi), supaya gak kurang/lebih pas
// beli kain mendadak. Lebar kain kafan yang dijual di pasaran umumnya
// sudah cukup (~110-120cm) buat membungkus badan tanpa disambung, jadi
// yang dihitung di sini cuma panjangnya.
const TAMBAHAN_IKATAN_CM = 60; // ruang lebih di kedua ujung buat dilipat & diikat
const LAPIS = { pria: 3, wanita: 5 };

export function calcKebutuhanKafan({ tinggiCm, gender }) {
  const tinggi = Number(tinggiCm) || 0;
  const panjangPerLapisM = (tinggi + TAMBAHAN_IKATAN_CM) / 100;
  const jumlahLapis = LAPIS[gender] || LAPIS.pria;
  const totalMeter = panjangPerLapisM * jumlahLapis;
  // Dibulatkan ke atas per 0.5m — toko kain biasanya jual per setengah
  // meter, dan lebih baik kelebihan sedikit daripada kurang.
  const totalMeterDibulatkan = Math.ceil(totalMeter * 2) / 2;
  return { panjangPerLapisM, jumlahLapis, totalMeter, totalMeterDibulatkan };
}
