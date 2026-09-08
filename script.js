const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const CITY_STORAGE_KEY = 'metar-app-city-v1';

const DEFAULT_CITY = {
  name: 'Koror',
  admin1: '',
  country: 'Palau',
  lat: 7.3397,
  lon: 134.4733,
  timezone: 'Pacific/Palau',
  icaoId: 'PTRO',
  stationName: 'Palau Intl',
};

function loadCity() {
  try {
    const raw = localStorage.getItem(CITY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.icaoId && parsed.lat != null && parsed.lon != null) return parsed;
    }
  } catch (e) {
    console.error('Failed to load stored city', e);
  }
  return { ...DEFAULT_CITY };
}

let currentCity = loadCity();

function saveCity(city) {
  currentCity = city;
  try {
    localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
  } catch (e) {
    console.error('Failed to save city', e);
  }
}

const FAVORITES_STORAGE_KEY = 'metar-app-favorites-v1';

const DEFAULT_FAVORITES = [
  { name: 'Agra', admin1: 'Uttar Pradesh', country: 'India', lat: 27.18333, lon: 78.01667, timezone: 'Asia/Kolkata', icaoId: 'VIAG', stationName: 'Agra Intl, UP, IN' },
  { name: 'Amsterdam', admin1: 'North Holland', country: 'The Netherlands', lat: 52.37403, lon: 4.88969, timezone: 'Europe/Amsterdam', icaoId: 'EHAM', stationName: 'Amsterdam/Schiphol Arpt, NH, NL' },
  { name: 'Bangkok', admin1: 'Bangkok', country: 'Thailand', lat: 13.75398, lon: 100.50144, timezone: 'Asia/Bangkok', icaoId: 'VTBD', stationName: 'Bangkok Intl, 10, TH' },
  { name: 'Cairo', admin1: 'Cairo Governorate', country: 'Egypt', lat: 30.06263, lon: 31.24967, timezone: 'Africa/Cairo', icaoId: 'HECA', stationName: 'Cairo Intl, QH, EG' },
  { name: 'Calgary', admin1: 'Alberta', country: 'Canada', lat: 51.05011, lon: -114.08529, timezone: 'America/Edmonton', icaoId: 'CYYC', stationName: 'Calgary Intl, AB, CA' },
  { name: 'Cao Bang', admin1: 'Cao Bằng Province', country: 'Vietnam', lat: 22.66568, lon: 106.25786, timezone: 'Asia/Bangkok', icaoId: 'VVNB', stationName: 'Hanoi/Noi Bai Intl, HI, VN' },
  { name: 'Cusco', admin1: 'Cuzco Department', country: 'Peru', lat: -13.53188, lon: -71.96701, timezone: 'America/Lima', icaoId: 'SPZO', stationName: 'Cuzco/Astete Arpt, CU, PE' },
  { name: 'Edmonton', admin1: 'Alberta', country: 'Canada', lat: 53.55014, lon: -113.46871, timezone: 'America/Edmonton', icaoId: 'CXEC', stationName: 'Edmonton Muni, AB, CA' },
  { name: 'Hanoi', admin1: 'Hanoi', country: 'Vietnam', lat: 21.0245, lon: 105.84117, timezone: 'Asia/Bangkok', icaoId: 'VVNB', stationName: 'Hanoi/Noi Bai Intl, HI, VN' },
  { name: 'Hong Kong', admin1: '', country: 'Hong Kong', lat: 22.27832, lon: 114.17469, timezone: 'Asia/Hong_Kong', icaoId: 'VHHH', stationName: 'Hong Kong Intl, HK, HK' },
  { name: 'Koror', admin1: 'Koror', country: 'Palau', lat: 7.33978, lon: 134.47327, timezone: 'Pacific/Palau', icaoId: 'PTRO', stationName: 'Palau/Tmetochl Intl, KO, PW' },
  { name: 'Lagos', admin1: 'Lagos', country: 'Nigeria', lat: 6.45407, lon: 3.39467, timezone: 'Africa/Lagos', icaoId: 'DNMM', stationName: 'Lagos/Muhammed Intl, LA, NG' },
  { name: 'London', admin1: 'England', country: 'United Kingdom', lat: 51.50853, lon: -0.12574, timezone: 'Europe/London', icaoId: 'EGLC', stationName: 'London City Arpt, EN, GB' },
  { name: "Ma'an", admin1: "Ma'an Governorate", country: 'Jordan', lat: 30.19624, lon: 35.73405, timezone: 'Asia/Amman', icaoId: 'LLER', stationName: 'Eilat/Ramone Arpt, S, IL' },
  { name: 'Manchester', admin1: 'England', country: 'United Kingdom', lat: 53.48095, lon: -2.23743, timezone: 'Europe/London', icaoId: 'EGCC', stationName: 'Manchester Intl, EN, GB' },
  { name: 'Mérida', admin1: 'Yucatán', country: 'Mexico', lat: 20.967, lon: -89.62318, timezone: 'America/Merida', icaoId: 'MMMD', stationName: 'Mérida Intl, YU, MX' },
  { name: 'New York', admin1: 'New York', country: 'United States', lat: 40.71427, lon: -74.00597, timezone: 'America/New_York', icaoId: 'KLGA', stationName: 'New York/La Guardia Arpt, NY, US' },
  { name: 'Ottawa', admin1: 'Ontario', country: 'Canada', lat: 45.41117, lon: -75.69812, timezone: 'America/Toronto', icaoId: 'CYOW', stationName: 'Ottawa/Cartier Intl, ON, CA' },
  { name: 'Paris', admin1: 'Île-de-France Region', country: 'France', lat: 48.85341, lon: 2.3488, timezone: 'Europe/Paris', icaoId: 'LFPB', stationName: 'Paris/Le Bourge Arpt, ID, FR' },
  { name: 'Rio de Janeiro', admin1: 'Rio de Janeiro', country: 'Brazil', lat: -22.90642, lon: -43.18223, timezone: 'America/Sao_Paulo', icaoId: 'SBRJ', stationName: 'Rio de Janeiro/Dumont Arpt, RJ, BR' },
  { name: 'Rome', admin1: 'Lazio', country: 'Italy', lat: 41.89193, lon: 12.51133, timezone: 'Europe/Rome', icaoId: 'LIRA', stationName: 'Rome/Ciampino Arpt, RM, IT' },
  { name: 'Seoul', admin1: 'Seoul', country: 'South Korea', lat: 37.566, lon: 126.9784, timezone: 'Asia/Seoul', icaoId: 'RKSS', stationName: 'Seoul/Gimpo Intl, 41, KR' },
  { name: 'Shanghai', admin1: 'Shanghai Municipality', country: 'China', lat: 31.22222, lon: 121.45806, timezone: 'Asia/Shanghai', icaoId: 'ZSSS', stationName: 'Shanghai/Hongqiao Intl, SH, CN' },
  { name: 'Singapore', admin1: '', country: 'Singapore', lat: 1.28967, lon: 103.85007, timezone: 'Asia/Singapore', icaoId: 'WSAP', stationName: 'Singapore/Pays, 4, SG' },
  { name: 'Sydney', admin1: 'New South Wales', country: 'Australia', lat: -33.86785, lon: 151.20732, timezone: 'Australia/Sydney', icaoId: 'YSSY', stationName: 'Sydney Intl, NS, AU' },
  { name: 'Taber', admin1: 'Alberta', country: 'Canada', lat: 49.78703, lon: -112.14603, timezone: 'America/Edmonton', icaoId: 'CYQL', stationName: 'Lethbridge Cnty Arpt, AB, CA' },
  { name: 'Tokyo', admin1: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.69171, timezone: 'Asia/Tokyo', icaoId: 'RJTT', stationName: 'Tokyo/Haneda Intl, 13, JP' },
  { name: 'Winnipeg', admin1: 'Manitoba', country: 'Canada', lat: 49.8844, lon: -97.14704, timezone: 'America/Winnipeg', icaoId: 'CXWN', stationName: 'Winnipeg/The Forks, MB, CA' },
  { name: 'Zurich', admin1: 'Canton of Zurich', country: 'Switzerland', lat: 47.36667, lon: 8.55, timezone: 'Europe/Zurich', icaoId: 'LSMD', stationName: 'Dübendorf Arpt, ZH, CH' },
];

