// Tautan yang dibagikan harus membuka isi yang sama di aplikasi (ayat, doa,
// fitur), bukan sekadar beranda. Memakai domain publik yang tampil ke
// orang (bukan alamat hosting internal).
export const PUBLIC_ORIGIN = 'https://jalanmenujusurga.web.id';
export function appLink(path = '/') {
  return `${PUBLIC_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
