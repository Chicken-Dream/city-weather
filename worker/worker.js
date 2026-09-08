const DEFAULT_STATION = 'CYEG';
const STATION_RE = /^[A-Za-z0-9]{2,6}$/;
const BBOX_RE = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

async function proxyJson(apiUrl) {
  const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function errorJson(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/metar') {
      let station = url.searchParams.get('ids') || DEFAULT_STATION;
      if (!STATION_RE.test(station)) station = DEFAULT_STATION;
      const apiUrl = `https://aviationweather.gov/api/data/metar?ids=${station}&format=json&hours=24`;
      try {
        return await proxyJson(apiUrl);
      } catch (e) {
        return errorJson(502, e.message);
      }
    }

    if (url.pathname === '/api/stations') {
      const bbox = url.searchParams.get('bbox') || '';
      if (!BBOX_RE.test(bbox)) return errorJson(400, 'invalid bbox');
      const apiUrl = `https://aviationweather.gov/api/data/metar?bbox=${bbox}&format=json`;
      try {
        return await proxyJson(apiUrl);
      } catch (e) {
        return errorJson(502, e.message);
      }
    }

    return errorJson(404, 'not found');
  },
};
