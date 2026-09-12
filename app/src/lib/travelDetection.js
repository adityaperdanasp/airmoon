// Deteksi Mode Traveling (2026-09-12) — usePrayerTimes.js/useQibla.js both
// let someone pin a manual location (see their own OVERRIDE_KEY constants)
// so a fixed jadwal/kiblat doesn't need a live GPS fix every time. The gap:
// nothing ever notices when that PINNED location stops matching where the
// phone actually is (e.g. pinned "Jakarta" before a trip, now physically in
// Surabaya) — jadwal/kiblat would just be silently wrong. This is a plain
// haversine distance check, no new tracking/storage of its own.
const EARTH_RADIUS_KM = 6371;
const FAR_THRESHOLD_KM = 50; // roughly "different city" — short in-city GPS drift shouldn't trigger this

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function distanceKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// Resolves to { traveled: false } if geolocation isn't available/denied —
// this is a nice-to-have nudge, never worth surfacing an error for.
export function checkTraveledFromOverride(override) {
  return new Promise((resolve) => {
    if (!override || typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({ traveled: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const km = distanceKm(override, current);
        resolve({ traveled: km >= FAR_THRESHOLD_KM, km: Math.round(km), current });
      },
      () => resolve({ traveled: false }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 15 * 60 * 1000 }
    );
  });
}