function cityKey(city) {
  return `${city.icaoId}::${city.name}`;
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((c) => cityKey(c) !== 'RKSI::Pyongyang');
    }
  } catch (e) {
    console.error('Failed to load favourites', e);
  }
  return DEFAULT_FAVORITES.map((c) => ({ ...c }));
}

let favorites = loadFavorites();

function persistFavorites() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favourites', e);
  }
}

function isFavorite(city) {
  return favorites.some((f) => cityKey(f) === cityKey(city));
}

function addFavorite(city) {
  if (isFavorite(city)) return;
  favorites.push({ ...city });
  persistFavorites();
}

function removeFavorite(city) {
  favorites = favorites.filter((f) => cityKey(f) !== cityKey(city));
  persistFavorites();
}

function toggleFavorite(city) {
  if (isFavorite(city)) removeFavorite(city); else addFavorite(city);
}

function getMetarUrl() {
  return `/api/metar?ids=${encodeURIComponent(currentCity.icaoId)}`;
}

function getOpenMeteoUrl() {
  return `https://api.open-meteo.com/v1/forecast?latitude=${currentCity.lat}&longitude=${currentCity.lon}&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=${encodeURIComponent(currentCity.timezone)}&forecast_days=14&past_days=7`;
}

function escapeCityHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateFavoriteButton() {
  const btn = document.getElementById('favorite-toggle-btn');
  const fav = isFavorite(currentCity);
  btn.textContent = fav ? '★' : '☆';
  btn.classList.toggle('is-favorite', fav);
  btn.setAttribute('aria-pressed', String(fav));
  btn.title = fav ? 'Remove from favourites' : 'Add to favourites';
}

