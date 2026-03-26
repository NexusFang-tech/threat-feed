exports.handler = async function(event) {
  const API_KEY = process.env.ABUSEIPDB_KEY;
  const limit   = event.queryStringParameters?.limit || 50;

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  try {
    const url = `https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=75&limit=${limit}&plaintext=false`;
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
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
