import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Users, LayoutGrid, MapPin, ShieldCheck,
  Phone, Star, TrendingUp, X, ChevronRight, CheckCircle2,
  MessageSquare, Award, Zap,
} from 'lucide-react';
import { CATEGORIES, DHAKA_AREAS } from '../constants.js';
import { CategoryIcon } from '../components/CategoryIcon.jsx';

/* ── Live search suggestions ── */
const SUGGESTIONS = [
  ...CATEGORIES.map((c) => ({ type: 'category', label: c.label, labelBn: c.labelBn, key: c.key, color: c.color, bg: c.bg })),
  ...DHAKA_AREAS.map((a)  => ({ type: 'area',     label: a,        key: a })),
];

const QUICK_TAGS = CATEGORIES.slice(0, 5).map((c) => ({ key: c.key, label: c.labelBn, color: c.color, bg: c.bg }));

const TESTIMONIALS = [
  { name: 'রাহিম আহমেদ',    area: 'উত্তরা',   text: 'দ্রুত প্লাম্বার পেয়েছি, ভালো সার্ভিস। সময়মতো এসেছেন এবং কাজ পরিষ্কারভাবে শেষ করেছেন।',  rating: 5 },
  { name: 'সুমাইয়া ইসলাম', area: 'মিরপুর',   text: '৩০ মিনিটের মধ্যে ইলেক্ট্রিশিয়ান এসেছে। সৎ এবং দক্ষ — দাম যুক্তিসঙ্গত ছিল।',             rating: 5 },
  { name: 'জাহেদ খান',      area: 'ধানমণ্ডি', text: 'সহজেই কাছের ক্লিনার খুঁজে পেয়েছি। বাসা একদম ঝকঝকে করে দিয়ে গেছেন।',                      rating: 4 },
];