function updateCityUI() {
  document.getElementById('city-name').textContent = `${currentCity.name} Weather`;
  document.getElementById('city-subtitle').textContent = `METAR · ${currentCity.icaoId} · ${currentCity.stationName}`;
  document.title = `${currentCity.name} Weather`;
  updateFavoriteButton();
}

async function geocodeCity(query) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6`);
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();
  return data.results || [];
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function findNearestStation(lat, lon) {
  const radii = [1, 2, 4, 8, 15];
  for (const delta of radii) {
    const bbox = [lat - delta, lon - delta, lat + delta, lon + delta].map((n) => n.toFixed(2)).join(',');
    try {
      const res = await fetch(`/api/stations?bbox=${encodeURIComponent(bbox)}`);
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) continue;
      let best = null;
      let bestDist = Infinity;
      data.forEach((s) => {
        if (s.lat == null || s.lon == null || !s.icaoId) return;
        const d = haversineDistanceKm(lat, lon, s.lat, s.lon);
        if (d < bestDist) { bestDist = d; best = s; }
      });
      if (best) return { icaoId: best.icaoId, stationName: best.name || best.icaoId, distanceKm: bestDist };
    } catch (e) {
      console.error('Station search failed', e);
    }
  }
  return null;
}

function closeCityPanel() {
  document.getElementById('city-panel').classList.add('hidden');
}

function applySelectedCity(city) {
  saveCity(city);
  updateCityUI();
  closeCityPanel();
  document.getElementById('today-card').classList.add('hidden');
  document.getElementById('today-toggle').textContent = "View Today's Weather";
  document.getElementById('weekly-card').classList.add('hidden');
  document.getElementById('weekly-toggle').textContent = 'View 2-Week Outlook';
  fetchMetar();
}

async function selectCity(geo) {
  const statusEl = document.getElementById('city-status');
  statusEl.textContent = `Finding nearest weather station to ${geo.name}…`;
  const station = await findNearestStation(geo.latitude, geo.longitude);
  if (!station) {
    statusEl.textContent = `No aviation weather station found near ${geo.name}. Try a nearby larger city.`;
    return;
  }
  applySelectedCity({
    name: geo.name,
    admin1: geo.admin1 || '',
    country: geo.country || geo.country_code || '',
    lat: geo.latitude,
    lon: geo.longitude,
    timezone: geo.timezone,
    icaoId: station.icaoId,
    stationName: station.stationName,
  });
}

function selectFavoriteCity(city) {
  applySelectedCity({ ...city });
}

let dragSourceIndex = null;

function reorderFavorites(fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex == null || toIndex == null) return;
  const [moved] = favorites.splice(fromIndex, 1);
  favorites.splice(toIndex, 0, moved);
  persistFavorites();
  renderFavoritesList();
}

function renderFavoritesList() {
  const section = document.getElementById('favorites-section');
  const list = document.getElementById('favorites-list');
  list.innerHTML = '';
  if (favorites.length === 0) {
    section.classList.add('hidden');
    return;
  }
  section.classList.remove('hidden');
  const frag = document.createDocumentFragment();
  favorites.forEach((city, index) => {
    const locationBits = [city.admin1, city.country].filter(Boolean).map(escapeCityHtml).join(', ');
    const row = document.createElement('div');
    row.className = 'favorite-row';
    if (cityKey(city) === cityKey(currentCity)) row.classList.add('favorite-row-active');
    row.draggable = true;
    row.innerHTML = `
      <span class="favorite-handle" aria-hidden="true">⠿</span>
      <button type="button" class="favorite-star" title="Remove from favourites" aria-label="Remove ${escapeCityHtml(city.name)} from favourites">★</button>
      <button type="button" class="favorite-select">${escapeCityHtml(city.name)}${locationBits ? ', ' + locationBits : ''}</button>
    `;
    row.querySelector('.favorite-star').addEventListener('click', () => {
      removeFavorite(city);
      renderFavoritesList();
      updateFavoriteButton();
    });
    row.querySelector('.favorite-select').addEventListener('click', () => selectFavoriteCity(city));

    row.addEventListener('dragstart', (e) => {
      dragSourceIndex = index;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      list.querySelectorAll('.favorite-row').forEach((r) => r.classList.remove('drag-over'));
      dragSourceIndex = null;
    });
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragSourceIndex !== index) row.classList.add('drag-over');
    });
    row.addEventListener('dragleave', () => {
      row.classList.remove('drag-over');
    });
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over');
      reorderFavorites(dragSourceIndex, index);
    });

    frag.appendChild(row);
  });
  list.appendChild(frag);
}

const COVER_LABELS = {
  SKC: 'Clear', CLR: 'Clear', FEW: 'Few Clouds', SCT: 'Scattered',
  BKN: 'Broken', OVC: 'Overcast', VV: 'Obscured',
};

const CONDITION_META = {
  'clear-day': { icon: '☀️', label: 'Clear' },
  'clear-night': { icon: '🌙', label: 'Clear' },
  'partly-cloudy': { icon: '⛅', label: 'Partly Cloudy' },
  'cloudy': { icon: '☁️', label: 'Cloudy' },
  'rain': { icon: '🌧️', label: 'Rain' },
  'snow': { icon: '❄️', label: 'Snow' },
  'fog': { icon: '🌫️', label: 'Fog' },
  'thunderstorm': { icon: '⛈️', label: 'Thunderstorm' },
};

const LAYER_IDS = ['layer-sky', 'layer-moon', 'layer-sun', 'layer-clouds', 'layer-fog', 'layer-rain', 'layer-snow', 'layer-lightning'];

const CONDITION_LAYERS = {
  'clear-day': ['layer-sky', 'layer-sun'],
  'clear-night': ['layer-sky', 'layer-moon'],
  'partly-cloudy': ['layer-sky', 'layer-sun', 'layer-clouds'],
  'cloudy': ['layer-sky', 'layer-clouds'],
  'rain': ['layer-sky', 'layer-clouds', 'layer-rain'],
  'snow': ['layer-sky', 'layer-clouds', 'layer-snow'],
  'fog': ['layer-sky', 'layer-fog'],
  'thunderstorm': ['layer-sky', 'layer-clouds', 'layer-rain', 'layer-lightning'],
};

let lightningTimer = null;
let latestReports = [];

function isDaytimeAt(date) {
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: currentCity.timezone }).format(date));
  return hour >= 6 && hour < 20;
}

function isDaytimeNow() {
  return isDaytimeAt(new Date());
}

function classifyCondition(data, refDate) {
  const wx = (data.wxString || '').toUpperCase();
  if (wx.includes('TS')) return 'thunderstorm';
  if (/SN|SG|IC|PL|GS|GR/.test(wx)) return 'snow';
  if (/RA|DZ|SH/.test(wx)) return 'rain';
  if (/FG|BR|HZ/.test(wx)) return 'fog';

  const cover = data.cover || 'SKC';
  if (cover === 'OVC' || cover === 'VV' || cover === 'BKN') return 'cloudy';
  if (cover === 'SCT' || cover === 'FEW') return 'partly-cloudy';
  return (refDate ? isDaytimeAt(refDate) : isDaytimeNow()) ? 'clear-day' : 'clear-night';
}

function localDateKey(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: currentCity.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function localHour(date) {
  return Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: currentCity.timezone }).format(date)) % 24;
}

function getTodayReports(allReports) {
  const todayKey = localDateKey(new Date());
  return allReports
    .filter((r) => r.obsTime && localDateKey(new Date(r.obsTime * 1000)) === todayKey)
    .sort((a, b) => a.obsTime - b.obsTime);
}

function wmoToCondition(code, isDay) {
  if (code === 0) return isDay ? 'clear-day' : 'clear-night';
  if (code === 1 || code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  return 'cloudy';
}

function dateKeyToUTCNoon(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

function addDaysToKey(dateKey, days) {
  const dt = dateKeyToUTCNoon(dateKey);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function getWeekGridDates() {
  const todayKey = localDateKey(new Date());
  const dow = dateKeyToUTCNoon(todayKey).getUTCDay();
  const sundayThisWeek = addDaysToKey(todayKey, -dow);
  const dates = [];
  for (let i = 0; i < 14; i++) dates.push(addDaysToKey(sundayThisWeek, i));
  return dates;
}

function relativeHumidity(tempC, dewC) {
  const es = (t) => 6.112 * Math.exp((17.62 * t) / (243.12 + t));
  return Math.round(100 * (es(dewC) / es(tempC)));
}

function windChill(tempC, windKmh) {
  if (tempC > 10 || windKmh < 4.8) return null;
  const v16 = Math.pow(windKmh, 0.16);
  return 13.12 + 0.6215 * tempC - 11.37 * v16 + 0.3965 * tempC * v16;
}

function humidex(tempC, dewC) {
  const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (dewC + 273.16)));
  return tempC + 0.5555 * (e - 10);
}

function computeFeelsLike(tempC, dewC, windKmh) {
  if (tempC <= 10) {
    const wc = windChill(tempC, windKmh);
    if (wc !== null && wc < tempC - 0.5) return { value: wc, label: 'Wind Chill' };
  } else if (tempC >= 20 && dewC != null) {
    const hx = humidex(tempC, dewC);
    if (hx - tempC >= 1) return { value: hx, label: 'Humidex' };
  }
  return null;
}

function windDescription(deg, kt) {
  if (!kt) return 'Calm';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round((deg % 360) / 22.5) % 16;
  const kmh = Math.round(kt * 1.852);
  return `${dirs[idx]} ${kmh} km/h`;
}

function formatVisibility(visib) {
  if (visib == null) return '--';
  const num = parseFloat(visib);
  if (Number.isNaN(num)) return String(visib);
  return `${(num * 1.60934).toFixed(1)} km`;
}

function generateDrops(containerId, count, className, durationRange, delayRange) {
  const container = document.getElementById(containerId);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = className;
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${durationRange[0] + Math.random() * (durationRange[1] - durationRange[0])}s`;
    el.style.animationDelay = `${Math.random() * (delayRange[1] - delayRange[0]) + delayRange[0]}s`;
    if (className === 'snowflake') {
      el.style.setProperty('--drift', `${Math.random() * 60 - 30}px`);
      const size = 3 + Math.random() * 4;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
    }
    frag.appendChild(el);
  }
  container.appendChild(frag);
}

