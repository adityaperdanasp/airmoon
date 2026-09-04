// Primary source: Google Places API (New) via the Vercel serverless proxy
// (api/nearby-mosques.js) — real ratings, real names, much better coverage
// for Indonesia than OSM. Requires GOOGLE_MAPS_API_KEY set in Vercel; falls
// back to OpenStreetMap Overpass (free, no key, but sparser data) if that
// isn't configured yet or the request fails.
const NEARBY_ENDPOINT = 'https://airmoon.vercel.app/api/nearby-mosques';

async function fetchFromGoogleMaps(lat, lng, radiusM) {
  const res = await fetch(`${NEARBY_ENDPOINT}?lat=${lat}&lng=${lng}&radius=${radiusM}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal memuat data masjid dari Google Maps');
  return data.places
    // The backend already fetches `businessStatus` for this — a
    // permanently/temporarily closed listing showing up in "masjid
    // terdekat" results is worse than just leaving it out, since the
    // whole point of this list is somewhere to actually go pray.
    .filter((p) => p.operational !== false)
    .map((p) => ({
      id: p.id,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
      address: p.address,
      rating: p.rating,
      ratingCount: p.ratingCount,
      openNow: p.openNow,
    }));
}

async function fetchFromOverpass(lat, lng, radiusM) {
  const query = `[out:json][timeout:15];
    node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusM},${lat},${lng});
    out body 25;`;
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });
  if (!res.ok) throw new Error('Gagal memuat data masjid');
  const json = await res.json();
  return json.elements
    .filter((el) => el.tags?.name)
    .map((el) => ({
      id: el.id,
      name: el.tags.name,
      lat: el.lat,
      lng: el.lon,
      address: [el.tags['addr:street'], el.tags['addr:city']].filter(Boolean).join(', '),
    }));
}

export async function fetchNearbyMosques(lat, lng, radiusM = 3000) {
  try {
    const places = await fetchFromGoogleMaps(lat, lng, radiusM);
    return { places, source: 'google' };
  } catch {
    const places = await fetchFromOverpass(lat, lng, radiusM);
    return { places, source: 'osm' };
  }
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