export default function Home() {
  const navigate = useNavigate();
  const [query,   setQuery]   = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef   = useRef(null);
  const dropdownRef = useRef(null);

  const filtered = query.trim()
    ? SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()) || s.labelBn?.includes(query)).slice(0, 7)
    : SUGGESTIONS.slice(0, 7);

  useEffect(() => {
    function click(e) {
      if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target))
        setFocused(false);
    }
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  function search(val) {
    setFocused(false);
    navigate(val?.trim() ? `/browse?q=${encodeURIComponent(val.trim())}` : '/browse');
  }
  function pick(s) {
    setFocused(false);
    s.type === 'category' ? navigate(`/browse/${s.key}`) : navigate(`/browse?q=${encodeURIComponent(s.label)}`);
  }

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-700 text-white overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.07)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <TrendingUp className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            ঢাকার #১ লোকাল সার্ভিস প্ল্যাটফর্ম
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight font-bn">
            ঢাকা-র বিশ্বস্ত<br />
            <span className="text-amber-300 drop-shadow">কারিগর</span> খুঁজুন
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            বিশ্বস্ত প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার ও আরও অনেক পেশাদার —
            যাচাইকৃত কারিগর, সরাসরি যোগাযোগ, কোনো কমিশন নেই।
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto" ref={dropdownRef}>
            <div className={`flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden transition-all ${focused ? 'ring-2 ring-amber-300' : ''}`}>
              <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
                onFocus={() => setFocused(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') search(query); if (e.key === 'Escape') setFocused(false); }}
                placeholder="দক্ষতা, নাম বা এলাকা লিখুন…"
                className="flex-1 px-3 py-4 text-gray-800 text-sm outline-none bg-transparent placeholder-gray-400 font-bn"
                aria-label="কারিগর খুঁজুন"
              />
              {query && (
                <button onClick={() => { setQuery(''); inputRef.current?.focus(); }} className="p-1 mr-1 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => search(query)}
                className="m-1.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all">
                খুঁজুন
              </button>
            </div>

            {/* Dropdown */}
            {focused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  {query ? 'ফলাফল' : 'সাজেশন'}
                </div>
                {filtered.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">কোনো ফলাফল পাওয়া যায়নি</p>
                ) : filtered.map((s, i) => (
                  <button key={i} onMouseDown={() => pick(s)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors">
                    {s.type === 'category' ? (
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg, color: s.color }}>
                        <CategoryIcon category={s.key} size={15} />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{s.label}</p>
                      {s.labelBn && <p className="text-[11px] text-gray-400 font-bn">{s.labelBn}</p>}
                      {s.type === 'area' && <p className="text-[11px] text-gray-400">ঢাকার এলাকা</p>}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {QUICK_TAGS.map((t) => (
              <button key={t.key} onClick={() => navigate(`/browse/${t.key}`)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95 font-bn">
                <CategoryIcon category={t.key} size={12} /> {t.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-12">
            {[
              { icon: Users,      val: '৩০+', label: 'কারিগর' },
              { icon: LayoutGrid, val: '৮',   label: 'ক্যাটাগরি' },
              { icon: MapPin,     val: '২৫+', label: 'ঢাকার এলাকা' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="flex flex-col items-center">
                <Icon className="w-4 h-4 text-amber-300 mb-1" />
                <span className="text-2xl font-extrabold">{val}</span>
                <span className="text-xs text-white/60 mt-0.5 font-bn">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-bn mb-2">কী সার্ভিস দরকার?</h2>
            <p className="text-gray-400 text-sm">ঢাকায় যাচাইকৃত পেশাদার কারিগরি সার্ভিস</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <button key={cat.key} onClick={() => navigate(`/browse/${cat.key}`)}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer"
                style={{ background: cat.bg }}
                aria-label={`${cat.label} খুঁজুন`}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm"
                  style={{ background: cat.color + '20', color: cat.color }}>
                  <CategoryIcon category={cat.key} size={26} />
                </div>
                <div className="text-center" style={{ color: cat.color }}>
                  <p className="font-bold text-sm">{cat.label}</p>
                  <p className="text-xs opacity-70 font-bn mt-0.5">{cat.labelBn}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-bn mb-2">তিনটি সহজ ধাপে কাজ করে</h2>
            <p className="text-gray-400 text-sm">কিভাবে কারিগরি ব্যবহার করবেন</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-12 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

            {[
              { step: '০১', icon: Search,   title: 'কারিগর খুঁজুন',         desc: 'আপনার এলাকা ও প্রয়োজন অনুযায়ী ক্যাটাগরি বা সার্চ করুন।' },
              { step: '০২', icon: Star,     title: 'প্রোফাইল দেখুন',         desc: 'রেটিং, অভিজ্ঞতা, সার্ভিস এলাকা ও যাচাইকরণ স্ট্যাটাস দেখুন।' },
              { step: '০৩', icon: Phone,    title: 'সরাসরি যোগাযোগ করুন',   desc: 'মাঝখানে কেউ নেই — সরাসরি কল করে কথা বলুন ও চুক্তি করুন।' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center p-7 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs font-extrabold font-bn shadow-sm">
                    {step[1]}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 font-bn">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-bn">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST — VERIFIED
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-bn mb-2">বিশ্বাসযোগ্য ও যাচাইকৃত কারিগর</h2>
            <p className="text-gray-400 text-sm font-bn">আমরা কারিগরদের যাচাই করি যাতে আপনি নিরাপদে সার্ভিস পেতে পারেন</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', title: 'তথ্য যাচাই', desc: 'ফোন নম্বর ও পরিচয়পত্র (NID) যাচাই করা হয়।' },
              { icon: ShieldCheck,  color: 'text-brand-600 bg-brand-50',     title: 'প্রোফাইল পর্যালোচনা', desc: 'প্রতিটি কারিগরের প্রোফাইল আমাদের টিম রিভিউ করে অনুমোদন দেয়।' },
              { icon: Star,         color: 'text-amber-600 bg-amber-50',      title: 'রিয়েল রিভিউ', desc: 'রেটিং ও রিভিউ আসে বাস্তব ব্যবহারকারীদের কাছ থেকে।' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 font-bn">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-bn">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer notice */}
          <div className="mt-8 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 max-w-2xl mx-auto">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed font-bn">
              <strong>গুরুত্বপূর্ণ:</strong> যাচাইকরণ সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দেয় না।
              সার্ভিস গ্রহণের আগে নিজে যাচাই করুন।{' '}
              <a href="/disclaimer" className="underline font-semibold hover:text-amber-900">সম্পূর্ণ নীতিমালা পড়ুন →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NO MIDDLEMAN
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-bn mb-2">কোনো মধ্যস্থতাকারী নেই</h2>
            <p className="text-gray-400 text-sm font-bn">সরাসরি সংযোগ — সরাসরি চুক্তি</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Zap,          title: 'কোনো কমিশন নেই',       desc: 'কারিগরিকে কোনো অ্যাপ ফি বা কমিশন দিতে হবে না।' },
              { icon: Phone,        title: 'সরাসরি কথা বলুন',       desc: 'কারিগরের সাথে সরাসরি ফোনে বা WhatsApp-এ কথা বলুন।' },
              { icon: MessageSquare,title: 'নিজের মতো চুক্তি করুন', desc: 'কাজ শুরুর আগে দাম ও শর্ত নিজেরা ঠিক করুন।' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 font-bn">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-bn">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-bn mb-2">ঢাকার মানুষের বাস্তব অভিজ্ঞতা</h2>
            <p className="text-gray-400 text-sm font-bn">ব্যবহারকারীদের মতামত</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-gray-700 text-sm leading-relaxed font-bn flex-1">"{t.text}"</p>
                {/* Reviewer */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-gray-200">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 font-bn">{t.name}</p>
                    <p className="text-xs text-gray-400 font-bn flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.area}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-brand-600 to-emerald-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold mb-1 font-bn">এখনই সাহায্য দরকার?</h2>
            <p className="text-white/70 text-sm font-bn">ঢাকার সব যাচাইকৃত কারিগর ব্রাউজ করুন</p>
          </div>
          <button onClick={() => navigate('/browse')}
            className="bg-white text-brand-700 font-extrabold px-7 py-4 rounded-full flex items-center gap-2.5 hover:bg-gray-50 active:scale-95 transition-all shadow-lg shrink-0 font-bn">
            <span>সব কারিগর দেখুন</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </section>
    </div>
  );
}