function generateStars() {
  const container = document.getElementById('stars');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'star';
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 70}%`;
    el.style.animationDelay = `${Math.random() * 4}s`;
    const size = 1 + Math.random() * 2;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    frag.appendChild(el);
  }
  container.appendChild(frag);
}

function toggleLightning(enabled) {
  clearInterval(lightningTimer);
  if (!enabled) return;
  const flashEl = document.querySelector('#layer-lightning .flash');
  const trigger = () => {
    flashEl.classList.remove('flash-active');
    void flashEl.offsetWidth;
    flashEl.classList.add('flash-active');
  };
  trigger();
  lightningTimer = setInterval(trigger, 3000 + Math.random() * 4000);
}

function applyCondition(condition) {
  const bg = document.getElementById('weather-bg');
  bg.className = `weather-bg cond-${condition}`;
  const active = new Set(CONDITION_LAYERS[condition] || []);
  LAYER_IDS.forEach((id) => {
    document.getElementById(id).classList.toggle('active', active.has(id));
  });
  toggleLightning(condition === 'thunderstorm');
}

function drawTempChart(reports) {
  const canvas = document.getElementById('today-chart');
  const ctx = canvas.getContext('2d');
  const temps = reports.map((r) => r.temp).filter((t) => t != null);
  if (temps.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.parentElement.clientWidth - 56;
  const height = 160;
  canvas.style.height = `${height}px`;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const minT = Math.floor(Math.min(...temps) - 1);
  const maxT = Math.ceil(Math.max(...temps) + 1);
  const range = maxT - minT || 1;

  const leftPad = 32;
  const rightPad = 8;
  const topPad = 14;
  const bottomPad = 20;
  const plotWidth = width - leftPad - rightPad;
  const plotHeight = height - topPad - bottomPad;

  const stepX = reports.length > 1 ? plotWidth / (reports.length - 1) : 0;
  const pointX = (i) => leftPad + i * stepX;
  const pointY = (t) => topPad + plotHeight - ((t - minT) / range) * plotHeight;

  ctx.font = '10px -apple-system, sans-serif';

  const ySteps = [minT, Math.round((minT + maxT) / 2), maxT];
  ySteps.forEach((t) => {
    const y = pointY(t);
    ctx.strokeStyle = 'rgba(159, 217, 184, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftPad, y);
    ctx.lineTo(width - rightPad, y);
    ctx.stroke();
    ctx.fillStyle = '#9fd9b8';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${t}°`, leftPad - 6, y);
  });

  const labelEvery = Math.max(1, Math.ceil(reports.length / 6));
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#9fd9b8';
  reports.forEach((r, i) => {
    if (i % labelEvery === 0 || i === reports.length - 1) {
      if (typeof r.hour === 'number') {
        ctx.textAlign = i === 0 ? 'left' : i === reports.length - 1 ? 'right' : 'center';
        ctx.fillText(`${String(r.hour).padStart(2, '0')}:00`, pointX(i), height - bottomPad + 4);
      }
    }
  });

  ctx.beginPath();
  reports.forEach((r, i) => {
    const x = pointX(i);
    const y = pointY(r.temp);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#34e879';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.lineTo(pointX(reports.length - 1), topPad + plotHeight);
  ctx.lineTo(pointX(0), topPad + plotHeight);
  ctx.closePath();
  ctx.fillStyle = 'rgba(52, 232, 121, 0.12)';
  ctx.fill();

  reports.forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(pointX(i), pointY(r.temp), 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#9dffce';
    ctx.fill();
  });
}

