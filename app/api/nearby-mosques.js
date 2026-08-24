// Vercel serverless function — proxies to Google Places API (New) so the
// GOOGLE_MAPS_API_KEY stays server-side. Requires that env var to be set in
// the Vercel project; without it this returns a clear error and nothing else.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY belum diset di Vercel project settings.' });
  }

  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Math.min(Number(req.query.radius) || 3000, 10000);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'lat/lng tidak valid.' });
  }

  try {
    const upstream = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.businessStatus,places.currentOpeningHours.openNow',
      },
      body: JSON.stringify({
        includedTypes: ['mosque'],
        maxResultCount: 20,
        locationRestriction: {
          circle: { center: { latitude: lat, longitude: lng }, radius },
        },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || 'Gagal memuat data masjid.' });
    }

    const places = (data.places || []).map((p) => ({
      id: p.id,
      name: p.displayName?.text || 'Masjid',
      address: p.formattedAddress || '',
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      rating: p.rating ?? null,
      ratingCount: p.userRatingCount ?? null,
      openNow: p.currentOpeningHours?.openNow ?? null,
      operational: p.businessStatus === 'OPERATIONAL',
    }));

    return res.status(200).json({ places });
  } catch {
    return res.status(502).json({ error: 'Gagal menghubungi Google Maps, coba lagi.' });
  }
}
