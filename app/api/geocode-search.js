// Vercel serverless function — proxies Google's Geocoding API so
// GOOGLE_MAPS_API_KEY stays server-side, same pattern as
// api/nearby-mosques.js. Used by QiblaCompass's "Ganti Lokasi" search
// (type a place name, get its lat/lng) — not an interactive map picker,
// consistent with Cari Masjid staying deep-link-only rather than an
// embedded map (see CLAUDE.md's note on that being deliberately out of
// scope for now).

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

  const query = (req.query.q || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Parameter q (nama tempat) wajib diisi.' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
    const upstream = await fetch(url);
    const data = await upstream.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(502).json({ error: data.error_message || `Geocoding gagal: ${data.status}` });
    }

    const results = (data.results || []).slice(0, 6).map((r) => ({
      label: r.formatted_address,
      lat: r.geometry.location.lat,
      lng: r.geometry.location.lng,
    }));

    return res.status(200).json({ results });
  } catch {
    return res.status(502).json({ error: 'Gagal menghubungi Google Maps, coba lagi.' });
  }
}