function buildHourlySlots() {
  const now = new Date();
  const currentHour = localHour(now);
  const todayKey = localDateKey(now);

  const metarByHour = {};
  getTodayReports(latestReports).forEach((r) => {
    metarByHour[localHour(new Date(r.obsTime * 1000))] = r;
  });

  const hourlyByHour = {};
  if (forecastData && forecastData.hourly) {
    forecastData.hourly.time.forEach((iso, idx) => {
      if (iso.startsWith(todayKey)) {
        hourlyByHour[Number(iso.slice(11, 13))] = {
          temp: forecastData.hourly.temperature_2m[idx],
          code: forecastData.hourly.weathercode[idx],
        };
      }
    });
  }

  const slots = [];
  let lastKnown = null;
  for (let h = 0; h < 24; h++) {
    if (h < currentHour) {
      const r = metarByHour[h] || lastKnown;
      lastKnown = metarByHour[h] || lastKnown;
      slots.push({
        hour: h, state: 'past',
        temp: r ? r.temp : null,
        condition: r ? classifyCondition(r, new Date(r.obsTime * 1000)) : null,
      });
    } else if (h === currentHour) {
      const r = latestReports[0];
      slots.push({
        hour: h, state: 'current',
        temp: r ? r.temp : null,
        condition: r ? classifyCondition(r) : null,
      });
    } else {
      const f = hourlyByHour[h];
      slots.push({
        hour: h, state: 'future',
        temp: f ? f.temp : null,
        condition: f ? wmoToCondition(f.code, h >= 6 && h < 20) : null,
      });
    }
  }
  return slots;
}

