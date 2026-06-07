/**
 * CityPage.jsx  —  /:city  (e.g. /dhaka, /rajshahi)
 * Homepage clone — same layout, same sections, same search bar.
 * Only the city keyword changes: "ঢাকার" → "রাজশাহীর" etc.
 */
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, ArrowRight, MapPin, ShieldCheck,
  Phone, Star, X, ChevronRight, CheckCircle2,
  Zap, BadgeCheck, TrendingUp,
  LocateFixed, Loader2, Navigation,
} from 'lucide-react';
import { CATEGORIES, DHAKA_AREAS } from '../constants.js';
import { CategoryIcon } from '../components/CategoryIcon.jsx';
import { useUserLocation } from '../hooks/useUserLocation.js';
import { parseNaturalQuery } from '../utils/aiSearch.js';
import { searchServices } from '../data/categories.js';
import { addSearchHistory, getSearchHistory, saveAreaPref } from '../utils/cookies.js';
import { CITIES } from '../data/siteData.js';
import { expandLocation } from '../data/bangladesh.js';
import WorkerCard from '../components/WorkerCard.jsx';

/* ── helpers (same as Home.jsx) ── */
const BN = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
function toBn(n) { return String(Math.round(n)).split('').map((d) => BN[+d] ?? d).join(''); }
function CountUp({ target, suffix = '', duration = 1800 }) {
  const [count, setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step); else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return <span ref={ref}>{toBn(count)}{suffix}</span>;
}

function getCategoryBg(key) {
  const map = { plumber:'#e8f1f8', electrician:'#fef6e4', cleaner:'#e6f4ef', bua:'#f4ecfb', painter:'#fbeae9', ac_repair:'#eaf3fb', carpenter:'#f5ede5', gas_fitter:'#fdf0e6' };
  return map[key] || '#f3f4f6';
}

const TESTIMONIALS = [
  { name:'রাহিম আহমেদ',    area:'উত্তরা',     text:'দ্রুত প্লাম্বার পেয়েছি, ভালো সার্ভিস। সময়মতো এসেছেন এবং কাজ পরিষ্কারভাবে শেষ করেছেন।',  rating:5 },
  { name:'সুমাইয়া ইসলাম', area:'মিরপুর',     text:'৩০ মিনিটের মধ্যে ইলেক্ট্রিশিয়ান এসেছে। সৎ এবং দক্ষ — দাম যুক্তিসঙ্গত ছিল।',             rating:5 },
  { name:'জাহেদ খান',      area:'ধানমণ্ডি',   text:'সহজেই কাছের ক্লিনার খুঁজে পেয়েছি। বাসা একদম ঝকঝকে করে দিয়ে গেছেন।',                      rating:4 },
  { name:'নাসরিন আক্তার',  area:'গুলশান',     text:'কাঠমিস্ত্রি অনেক ভালো কাজ করেছেন। কাস্টম ওয়ার্ডরোব একদম মনের মতো হয়েছে।',              rating:5 },
  { name:'কামাল হোসেন',    area:'গাজীপুর',    text:'এসি মেকানিক সময়মতো এসেছেন এবং সমস্যা ঠিক করেছেন। দাম যথেষ্ট কম ছিল।',                  rating:5 },
  { name:'তাসলিমা বেগম',   area:'বাসাবো',     text:'বুয়া সার্ভিস অনেক ভালো। বাসা পরিষ্কার রাখেন এবং কাজে অনেক পরিশ্রমী।',                    rating:4 },
  { name:'আরমান হোসেন',    area:'যাত্রাবাড়ী',text:'পেইন্টার দ্রুত এবং পরিচ্ছন্নভাবে কাজ শেষ করেছেন। রঙের মান অনেক ভালো।',                   rating:5 },
  { name:'ফারজানা ইসলাম',  area:'নারায়ণগঞ্জ',text:'গ্যাস ফিটার অনেক অভিজ্ঞ। লিক সমস্যা মাত্র ১ ঘণ্টায় সমাধান করে দিয়েছেন।',              rating:5 },
];

