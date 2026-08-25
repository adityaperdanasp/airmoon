// Vercel serverless function — proxies Aladhan API requests instead of
// calling api.aladhan.com directly from the browser. Aladhan's IPv6 endpoint
// is broken (times out on every attempt; IPv4 works fine — verified with
// curl -6 vs -4), so any client on a network that prefers IPv6 (common on
// Indonesian mobile carriers) gets a hard failure calling it directly. This
// runs server-side on Vercel's network instead, sidestepping the client's
// own IPv6 path entirely. No API key needed — Aladhan is a free public API.

const METHOD = 20; // Kementerian Agama RI

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { type } = req.query;

  let upstreamUrl;
  if (type === 'timings') {
    const timestamp = Number(req.query.timestamp);
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(timestamp) || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'timestamp/lat/lng tidak valid.' });
    }
    upstreamUrl = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${METHOD}`;
  } else if (type === 'hijri-calendar') {
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year)) {
      return res.status(400).json({ error: 'month/year tidak valid.' });
    }
    upstreamUrl = `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`;
  } else {
    return res.status(400).json({ error: 'type harus "timings" atau "hijri-calendar".' });
  }

  try {
    const upstream = await fetch(upstreamUrl);
    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.data || 'Gagal menghubungi Aladhan API.' });
    }
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Gagal menghubungi Aladhan API, coba lagi.' });
  }
}