function renderHourlyGrid(slots) {
  const container = document.getElementById('today-grid');
  container.innerHTML = '';
  const frag = document.createDocumentFragment();
  slots.forEach((slot) => {
    const meta = slot.condition ? CONDITION_META[slot.condition] : null;
    const cell = document.createElement('div');
    cell.className = `hour-cell hour-${slot.state}`;
    cell.innerHTML = `
      <span class="hour-label">${String(slot.hour).padStart(2, '0')}:00</span>
      <span class="hour-icon">${meta ? meta.icon : '—'}</span>
      <span class="hour-temp">${slot.temp != null ? Math.round(slot.temp) + '°' : '--'}</span>
    `;
    frag.appendChild(cell);
  });
  container.appendChild(frag);
}

function renderToday() {
  const slots = buildHourlySlots();
  const dateLabel = new Date().toLocaleDateString('en-US', { timeZone: currentCity.timezone, month: 'long', day: 'numeric', year: 'numeric' });
  document.getElementById('today-date').textContent = dateLabel;
  document.getElementById('today-city-label').textContent = `Today in ${currentCity.name}`;

  const temps = slots.map((s) => s.temp).filter((t) => t != null);
  document.getElementById('today-high').textContent = temps.length ? `${Math.round(Math.max(...temps))}°C` : '--';
  document.getElementById('today-low').textContent = temps.length ? `${Math.round(Math.min(...temps))}°C` : '--';
  document.getElementById('today-avg').textContent = temps.length ? `${Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)}°C` : '--';

  drawTempChart(temps.length ? slots.filter((s) => s.temp != null) : []);
  renderHourlyGrid(slots);
}

