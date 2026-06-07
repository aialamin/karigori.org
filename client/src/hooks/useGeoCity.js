/**
 * useGeoCity — detect user's city via IP geolocation
 *
 * Flow:
 *  1. Check localStorage cache (valid for 7 days)
 *  2. If expired/missing → call ip-api.com (free, no key, 45 req/min)
 *  3. Match returned city → one of our 21 city slugs
 *  4. Cache result
 *
 * Returns: { slug, nameBn, name, loading, dismiss, dismissed }
 * slug is null if city not matched or user dismissed.
 */
import { useState, useEffect } from 'react';

const CACHE_KEY     = 'kg_geo_city_v1';
const DISMISS_KEY   = 'kg_geo_dismissed_v1';
const CACHE_TTL_MS  = 7 * 24 * 60 * 60 * 1000; // 7 days

/* Map common IP-API city names → our slugs */
const CITY_MAP = {
  // Dhaka variants
  'dhaka':         'dhaka',
  'dacca':         'dhaka',
  'new dhaka':     'dhaka',
  // Gazipur
  'gazipur':       'gazipur',
  'gazipura':      'gazipur',
  'tongi':         'tongi',
  // Chattogram
  'chittagong':    'chattogram',
  'chattogram':    'chattogram',
  'chittaong':     'chattogram',
  // Narayanganj
  'narayanganj':   'narayanganj',
  // Sylhet
  'sylhet':        'sylhet',
  // Cumilla / Comilla
  'comilla':       'cumilla',
  'cumilla':       'cumilla',
  // Mymensingh
  'mymensingh':    'mymensingh',
  'mymensing':     'mymensingh',
  // Rajshahi
  'rajshahi':      'rajshahi',
  // Khulna
  'khulna':        'khulna',
  // Rangpur
  'rangpur':       'rangpur',
  // Bogura / Bogra
  'bogra':         'bogura',
  'bogura':        'bogura',
  // Barishal / Barisal
  'barisal':       'barishal',
  'barishal':      'barishal',
  // Jessore / Jashore
  'jessore':       'jessore',
  'jashore':       'jessore',
  // Narsingdi
  'narsingdi':     'narsingdi',
  // Savar
  'savar':         'savar',
  // Cox's Bazar
  "cox's bazar":   'coxsbazar',
  'coxs bazar':    'coxsbazar',
  'coxsbazar':     'coxsbazar',
  // Feni
  'feni':          'feni',
  // Tangail
  'tangail':       'tangail',
  // Brahmanbaria
  'brahmanbaria':  'brahmanbaria',
  'brahman baria': 'brahmanbaria',
  // Keraniganj
  'keraniganj':    'keraniganj',
  'keranigonj':    'keraniganj',
};

/* City display info (slug → labels) */
const CITY_INFO = {
  dhaka:        { nameBn: 'ঢাকা',            name: 'Dhaka' },
  gazipur:      { nameBn: 'গাজীপুর',         name: 'Gazipur' },
  chattogram:   { nameBn: 'চট্টগ্রাম',        name: 'Chattogram' },
  narayanganj:  { nameBn: 'নারায়ণগঞ্জ',      name: 'Narayanganj' },
  sylhet:       { nameBn: 'সিলেট',           name: 'Sylhet' },
  cumilla:      { nameBn: 'কুমিল্লা',         name: 'Cumilla' },
  mymensingh:   { nameBn: 'ময়মনসিংহ',        name: 'Mymensingh' },
  rajshahi:     { nameBn: 'রাজশাহী',         name: 'Rajshahi' },
  khulna:       { nameBn: 'খুলনা',           name: 'Khulna' },
  rangpur:      { nameBn: 'রংপুর',           name: 'Rangpur' },
  bogura:       { nameBn: 'বগুড়া',           name: 'Bogura' },
  barishal:     { nameBn: 'বরিশাল',          name: 'Barishal' },
  jessore:      { nameBn: 'যশোর',            name: 'Jessore' },
  narsingdi:    { nameBn: 'নরসিংদী',         name: 'Narsingdi' },
  savar:        { nameBn: 'সাভার',           name: 'Savar' },
  tongi:        { nameBn: 'টঙ্গী',           name: 'Tongi' },
  coxsbazar:    { nameBn: 'কক্সবাজার',       name: "Cox's Bazar" },
  feni:         { nameBn: 'ফেনী',            name: 'Feni' },
  tangail:      { nameBn: 'টাঙ্গাইল',        name: 'Tangail' },
  brahmanbaria: { nameBn: 'ব্রাহ্মণবাড়িয়া', name: 'Brahmanbaria' },
  keraniganj:   { nameBn: 'কেরানীগঞ্জ',      name: 'Keraniganj' },
};

function matchCity(rawCity) {
  if (!rawCity) return null;
  const key = rawCity.toLowerCase().trim();
  return CITY_MAP[key] || null;
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { slug, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) { localStorage.removeItem(CACHE_KEY); return null; }
    return slug; // may be '' (meaning: fetched but no match)
  } catch { return null; }
}

function writeCache(slug) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ slug, ts: Date.now() })); } catch {}
}

export function useGeoCity() {
  const [slug,      setSlug]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [dismissed, setDismissed] = useState(() => {
    try { return !!localStorage.getItem(DISMISS_KEY); } catch { return false; }
  });

  useEffect(() => {
    const cached = readCache();
    if (cached !== null) {
      setSlug(cached || null); // '' stored means no match
      setLoading(false);
      return;
    }

    // Only fetch for BD visitors (or anywhere — ip-api filters by country below)
    fetch('https://ip-api.com/json?fields=status,city,country,countryCode')
      .then((r) => r.json())
      .then((data) => {
        if (data.status !== 'success' || data.countryCode !== 'BD') {
          writeCache(''); setSlug(null); return;
        }
        // Match city name → slug; fall back to 'dhaka' if BD but unrecognized city
        const matched = matchCity(data.city) || 'dhaka';
        writeCache(matched);
        setSlug(matched);
      })
      .catch(() => { writeCache(''); setSlug(null); })
      .finally(() => setLoading(false));
  }, []);

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
    setDismissed(true);
  }

  const info = slug ? CITY_INFO[slug] : null;

  return {
    slug,          // e.g. 'dhaka' | null
    nameBn: info?.nameBn ?? null,
    name:   info?.name   ?? null,
    loading,
    dismissed,
    dismiss,
  };
}
