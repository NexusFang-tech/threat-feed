// AbuseIPDB /check endpoint — looks up a single IP's abuse history
// Cached per-IP for 1 hour to preserve daily quota
const cache = {};
const CACHE_TTL = 60 * 60 * 1000;

exports.handler = async function(event) {
  const API_KEY = process.env.ABUSEIPDB_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const ip = event.queryStringParameters?.ip;
  if (!ip) {
    return { statusCode: 400, body: JSON.stringify({ error: 'ip parameter required' }) };
  }

  // Validate IP format
  const v4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const v6 = /^[0-9a-fA-F:]+$/;
  if (!v4.test(ip) && !v6.test(ip)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid IP format' }) };
  }

  // Serve from cache if fresh
  const now = Date.now();
  if (cache[ip] && (now - cache[ip].time) < CACHE_TTL) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Cache': 'HIT',
      },
      body: JSON.stringify(cache[ip].data),
    };
  }

  try {
    const url = `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`;
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
    cache[ip] = { data, time: now };

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