function renderWeeklyGrid() {
  const dates = getWeekGridDates();
  const todayKey = localDateKey(new Date());
  const dailyMap = {};
  if (forecastData && forecastData.daily) {
    forecastData.daily.time.forEach((dateStr, idx) => {
      dailyMap[dateStr] = {
        max: forecastData.daily.temperature_2m_max[idx],
        min: forecastData.daily.temperature_2m_min[idx],
        code: forecastData.daily.weathercode[idx],
      };
    });
  }

  const container = document.getElementById('weekly-grid');
  container.innerHTML = '';
  const frag = document.createDocumentFragment();
  dates.forEach((dateKey) => {
    const info = dailyMap[dateKey];
    const state = dateKey < todayKey ? 'past' : dateKey === todayKey ? 'current' : 'future';
    const dt = dateKeyToUTCNoon(dateKey);
    const dayLabel = dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const dateLabel = dt.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', timeZone: 'UTC' });
    const condition = info ? wmoToCondition(info.code, true) : null;
    const meta = condition ? CONDITION_META[condition] : null;
    const cell = document.createElement('div');
    cell.className = `day-cell day-${state}`;
    cell.innerHTML = `
      <span class="day-name">${dayLabel}</span>
      <span class="day-date">${dateLabel}</span>
      <span class="day-icon">${meta ? meta.icon : '—'}</span>
      <span class="day-hi">${info ? Math.round(info.max) + '°' : '--'}</span>
      <span class="day-lo">${info ? Math.round(info.min) + '°' : '--'}</span>
    `;
    frag.appendChild(cell);
  });
  container.appendChild(frag);
}

function showError(message) {
  document.getElementById('error-text').textContent = message;
  document.getElementById('error-banner').classList.remove('hidden');
}

function hideError() {
  document.getElementById('error-banner').classList.add('hidden');
}

function render(data) {
  const tempC = data.temp;
  const dewC = data.dewp;
  const windKt = data.wspd || 0;
  const windKmh = windKt * 1.852;
  const humidity = (tempC != null && dewC != null) ? relativeHumidity(tempC, dewC) : null;
  const condition = classifyCondition(data);
  const meta = CONDITION_META[condition];

  document.getElementById('condition-icon').textContent = meta.icon;
  document.getElementById('condition-label').textContent = meta.label;
  document.getElementById('temp-value').textContent = tempC != null ? `${Math.round(tempC)}°C` : '--°';

  const feels = tempC != null ? computeFeelsLike(tempC, dewC, windKmh) : null;
  const feelsEl = document.getElementById('feels-like');
  feelsEl.classList.toggle('hidden', !feels);
  if (feels) feelsEl.textContent = `Feels like ${Math.round(feels.value)}°C (${feels.label})`;

  document.getElementById('stat-humidity').textContent = humidity != null ? `${humidity}%` : '--';
  document.getElementById('stat-wind').textContent = windDescription(data.wdir, windKt);
  document.getElementById('stat-visibility').textContent = formatVisibility(data.visib);
  document.getElementById('stat-pressure').textContent = data.altim != null ? `${data.altim.toFixed(1)} hPa` : '--';
  document.getElementById('stat-dewpoint').textContent = dewC != null ? `${Math.round(dewC)}°C` : '--';
  document.getElementById('stat-clouds').textContent = COVER_LABELS[data.cover] || data.cover || '--';

  const fltCat = data.fltCat;
  const fltEl = document.getElementById('fltcat-badge');
  fltEl.classList.toggle('hidden', !fltCat);
  if (fltCat) {
    fltEl.textContent = fltCat;
    fltEl.className = `fltcat-badge fltcat-${fltCat.toLowerCase()}`;
  }

  if (data.obsTime) {
    const obsDate = new Date(data.obsTime * 1000);
    document.getElementById('last-updated').textContent = `Last updated: ${obsDate.toLocaleString('en-US', { timeZone: currentCity.timezone, dateStyle: 'medium', timeStyle: 'short' })}`;
  }

  document.getElementById('raw-metar').textContent = data.rawOb || '';

  applyCondition(condition);
}

let forecastData = null;

async function fetchForecast() {
  try {
    const res = await fetch(getOpenMeteoUrl());
    if (!res.ok) throw new Error(`Forecast request failed (${res.status})`);
    forecastData = await res.json();
  } catch (err) {
    forecastData = null;
    console.error('Forecast fetch failed:', err.message);
  }
}

