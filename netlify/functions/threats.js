// In-memory cache — persists for the lifetime of the function instance
// AbuseIPDB free tier: 1,000 requests/day. We cache for 1 hour = max 24 hits/day.
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms

exports.handler = async function(event) {
  const API_KEY = process.env.ABUSEIPDB_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  // Serve from cache if fresh
  const now = Date.now();
  if (cache && (now - cacheTime) < CACHE_TTL) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
        'X-Cache-Age': Math.round((now - cacheTime) / 1000) + 's',
      },
      body: JSON.stringify(cache),
    };
  }

  // Fetch fresh data
  try {
    const url = 'https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=75&limit=100&plaintext=false';
    const resp = await fetch(url, {
      headers: {
        'Key': API_KEY,
        'Accept': 'application/json',
      }
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: text }) };
    }

    const data = await resp.json();

    // Store in cache
    cache = data;
    cacheTime = now;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=3600',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
