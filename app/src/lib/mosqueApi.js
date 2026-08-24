// OpenStreetMap Overpass API — free, public, no key needed. Real (if
// incomplete) mosque data: coverage depends on what's been mapped in OSM
// for a given area, but nothing here is fabricated.
export async function fetchNearbyMosques(lat, lng, radiusM = 3000) {
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

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