function refreshVisibleSecondaryViews() {
  if (!document.getElementById('today-card').classList.contains('hidden')) renderToday();
  if (!document.getElementById('weekly-card').classList.contains('hidden')) renderWeeklyGrid();
}

function showLoading() {
  document.getElementById('loading-overlay').classList.add('show');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.remove('show');
}

async function fetchMetar() {
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn.disabled = true;
  refreshBtn.textContent = 'Refreshing…';
  showLoading();
  try {
    const [metarRes] = await Promise.all([fetch(getMetarUrl()), fetchForecast()]);
    const data = await metarRes.json();
    if (!metarRes.ok) throw new Error(data.error || `Request failed (${metarRes.status})`);
    if (!Array.isArray(data) || data.length === 0) throw new Error(`No METAR data returned for ${currentCity.icaoId}.`);
    latestReports = data;
    render(data[0]);
    refreshVisibleSecondaryViews();
    hideError();
  } catch (err) {
    showError(`Couldn't load weather data: ${err.message}`);
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.textContent = 'Refresh';
    hideLoading();
  }
}

function toggleRaw() {
  const pre = document.getElementById('raw-metar');
  const btn = document.getElementById('raw-toggle');
  const isHidden = pre.classList.toggle('hidden');
  btn.textContent = isHidden ? 'Show raw METAR' : 'Hide raw METAR';
}

function init() {
  updateCityUI();

  generateDrops('layer-rain', 80, 'raindrop', [0.5, 1.1], [0, 3]);
  generateDrops('layer-snow', 60, 'snowflake', [3, 6], [0, 5]);
  generateStars();

  document.getElementById('refresh-btn').addEventListener('click', fetchMetar);
  document.getElementById('retry-btn').addEventListener('click', fetchMetar);
  document.getElementById('raw-toggle').addEventListener('click', toggleRaw);
  document.getElementById('today-toggle').addEventListener('click', () => {
    const card = document.getElementById('today-card');
    const btn = document.getElementById('today-toggle');
    const nowHidden = card.classList.toggle('hidden');
    btn.textContent = nowHidden ? "View Today's Weather" : "Hide Today's Weather";
    if (!nowHidden) renderToday();
  });
  document.getElementById('weekly-toggle').addEventListener('click', () => {
    const card = document.getElementById('weekly-card');
    const btn = document.getElementById('weekly-toggle');
    const nowHidden = card.classList.toggle('hidden');
    btn.textContent = nowHidden ? 'View 2-Week Outlook' : 'Hide 2-Week Outlook';
    if (!nowHidden) renderWeeklyGrid();
  });

  document.getElementById('favorite-toggle-btn').addEventListener('click', () => {
    toggleFavorite(currentCity);
    updateFavoriteButton();
  });

  document.getElementById('city-change-btn').addEventListener('click', () => {
    document.getElementById('city-panel').classList.remove('hidden');
    document.getElementById('city-search-input').value = '';
    document.getElementById('city-results').innerHTML = '';
    document.getElementById('city-status').textContent = '';
    renderFavoritesList();
    document.querySelector('.favorite-row-active')?.scrollIntoView({ block: 'center' });
    document.getElementById('city-search-input').focus();
  });

  document.getElementById('city-cancel-btn').addEventListener('click', closeCityPanel);

  document.getElementById('city-search-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('city-search-input').value.trim();
    if (!query) return;
    const statusEl = document.getElementById('city-status');
    const resultsEl = document.getElementById('city-results');
    resultsEl.innerHTML = '';
    statusEl.textContent = 'Searching…';
    try {
      const results = await geocodeCity(query);
      if (results.length === 0) {
        statusEl.textContent = `No cities found matching "${query}".`;
        return;
      }
      statusEl.textContent = '';
      resultsEl.innerHTML = results.map((r, i) => {
        const locationBits = [r.admin1, r.country || r.country_code].filter(Boolean).map(escapeCityHtml).join(', ');
        return `<button type="button" class="city-result" data-idx="${i}">${escapeCityHtml(r.name)}${locationBits ? ', ' + locationBits : ''}</button>`;
      }).join('');
      resultsEl.querySelectorAll('.city-result').forEach((btn, i) => {
        btn.addEventListener('click', () => selectCity(results[i]));
      });
    } catch (err) {
      statusEl.textContent = `Search failed: ${err.message}`;
    }
  });

  fetchMetar();
  setInterval(fetchMetar, REFRESH_INTERVAL_MS);
}

init();