const CHIPS = [
  { icon:BadgeCheck,  label:'NID যাচাইকৃত',   sub:'পরিচয় নিশ্চিত',  iconBg:'#004d38', pillBg:'#f0fdf4', pillBorder:'#86efac', textColor:'#14532d' },
  { icon:Phone,       label:'ফোন যাচাইকৃত',   sub:'নম্বর সত্যিকার',  iconBg:'#92400e', pillBg:'#fffbeb', pillBorder:'#fcd34d', textColor:'#78350f' },
  { icon:ShieldCheck, label:'কোনো কমিশন নেই', sub:'১০০% ফ্রি',       iconBg:'#1e3a8a', pillBg:'#eff6ff', pillBorder:'#93c5fd', textColor:'#1e3a8a' },
  { icon:Zap,         label:'সরাসরি যোগাযোগ', sub:'মধ্যস্থতা নেই',  iconBg:'#4c1d95', pillBg:'#f5f3ff', pillBorder:'#c4b5fd', textColor:'#3b0764' },
  { icon:Star,        label:'রিয়েল রিভিউ',    sub:'বাস্তব অভিজ্ঞতা', iconBg:'#7c2d12', pillBg:'#fff7ed', pillBorder:'#fdba74', textColor:'#7c2d12' },
];

function TrustChips() {
  const trackRef = useRef(null);
  useEffect(() => {
    const el = trackRef.current; if (!el) return;
    let raf, pos = 0;
    const speed = 0.7, half = () => el.scrollWidth / 2;
    let isTouching = false;
    const tick = () => { if (!isTouching) { pos += speed; if (pos >= half()) pos = 0; el.scrollLeft = pos; } raf = requestAnimationFrame(tick); };
    const onTouchStart = () => { isTouching = true; };
    const onTouchEnd   = () => { isTouching = false; pos = el.scrollLeft; };
    el.addEventListener('touchstart',  onTouchStart, { passive: true });
    el.addEventListener('touchend',    onTouchEnd,   { passive: true });
    el.addEventListener('touchcancel', onTouchEnd,   { passive: true });
    const mq = window.matchMedia('(max-width: 639px)');
    if (mq.matches) raf = requestAnimationFrame(tick);
    const onChange = (e) => { if (e.matches) raf = requestAnimationFrame(tick); else cancelAnimationFrame(raf); };
    mq.addEventListener('change', onChange);
    return () => { cancelAnimationFrame(raf); mq.removeEventListener('change', onChange); el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchend', onTouchEnd); el.removeEventListener('touchcancel', onTouchEnd); };
  }, []);

  const chip = ({ icon: Icon, label, sub, iconBg, pillBg, pillBorder, textColor }, i) => (
    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0 transition-all duration-200 hover:scale-105 hover:shadow-md select-none"
      style={{ background: pillBg, border: `2px solid ${pillBorder}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md" style={{ background: iconBg }}>
        <Icon style={{ width:18, height:18, color:'#fff' }} />
      </div>
      <div>
        <p className="text-xs font-black leading-tight" style={{ color: textColor }}>{label}</p>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color: textColor, opacity: 0.6 }}>{sub}</p>
      </div>
    </div>
  );

  return (
    <section className="bg-white border-b border-gray-100 py-5">
      <div ref={trackRef} className="sm:hidden overflow-x-auto scrollbar-hide">
        <div className="flex items-stretch gap-3 px-4 flex-nowrap" style={{ width:'max-content' }}>
          {[...CHIPS, ...CHIPS].map(chip)}
        </div>
      </div>
      <div className="hidden sm:flex items-stretch justify-center gap-3 px-6">{CHIPS.map(chip)}</div>
    </section>
  );
}

const SUGGESTIONS = [
  ...CATEGORIES.map((c) => ({ type:'category', label:c.label, labelBn:c.labelBn, key:c.key, color:c.color, bg:c.bg })),
  ...DHAKA_AREAS.map((a) => ({ type:'area', label:a, key:a })),
];

/* ══════════════════════════════════════════════ */
export default function CityPage() {
  const { city: citySlug } = useParams();
  const navigate = useNavigate();
  const userLoc  = useUserLocation();

  const city = CITIES[citySlug];
  if (!city) return <Navigate to="/browse" replace />;

  const [query,         setQuery]      = useState('');
  const [focused,       setFocused]    = useState(false);
  const [showLocPrompt, setLocPrompt]  = useState(false);
  const [aiResult,      setAiResult]   = useState(null);
  const [svcResults,    setSvcResults] = useState([]);
  const inputRef    = useRef(null);
  const dropdownRef = useRef(null);

  /* ── City workers ── */
  const [workers,      setWorkers]    = useState([]);
  const [wLoading,     setWLoading]   = useState(true);
  const [activeCat,    setActiveCat]  = useState('');   // '' = all
  const [workerSearch, setWSearch]    = useState('');   // local keyword filter

  useEffect(() => {
    setWLoading(true);
    const p = new URLSearchParams();
    const upazilas = expandLocation(city.name);          // all upazilas in this city/district
    p.set('q', upazilas.slice(0, 30).join('|'));          // pipe-separated OR match
    if (activeCat) p.set('category', activeCat);
    p.set('limit', '60');
    fetch(`/api/workers?${p}`)
      .then((r) => r.ok ? r.json() : { workers: [] })
      .then((d) => setWorkers(Array.isArray(d.workers) ? d.workers : []))
      .catch(() => setWorkers([]))
      .finally(() => setWLoading(false));
  }, [citySlug, activeCat]);

  /* keyword filter is client-side (fast, no extra API call) */
  const filteredWorkers = workerSearch.trim()
    ? workers.filter((w) =>
        w.name?.toLowerCase().includes(workerSearch.toLowerCase()) ||
        w.category?.toLowerCase().includes(workerSearch.toLowerCase()) ||
        w.subcategories?.some((s) => s.toLowerCase().includes(workerSearch.toLowerCase())) ||
        w.areas?.some((a) => a.toLowerCase().includes(workerSearch.toLowerCase()))
      )
    : workers;

  useEffect(() => {
    const click = (e) => { if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) setFocused(false); };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  function handleChange(val) {
    setQuery(val); setFocused(true);
    if (val.length >= 2) setSvcResults(searchServices(val)); else setSvcResults([]);
    if (val.length > 4) { const p = parseNaturalQuery(val); setAiResult(p?.confidence >= 40 ? p : null); } else setAiResult(null);
  }

  function search(val) {
    setFocused(false); setAiResult(null); setSvcResults([]);
    const q = val?.trim();
    if (!q) {
      // empty search — reset filters, scroll to workers
      setWSearch(''); setActiveCat('');
      document.getElementById('city-workers')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    addSearchHistory(q);
    const parsed = parseNaturalQuery(q);

    // If a specific category is detected, set the category filter (still in-page)
    if (parsed?.confidence >= 50 && parsed.category) {
      setActiveCat(parsed.category);
      setWSearch(parsed.area || '');
      document.getElementById('city-workers')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Plain keyword — filter workers in-page
    setWSearch(q);
    document.getElementById('city-workers')?.scrollIntoView({ behavior: 'smooth' });
  }

  function pick(s) {
    setFocused(false);
    if (s.type === 'category') {
      navigate(`/browse/${s.key}?area=${encodeURIComponent(city.name)}`);
    } else {
      navigate(`/browse?q=${encodeURIComponent(s.label)}&area=${encodeURIComponent(city.name)}`);
    }
  }

  const filtered = query.trim()
    ? SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()) || s.labelBn?.includes(query)).slice(0, 6)
    : SUGGESTIONS.slice(0, 6);

  const seoTitle = `${city.namePoss} বিশ্বস্ত কারিগর — প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার | কারিগরি`;
  const seoDesc  = `${city.nameLoc} যাচাইকৃত প্লাম্বার, ইলেক্ট্রিশিয়ান, এসি মেকানিক, ক্লিনারসহ সব হোম সার্ভিস। সরাসরি যোগাযোগ, কোনো কমিশন নেই।`;

  const FAQS = [
    { q:`${city.nameLoc} ভালো প্লাম্বার কোথায় পাবো?`,            a:`কারিগরি প্ল্যাটফর্মে ${city.namePoss} সব এলাকায় যাচাইকৃত প্লাম্বার পাবেন। ফোন নম্বর দেখে সরাসরি যোগাযোগ করুন — কোনো কমিশন নেই।` },
    { q:`${city.nameLoc} ইলেক্ট্রিশিয়ান পাবো কোথায়?`,           a:`কারিগরিতে ${city.namePoss} যাচাইকৃত ইলেক্ট্রিশিয়ান আছেন। Browse করুন, রেটিং দেখুন এবং সরাসরি কল করুন।` },
    { q:'কারিগরি কি সম্পূর্ণ বিনামূল্যে?',                        a:'হ্যাঁ, কারিগরি ব্যবহার সম্পূর্ণ বিনামূল্যে। কোনো বুকিং ফি বা কমিশন নেই।' },
    { q:'কারিগররা কি যাচাইকৃত?',                                  a:'হ্যাঁ, সব কারিগরের ফোন নম্বর যাচাই করা হয়। অনেক কারিগরের NID যাচাইকরণও সম্পন্ন।' },
    { q:'কারিগরের সাথে কীভাবে যোগাযোগ করবো?',                    a:'কারিগরের প্রোফাইলে সরাসরি ফোন নম্বর দেওয়া আছে। কোনো মধ্যস্থতাকারী নেই — সরাসরি কল করুন।' },
    { q:`${city.nameLoc} এসি মেকানিক কোথায় পাবো?`,               a:`কারিগরিতে ${city.nameLoc} যাচাইকৃত এসি মেকানিক আছেন। AC Repair ক্যাটাগরিতে ক্লিক করুন।` },
    { q:'কারিগর হিসেবে নিজের প্রোফাইল কীভাবে যোগ করবো?',        a:'"কারিগর হিসেবে যোগ দিন" বাটনে ক্লিক করুন। বিনামূল্যে রেজিস্ট্রেশন করে গ্রাহক পেতে শুরু করুন।' },
    { q:`${city.nameLoc} বাসা পরিষ্কারের ক্লিনার কোথায় পাবো?`,  a:`কারিগরিতে Cleaner ক্যাটাগরিতে ${city.namePoss} এলাকার যাচাইকৃত ক্লিনার খুঁজুন।` },
    { q:`${city.nameLoc} কাঠমিস্ত্রি কোথায় পাবো?`,               a:`কারিগরিতে Carpenter ক্যাটাগরিতে ${city.namePoss} এলাকার অভিজ্ঞ কাঠমিস্ত্রি খুঁজুন।` },
    { q:'সার্ভিসের দাম কত?',                                      a:'প্রতিটি কারিগরের প্রোফাইলে আনুমানিক রেট দেওয়া থাকে। কারিগরের সাথে সরাসরি কথা বলে দাম নির্ধারণ করুন।' },
    { q:`${city.nameLoc} পেইন্টার কোথায় পাওয়া যাবে?`,           a:`কারিগরিতে Painter ক্যাটাগরিতে ${city.namePoss} যাচাইকৃত পেইন্টার আছেন।` },
    { q:`${city.nameLoc} গ্যাস লাইনের সমস্যায় কাকে ডাকবো?`,     a:`কারিগরিতে Gas Fitter ক্যাটাগরিতে ${city.namePoss} যাচাইকৃত গ্যাস ফিটার পাবেন। সরাসরি কল করুন।` },
    { q:`How to find a trusted plumber in ${city.name}?`,          a:`Use Karigori — Bangladesh's #1 local service platform. Find verified plumbers in ${city.name}, check ratings, call directly. No commission.` },
  ];

  return (
    <div className="flex flex-col bg-surface">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="keywords" content={`${city.name} plumber, ${city.name} electrician, ${city.nameBn} কারিগর, ${city.namePoss} প্লাম্বার, ${city.nameLoc} হোম সার্ভিস, karigori ${city.name}`} />
        <link rel="canonical" href={`https://karigori.org/${citySlug}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
      </Helmet>

      {/* ══ HERO ══ */}
      <section className="relative text-white overflow-hidden" style={{ background:'linear-gradient(135deg,#006A4E 0%,#004d38 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-black/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 text-center">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
            বাংলাদেশের #১ লোকাল সার্ভিস প্ল্যাটফর্ম
          </div>

          {/* H1 — city keyword is fixed here instead of rotating */}
          <h1 className="text-[28px] sm:text-4xl lg:text-[52px] font-black text-white mb-5" style={{ lineHeight:1.18, letterSpacing:'-0.025em' }}>
            <span className="text-yellow-300">{city.namePoss}</span>{' '}বিশ্বস্ত<br className="sm:hidden" />
            <span className="text-white sm:inline"> কারিগর খুঁজুন</span>
          </h1>

          <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8" style={{ lineHeight:1.7 }}>
            যাচাইকৃত প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার ও আরও পেশাদার —
            সরাসরি যোগাযোগ, কোনো কমিশন নেই।
          </p>

          {/* Location modal */}
          {showLocPrompt && (
            <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center px-4" onClick={() => setLocPrompt(false)}>
              <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 pt-8 pb-6 text-center" style={{ background:'linear-gradient(135deg,#006A4E 0%,#004d38 100%)' }}>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                    <Navigation className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-black text-xl" style={{ lineHeight:1.3 }}>আপনার অবস্থান ব্যবহার করতে চাই</h3>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-700 text-sm text-center mb-1" style={{ lineHeight:1.7 }}>আরও ভালো সার্চ ফলাফলের জন্য আমরা আপনার ডিভাইসের অবস্থান ব্যবহার করতে চাই।</p>
                  <p className="text-slate-400 text-xs text-center mb-5">আমরা আপনার অবস্থান সংরক্ষণ করি না।</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setLocPrompt(false); userLoc.detect(); }}
                      className="w-full text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 text-base"
                      style={{ background:'linear-gradient(135deg,#006A4E 0%,#004d38 100%)' }}>
                      <LocateFixed className="w-4 h-4 shrink-0" /> অনুমতি দিন
                    </button>
                    <button onClick={() => setLocPrompt(false)} className="w-full border-2 border-gray-200 text-slate-500 font-semibold py-3 rounded-full text-sm">এখন নয়</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto" ref={dropdownRef}>
            <div className={`flex items-center bg-white rounded-2xl overflow-hidden transition-all duration-200
              ${focused ? 'ring-3 ring-yellow-300/50 shadow-[0_0_0_3px_rgba(253,224,71,0.3),0_20px_60px_rgba(0,0,0,0.3)]' : 'shadow-[0_8px_40px_rgba(0,0,0,0.3)]'}`}>
              <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
              <input ref={inputRef} type="search" value={query}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onKeyDown={(e) => { if (e.key==='Enter') search(query); if (e.key==='Escape') setFocused(false); }}
                placeholder="প্লাম্বার, এসি মেকানিক বা এলাকা লিখুন…"
                className="flex-1 px-3 py-5 text-gray-900 text-sm font-medium outline-none bg-transparent placeholder-slate-400" />
              {query
                ? <button onClick={() => { setQuery(''); setSvcResults([]); inputRef.current?.focus(); }} className="p-1.5 mr-1 text-slate-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
                : <button onClick={() => userLoc.area ? navigate(`/browse?q=${encodeURIComponent(userLoc.area)}`) : setLocPrompt(true)}
                    disabled={userLoc.loading}
                    className={`flex items-center gap-1.5 mx-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0
                      ${userLoc.area ? 'bg-green-50 text-green-700 border border-green-300' : 'text-slate-400 hover:text-green-600 hover:bg-gray-50'}`}>
                    {userLoc.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><LocateFixed className="w-3.5 h-3.5 shrink-0" /><span className="hidden sm:inline">{userLoc.area||'কাছের'}</span></>}
                  </button>
              }
              <button onClick={() => search(query)} className="m-2 text-white font-bold px-6 py-3 rounded-xl transition-all shrink-0 text-sm active:scale-95" style={{ background:'#004d38' }}>খুঁজুন</button>
            </div>

            {focused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {svcResults.length > 0 && (
                  <>
                    <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">সার্ভিস ম্যাচ</div>
                    {svcResults.slice(0, 4).map((r, i) => (
                      <button key={i} onMouseDown={() => { addSearchHistory(r.subcategory.label); navigate(`/browse/${r.categoryKey}?q=${encodeURIComponent(r.subcategory.label)}&area=${encodeURIComponent(city.name)}`); setFocused(false); }}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background:getCategoryBg(r.categoryKey) }}>
                          <CategoryIcon category={r.categoryKey} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{r.subcategory.label}</p>
                          <p className="text-[11px] text-slate-400 truncate">{r.matchedServices.slice(0,3).join(' · ')}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
                      </button>
                    ))}
                    <div className="border-t border-gray-50 my-1" />
                  </>
                )}
                {aiResult && (
                  <div className="bg-green-50 border-b border-green-100 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background:'#006A4E' }}>
                        <span className="text-white text-[9px] font-black">AI</span>
                      </div>
                      <p className="text-xs font-semibold text-green-700 flex-1">{aiResult.suggestion}</p>
                      <button onMouseDown={() => search(query)} className="shrink-0 text-white text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background:'#006A4E' }}>খুঁজুন</button>
                    </div>
                  </div>
                )}
                {!query && getSearchHistory().length > 0 && (
                  <>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">সাম্প্রতিক</div>
                    {getSearchHistory().map((h, i) => (
                      <button key={i} onMouseDown={() => { setQuery(h); search(h); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors">
                        <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 text-xs">↩</span>
                        <span className="text-sm text-gray-900 truncate">{h}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-50 my-1" />
                  </>
                )}
                <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{query ? 'ফলাফল' : 'সাজেশন'}</div>
                {filtered.map((s, i) => (
                  <button key={i} onMouseDown={() => pick(s)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors">
                    {s.type==='category'
                      ? <span className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background:s.bg, color:s.color }}><CategoryIcon category={s.key} size={14} /></span>
                      : <span className="w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"><MapPin className="w-3.5 h-3.5 text-slate-400" /></span>}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{s.label}</p>
                      {s.labelBn && <p className="text-[11px] text-slate-400">{s.labelBn}</p>}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-200 ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => navigate(`/browse/${c.key}?area=${encodeURIComponent(city.name)}`)}
                className="flex items-center gap-1.5 border border-white/20 text-white/85 text-xs font-medium px-3 py-1.5 rounded-full transition-all active:scale-95 hover:bg-white/15"
                style={{ background:'rgba(255,255,255,0.1)' }}>
                <CategoryIcon category={c.key} size={11} /> {c.labelBn}
              </button>
            ))}
            <Link to="/browse" className="flex items-center gap-1 bg-yellow-300/20 border border-yellow-300/40 text-yellow-200 text-xs font-bold px-3 py-1.5 rounded-full">সব →</Link>
          </div>

          {/* Location feedback */}
          {(userLoc.area || userLoc.loading) && (
            <div className="flex items-center justify-center mt-5">
              {userLoc.loading && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/70">
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-300 shrink-0" /> অবস্থান সনাক্ত হচ্ছে…
                </div>
              )}
              {userLoc.area && !userLoc.loading && (
                <div className="flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 flex-wrap justify-center gap-y-1.5">
                  <Navigation className="w-4 h-4 text-yellow-300 shrink-0" />
                  <span className="text-sm text-white/80">সনাক্ত: <strong className="text-yellow-300">{userLoc.area}</strong></span>
                  <button onClick={() => navigate(`/browse?q=${encodeURIComponent(userLoc.area)}`)} className="text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0 bg-white/20 hover:bg-white/30">এখানে কারিগর →</button>
                  <button onClick={userLoc.clear} className="text-white/40 hover:text-white/70"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══ Stats band ══ */}
      <section className="border-t border-white/10" style={{ background:'#004d38' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 divide-x divide-white/10">
          {[
            { target:30,  suffix:'+', label:'যাচাইকৃত কারিগর',  sub:'Verified Workers' },
            { target:8,   suffix:'',  label:'সার্ভিস ক্যাটাগরি', sub:'Categories' },
            { target:500, suffix:'+', label:'বাংলাদেশের এলাকা',  sub:'Locations' },
          ].map(({ target, suffix, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center px-4 py-2">
              <span className="text-3xl sm:text-4xl font-black text-yellow-300" style={{ letterSpacing:'-0.03em' }}><CountUp target={target} suffix={suffix} /></span>
              <span className="text-xs sm:text-sm font-semibold text-white/70 mt-1">{label}</span>
              <span className="text-[10px] text-white/30 mt-0.5">{sub}</span>
            </div>
          ))}
        </div>
      </section>

      <TrustChips />

      {/* ══ Workers in this city ══ */}
      <section id="city-workers" className="py-10 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="section-title">
                {city.namePoss} সকল কারিগর
              </h2>
              <p className="section-sub mt-1">
                {wLoading ? 'লোড হচ্ছে…' : `${toBn(filteredWorkers.length)}জন যাচাইকৃত কারিগর পাওয়া গেছে`}
              </p>
            </div>
            {/* Keyword search inside city */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={workerSearch}
                onChange={(e) => setWSearch(e.target.value)}
                placeholder={`${city.namePoss} প্লাম্বার, ক্লিনার…`}
                className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none
                  focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white placeholder-gray-400"
              />
              {workerSearch && (
                <button type="button" onClick={() => setWSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCat('')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all
                ${!activeCat ? 'bg-green-700 text-white border-green-700 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'}`}>
              সব ক্যাটাগরি
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat.key}
                onClick={() => setActiveCat(activeCat === cat.key ? '' : cat.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all
                  ${activeCat === cat.key
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-opacity-60'}`}
                style={activeCat === cat.key ? { background: cat.color, borderColor: cat.color } : {}}>
                <CategoryIcon category={cat.key} size={13} />
                {cat.labelBn}
              </button>
            ))}
          </div>

          {/* Workers grid */}
          {wLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorkers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.slice(0, 12).map((w) => (
                  <WorkerCard key={w._id} worker={w} />
                ))}
              </div>
              {filteredWorkers.length > 12 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => navigate(activeCat ? `/browse/${activeCat}?area=${encodeURIComponent(city.name)}` : `/browse?area=${encodeURIComponent(city.name)}`)}
                    className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-full text-white text-sm transition-all hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#006A4E 0%,#004d38 100%)' }}>
                    আরও {toBn(filteredWorkers.length - 12)}জন কারিগর দেখুন
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-bold text-gray-800 mb-1">কোনো কারিগর পাওয়া যায়নি</p>
              <p className="text-sm text-slate-500 mb-5">
                {workerSearch
                  ? `"${workerSearch}" — এই নামে ${city.namePoss} কোনো কারিগর নেই`
                  : `${city.nameLoc} এখনো কারিগর যোগ হয়নি`}
              </p>
              {workerSearch && (
                <button onClick={() => setWSearch('')}
                  className="text-sm font-semibold text-green-700 hover:underline">
                  ← সব কারিগর দেখুন
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══ How it works ══ */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">মাত্র ৩টি ধাপে কারিগর পান</h2>
            <p className="section-sub">সহজ, দ্রুত, বিশ্বস্ত</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-10 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200" />
            {[
              { n:'০১', icon:Search, title:'কারিগর খুঁজুন',       desc:'এলাকা ও সার্ভিস দিয়ে ফিল্টার করুন, রেটিং দেখুন।' },
              { n:'০২', icon:Star,   title:'প্রোফাইল দেখুন',       desc:'রেটিং, অভিজ্ঞতা ও যাচাইকরণ স্ট্যাটাস চেক করুন।' },
              { n:'০৩', icon:Phone,  title:'সরাসরি যোগাযোগ করুন', desc:'কোনো মধ্যস্থতাকারী নেই — সরাসরি কল করুন।' },
            ].map(({ n, icon:Icon, title, desc }) => (
              <div key={n} className="relative flex flex-col items-center text-center p-6 bg-surface rounded-card border border-gray-100 hover:shadow-card transition-all">
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-md" style={{ background:'#006A4E' }}>{n}</div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-md" style={{ background:'#006A4E' }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Reviews marquee ══ */}
      <section className="py-14 bg-surface border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8 text-center">
          <h2 className="section-title">ব্যবহারকারীদের অভিজ্ঞতা</h2>
          <p className="section-sub">বাস্তব রিভিউ, বাস্তব মানুষ</p>
        </div>
        <div className="marquee-outer">
          <div className="marquee-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="w-72 sm:w-80 shrink-0 mx-3 bg-white rounded-card shadow-card p-5 flex flex-col gap-3 border border-gray-50">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                        fill={s<=t.rating?'#FBBF24':'none'} stroke={s<=t.rating?'#FBBF24':'#D1D5DB'} strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-800 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-2.5 border-t border-gray-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background:'#006A4E' }}>{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{t.area}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Trust ══ */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">বিশ্বাসযোগ্য ও যাচাইকৃত</h2>
            <p className="section-sub">আমরা কারিগরদের যাচাই করি যাতে আপনি নিরাপদে সার্ভিস পান</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon:BadgeCheck,  color:'bg-green-100 text-green-700',  title:'NID যাচাইকৃত',    desc:'ফোন নম্বর ও পরিচয়পত্র (NID) যাচাই করা হয়।' },
              { icon:ShieldCheck, color:'bg-blue-100 text-blue-600',    title:'কোনো কমিশন নেই', desc:'সরাসরি কারিগরের সাথে কথা বলুন, কোনো ফি নেই।' },
              { icon:Star,        color:'bg-amber-100 text-amber-600',  title:'রিয়েল রিভিউ',    desc:'সব রেটিং বাস্তব ব্যবহারকারীদের কাছ থেকে।' },
            ].map(({ icon:Icon, color, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 bg-surface rounded-card border border-gray-100">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-14 bg-surface border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title">সাধারণ প্রশ্নোত্তর</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all">
                <summary className="flex items-start justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none gap-2">
                  <span>{q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0 mt-0.5" />
                </summary>
                <p className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-gray-50 pt-3">{a}</p>
              </details>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            ⚠️ যাচাইকরণ সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দেয় না।{' '}
            <Link to="/disclaimer" className="underline hover:text-slate-600">নীতিমালা পড়ুন →</Link>
          </p>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-16" style={{ background:'linear-gradient(135deg,#006A4E 0%,#004d38 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3" style={{ letterSpacing:'-0.02em' }}>এখনই সাহায্য দরকার?</h2>
          <p className="text-white/60 text-sm mb-8">{city.namePoss} সব যাচাইকৃত কারিগর ব্রাউজ করুন</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => navigate(`/browse?area=${encodeURIComponent(city.name)}`)}
              className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full text-base transition-all hover:bg-gray-100 active:scale-95 shadow-xl"
              style={{ color:'#004d38' }}>
              সকল কারিগর দেখুন <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
            <Link to="/register" className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/15 active:scale-95 transition-all text-sm">
              কারিগর হিসেবে যোগ দিন
            </Link>
          </div>
        </div>
      </section>

      <div className="h-16 md:hidden" />
    </div>
  );
}
