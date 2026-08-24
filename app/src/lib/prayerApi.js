// Aladhan API — public, no key needed. method=20 is Kementerian Agama RI.
const METHOD = 20;

export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Perangkat ini tidak mendukung geolocation'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 15 * 60 * 1000 }
    );
  });
}

export async function fetchPrayerTimes(lat, lng, date = new Date()) {
  const timestamp = Math.floor(date.getTime() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${METHOD}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal memuat jadwal sholat');
  const json = await res.json();
  return json.data; // { timings: {...}, date: { hijri: {...}, gregorian: {...} } }
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const a = json.address || {};
    return a.city_district || a.suburb || a.city || a.town || a.county || json.display_name || null;
  } catch {
    return null;
  }
}
