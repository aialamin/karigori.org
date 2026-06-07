/**
 * PriceGuide.jsx — Service price guide pages
 * Route: /price-guide/:service
 * 10 pages — one per service, full pricing breakdown + city comparison
 */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ChevronRight, TrendingUp, ArrowRight, CheckCircle2,
  AlertCircle, MapPin, Star, Clock, Zap, BadgeCheck,
} from 'lucide-react';
import { SERVICES, CITIES, SERVICE_SLUGS } from '../data/siteData.js';
import { CategoryIcon } from '../components/CategoryIcon.jsx';

const G  = '#006A4E';
const GD = '#004d38';

/* ── Detailed price data per service ── */
const PRICE_DETAILS = {
  electrician: {
    jobs: [
      { job:'ফ্যান ইনস্টলেশন',        min:200,  max:400,   unit:'প্রতিটি',  time:'৩০ মিনিট',    note:'রেগুলেটর সহ ৳১০০ বেশি' },
      { job:'লাইট/সুইচ ফিটিং',        min:150,  max:300,   unit:'প্রতিটি',  time:'১৫–২০ মিনিট', note:'নতুন পয়েন্ট হলে বেশি' },
      { job:'সার্কিট ব্রেকার মেরামত',  min:500,  max:1200,  unit:'প্রতিটি',  time:'১–২ ঘণ্টা',   note:'ব্র্যান্ড অনুযায়ী' },
      { job:'হোম ওয়্যারিং (প্রতি পয়েন্ট)',min:800,max:1500,unit:'পয়েন্ট',   time:'পরিবর্তনশীল',  note:'ফ্ল্যাটের আকার অনুযায়ী' },
      { job:'AC পাওয়ার লাইন ইনস্টল',  min:1500, max:3000,  unit:'প্রতিটি',  time:'২–৩ ঘণ্টা',   note:'মিটার বোর্ড থেকে' },
      { job:'ইমার্জেন্সি ডে/নাইট কল', min:700,  max:1500,  unit:'ভিজিট',    time:'তাৎক্ষণিক',   note:'রাতে ৫০% বেশি হতে পারে' },
    ],
    factors: ['ফ্ল্যাট/বাড়ির বয়স — পুরনো ওয়্যারিং জটিল','কাজের সময় — রাতে জরুরি সার্ভিস বেশি','যন্ত্রপাতির ব্র্যান্ড ও মান','এলাকার দূরত্ব ও ট্রাফিক'],
    tips: ['কাজ শুরুর আগে সম্পূর্ণ চার্জ লিখিত নিন','একাধিক কারিগরের থেকে কোটেশন নিন','পার্টস কিনতে বাজারে গিয়ে নিজে দাম যাচাই করুন','কাজ শেষে চেক করুন সব আলো/সুইচ ঠিক মতো কাজ করছে কিনা'],
  },
  plumber: {
    jobs: [
      { job:'কল/ট্যাপ মেরামত',          min:300,  max:500,   unit:'প্রতিটি',  time:'৩০ মিনিট',   note:'নতুন কল লাগালে বেশি' },
      { job:'পাইপ লিক মেরামত',           min:500,  max:1500,  unit:'পার কাজ',  time:'১–২ ঘণ্টা',  note:'ওয়াল খুলতে হলে ৩×' },
      { job:'কমোড ইনস্টলেশন',            min:500,  max:1200,  unit:'প্রতিটি', time:'১–২ ঘণ্টা',  note:'কমোড কিনতে ৳৩–৮ হাজার' },
      { job:'বাথরুম সম্পূর্ণ ফিটিং',    min:5000, max:15000, unit:'পুরো বাথরুম',time:'১–২ দিন',  note:'ফিক্সচার দাম আলাদা' },
      { job:'ওভারহেড ট্যাংক ইনস্টল',    min:1000, max:3000,  unit:'প্রতিটি', time:'২–৪ ঘণ্টা',  note:'উচ্চতা ও সাইজ অনুযায়ী' },
      { job:'ড্রেনেজ পরিষ্কার/আনব্লক',  min:500,  max:1500,  unit:'পার কাজ', time:'৩০–৯০ মিনিট',note:'গভীর ব্লক হলে বেশি' },
    ],
    factors: ['পাইপের বয়স ও ধরন (PVC/GI)','দেয়াল ভাঙার প্রয়োজন','ফিক্সচার ব্র্যান্ড ও গুণমান','জরুরি বা অফ-আওয়ার কল'],
    tips: ['পানি বন্ধ করার মেইন ভালভ কোথায় জানুন','ছোট লিকে দেরি করলে বড় ক্ষতি হয়','ফিটিং ম্যাটেরিয়াল সম্পর্কে কারিগরকে আগেই জিজ্ঞেস করুন','কাজের ওয়ারেন্টি নিন'],
  },
  'ac-repair': {
    jobs: [
      { job:'বেসিক সার্ভিসিং',           min:800,  max:1200,  unit:'প্রতি AC', time:'১.৫ ঘণ্টা',  note:'ফিল্টার + কয়েল পরিষ্কার' },
      { job:'ডিপ ক্লিনিং',              min:1500, max:2500,  unit:'প্রতি AC', time:'২–৩ ঘণ্টা',  note:'ভেতরের কয়েল বিচ্ছিন্ন' },
      { job:'গ্যাস রিফিল (R-22)',        min:2000, max:3000,  unit:'প্রতি AC', time:'১–২ ঘণ্টা',  note:'R-32 হলে ৳৩–৫ হাজার' },
      { job:'কমপ্রেসর মেরামত/রিপ্লেস',  min:5000, max:15000, unit:'প্রতি AC', time:'৪–৬ ঘণ্টা',  note:'নতুন কম্প্রেসর বেশি খরচ' },
      { job:'নতুন AC ইনস্টলেশন (১ টন)', min:1500, max:2500,  unit:'প্রতিটি', time:'২–৩ ঘণ্টা',  note:'পাইপ ও তার আলাদা' },
      { job:'PCB বোর্ড মেরামত',          min:1500, max:5000,  unit:'প্রতিটি', time:'১–৩ দিন',    note:'ব্র্যান্ড অনুযায়ী' },
    ],
    factors: ['AC-র বয়স ও ব্র্যান্ড','টন ক্যাপাসিটি (১, ১.৫, ২ টন)','গ্যাসের ধরন (R-22 vs R-32/R-410A)','ইনভার্টার বনাম নন-ইনভার্টার মডেল'],
    tips: ['প্রতি বছর গরম আসার আগে একবার সার্ভিস করান','ফিল্টার মাসে একবার পরিষ্কার করতে পারেন নিজেই','গ্যাস চার্জ দেওয়ার পর ১–২ বছরের মধ্যে আবার লাগলে লিক চেক করান','সার্ভিস করার সময় উপস্থিত থাকুন'],
  },
  cleaner: {
    jobs: [
      { job:'বেসিক ক্লিনিং (১ বেড)',      min:800,  max:1200,  unit:'প্রতিবার', time:'২ ঘণ্টা',    note:'ফ্লোর মোছা + ডাস্টিং' },
      { job:'ডিপ ক্লিন (২ বেড)',           min:1500, max:2500,  unit:'প্রতিবার', time:'৩–৪ ঘণ্টা',  note:'টাইলস স্ক্রাব সহ' },
      { job:'ডিপ ক্লিন (৩ বেড)',           min:2500, max:4000,  unit:'প্রতিবার', time:'৪–৫ ঘণ্টা',  note:'ফুল বাথরুম + কিচেন' },
      { job:'মুভ-ইন/মুভ-আউট ক্লিনিং',     min:3000, max:5000,  unit:'ফ্ল্যাট',  time:'৬–৮ ঘণ্টা',  note:'নতুন বাসার জন্য আদর্শ' },
      { job:'কিচেন ডিপ ক্লিন',             min:800,  max:1500,  unit:'একবার',   time:'১.৫–২.৫ ঘণ্টা',note:'গ্রীজ পরিষ্কার সহ' },
      { job:'অফিস ক্লিনিং',               min:50,   max:80,    unit:'প্রতি সিট',time:'পরিবর্তনশীল', note:'মাসিক চুক্তিতে কম' },
    ],
    factors: ['বাসার আকার (বর্গফুট)','ক্লিনিংয়ের ধরন (বেসিক/ডিপ)','কারিগর নিজের সরঞ্জাম আনবেন কিনা','নিয়মিত বা এককালীন সার্ভিস'],
    tips: ['নিয়মিত সার্ভিসে প্যাকেজ নিলে সাশ্রয়','আগেই জানুন কারিগর সরঞ্জাম আনেন কিনা','মুভ-ইন ক্লিনিং বসবাস শুরুর আগে করান','মূল্যবান জিনিস নিরাপদ স্থানে রাখুন'],
  },
};

/* Fallback for services without detailed data */
function getDetailedData(serviceSlug, svc) {
  return PRICE_DETAILS[serviceSlug] || {
    jobs: [
      { job:'বেসিক সার্ভিস',  min:svc.priceMin, max:Math.round(svc.priceMax*0.8),  unit:svc.priceUnit, time:'১–২ ঘণ্টা', note:'সাধারণ কাজ' },
      { job:'স্ট্যান্ডার্ড সার্ভিস',min:Math.round(svc.priceMin*1.2),max:svc.priceMax,unit:svc.priceUnit,time:'২–৪ ঘণ্টা',note:'বেশি কাজ' },
      { job:'প্রিমিয়াম/জরুরি', min:svc.priceMax,max:svc.priceMax*2,unit:svc.priceUnit,time:'তাৎক্ষণিক',note:'জরুরি কাজে বেশি' },
    ],
    factors: ['কাজের পরিমাণ ও জটিলতা','জরুরি বা নিয়মিত সার্ভিস','কারিগরের অভিজ্ঞতা ও রেটিং','এলাকার দূরত্ব'],
    tips: ['কাজ শুরুর আগে দাম চূড়ান্ত করুন','একাধিক কারিগরের কোটেশন তুলনা করুন','রিভিউ দেখে কারিগর বেছে নিন','কাজ শেষে রিভিউ দিন'],
  };
}

export default function PriceGuide() {
  const { service: serviceSlug } = useParams();
  const navigate = useNavigate();
  const svc = SERVICES[serviceSlug];

  if (!svc) { navigate('/price-guide/electrician', { replace: true }); return null; }

  const data  = getDetailedData(serviceSlug, svc);
  const avgMin = Math.round(data.jobs.reduce((s, j) => s + j.min, 0) / data.jobs.length);
  const avgMax = Math.round(data.jobs.reduce((s, j) => s + j.max, 0) / data.jobs.length);

  const title = `${svc.labelBn}ের খরচ কত? — সম্পূর্ণ প্রাইস গাইড ২০২৬ | কারিগরি`;
  const desc  = `বাংলাদেশে ${svc.labelBn}ের সম্পূর্ণ মূল্য তালিকা। ${svc.tagline}। আনুমানিক খরচ ৳${svc.priceMin}–৳${svc.priceMax} প্রতি ${svc.priceUnit}।`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="keywords"    content={`${svc.label.toLowerCase()} cost bangladesh, ${svc.labelBn} খরচ, ${svc.label.toLowerCase()} price dhaka, ${svc.labelBn} কত টাকা, best ${svc.label.toLowerCase()} price bd`} />
        <link rel="canonical"    href={`https://karigori.org/price-guide/${serviceSlug}`} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={desc} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type':'Question', name:`${svc.labelBn}ের খরচ কত?`, acceptedAnswer:{ '@type':'Answer', text:`বাংলাদেশে ${svc.labelBn}ের সাধারণ খরচ ৳${svc.priceMin}–৳${svc.priceMax} প্রতি ${svc.priceUnit}। কাজের ধরন ও জটিলতা অনুযায়ী পরিবর্তন হয়।` } },
            { '@type':'Question', name:`${svc.label} cost in Bangladesh?`, acceptedAnswer:{ '@type':'Answer', text:`${svc.label} typically costs ৳${svc.priceMin}–৳${svc.priceMax} per ${svc.priceUnit} in Bangladesh. Prices vary by job complexity and urgency.` } },
          ],
        })}</script>
      </Helmet>

      <div className="flex flex-col bg-surface min-h-screen">

        {/* ── Hero ── */}
        <section className="relative text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/10 rounded-full blur-2xl" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-18">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <Link to="/" className="hover:text-white transition-colors">কারিগরি</Link>
              <ChevronRight style={{ width: 12, height: 12 }} />
              <Link to="/price-guide/electrician" className="hover:text-white transition-colors">প্রাইস গাইড</Link>
              <ChevronRight style={{ width: 12, height: 12 }} />
              <span className="text-white font-bold">{svc.labelBn}</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              <TrendingUp style={{ width: 13, height: 13, color: '#fbbf24' }} />
              ২০২৬ সালের আপডেটেড মূল্য
            </div>

            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-xl"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <CategoryIcon category={svc.key} size={32} />
              </div>
              <div>
                <h1 className="font-black text-white mb-2" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
                  {svc.labelBn}ের খরচ কত?
                </h1>
                <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl">
                  {svc.tagline}। বাংলাদেশের সব শহরে আনুমানিক মূল্য তালিকা।
                </p>
              </div>
            </div>

            {/* Price range chips */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-yellow-300/20 border border-yellow-300/40 text-yellow-200 text-sm font-black px-4 py-2 rounded-full">
                <span className="text-yellow-300 text-lg">৳{svc.priceMin}–{svc.priceMax}</span>
                <span className="text-white/70 text-xs font-semibold">প্রতি {svc.priceUnit}</span>
              </div>
              {['সরাসরি যোগাযোগ','কমিশন নেই','যাচাইকৃত কারিগর'].map(t => (
                <span key={t} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff' }}>
                  <CheckCircle2 style={{ width: 11, height: 11 }} /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats band ── */}
        <section style={{ background: GD }} className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-3 divide-x divide-white/10 text-center">
            {[
              { val: `৳${svc.priceMin}`,   label: 'সর্বনিম্ন খরচ',  sub: 'Starting Price' },
              { val: `৳${svc.priceMax}`,   label: 'সর্বোচ্চ খরচ',  sub: 'Max Price' },
              { val: `৳${avgMin}–${avgMax}`,label: 'গড় খরচ',       sub: 'Avg per Job' },
            ].map(({ val, label, sub }) => (
              <div key={label} className="px-4 py-2">
                <p className="text-xl sm:text-2xl font-black text-yellow-300">{val}</p>
                <p className="text-xs font-semibold text-white/70 mt-0.5">{label}</p>
                <p className="text-[10px] text-white/30">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

          {/* ── Detailed price table ── */}
          <section>
            <div className="mb-5">
              <h2 className="section-title">{svc.labelBn} — কাজের ধরন অনুযায়ী মূল্য</h2>
              <p className="section-sub">আনুমানিক মূল্য। বাস্তব খরচ কারিগরের সাথে সরাসরি কথা বলে নির্ধারণ করুন।</p>
            </div>
            <div className="bg-white rounded-card border border-gray-100 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: G }}>
                      {['কাজের ধরন','সর্বনিম্ন','সর্বোচ্চ','ইউনিট','সময়','নোট'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-white font-bold text-xs whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.jobs.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{row.job}</td>
                        <td className="px-4 py-3 text-sm font-black" style={{ color: G }}>৳{row.min.toLocaleString('bn-BD')}</td>
                        <td className="px-4 py-3 text-sm font-black text-red-500">৳{row.max.toLocaleString('bn-BD')}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{row.unit}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          <span className="flex items-center gap-1"><Clock style={{ width: 10, height: 10 }} />{row.time}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-amber-600">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-100 flex items-start gap-2">
                <AlertCircle style={{ width: 14, height: 14, color: '#d97706', flexShrink: 0, marginTop: 1 }} />
                <p className="text-xs text-amber-700 leading-relaxed">উপরের মূল্য আনুমানিক। কাজের জটিলতা, পার্টসের দাম ও এলাকা অনুযায়ী পরিবর্তন হতে পারে। কাজ শুরুর আগে কারিগরের সাথে সরাসরি কথা বলে দাম চূড়ান্ত করুন।</p>
              </div>
            </div>
          </section>

          {/* ── What affects price ── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-card border border-gray-100 shadow-card p-5">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp style={{ width: 16, height: 16, color: G }} />
                খরচ যে কারণে বাড়তে পারে
              </h3>
              <ul className="space-y-3">
                {data.factors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5" style={{ background: '#ef4444' }}>{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-card border border-gray-100 shadow-card p-5">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <BadgeCheck style={{ width: 16, height: 16, color: G }} />
                খরচ বাঁচানোর টিপস
              </h3>
              <ul className="space-y-3">
                {data.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 style={{ width: 16, height: 16, color: G, flexShrink: 0, marginTop: 2 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Skills covered ── */}
          <section className="bg-white rounded-card border border-gray-100 shadow-card p-5 sm:p-6">
            <h2 className="font-black text-gray-900 mb-4">কারিগরিতে {svc.labelBn}রা কী কী কাজ করেন?</h2>
            <div className="flex flex-wrap gap-2">
              {svc.skills.map(skill => (
                <span key={skill} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border"
                  style={{ background: svc.bg, color: svc.color, borderColor: svc.color + '40' }}>
                  <Zap style={{ width: 11, height: 11 }} /> {skill}
                </span>
              ))}
            </div>
          </section>

          {/* ── City price comparison ── */}
          <section>
            <div className="mb-5">
              <h2 className="section-title">শহর অনুযায়ী {svc.labelBn} খুঁজুন</h2>
              <p className="section-sub">২১টি শহরে যাচাইকৃত {svc.labelBn} — সরাসরি যোগাযোগ</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(CITIES).map(([slug, city]) => (
                <Link key={slug} to={`/${slug}/${serviceSlug}`}
                  className="group flex items-center gap-3 p-3.5 rounded-card bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#f0fdf4' }}>
                    <MapPin style={{ width: 15, height: 15, color: G }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{city.nameBn}</p>
                    <p className="text-[10px] text-slate-400 truncate">{city.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Other service price guides ── */}
          <section className="bg-white rounded-card border border-gray-100 shadow-card p-5">
            <h3 className="font-black text-gray-900 text-sm mb-4">অন্য সার্ভিসের প্রাইস গাইড</h3>
            <div className="flex flex-wrap gap-2">
              {SERVICE_SLUGS.filter(s => s !== serviceSlug).map(slug => {
                const s = SERVICES[slug];
                return (
                  <Link key={slug} to={`/price-guide/${slug}`}
                    className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full border-2 transition-all"
                    style={{ borderColor: `${G}25`, background: '#f0fdf4', color: G }}
                    onMouseEnter={e => { e.currentTarget.style.background=G; e.currentTarget.style.color='#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#f0fdf4'; e.currentTarget.style.color=G; }}>
                    {s.emoji} {s.labelBn}
                  </Link>
                );
              })}
            </div>
          </section>

        </div>

        {/* ── CTA ── */}
        <section className="py-16" style={{ background: `linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
              এখনই বিশ্বস্ত {svc.labelBn} খুঁজুন
            </h2>
            <p className="text-white/60 text-sm mb-8">যাচাইকৃত কারিগর · সরাসরি কল · কমিশন নেই</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={`/browse/${serviceSlug}`}
                className="inline-flex items-center gap-2 bg-white font-bold px-8 py-4 rounded-full text-base transition-all hover:bg-gray-100 active:scale-95 shadow-xl"
                style={{ color: GD }}>
                {svc.emoji} {svc.labelBn} দেখুন <ArrowRight className="w-5 h-5 shrink-0" />
              </Link>
              <Link to="/register"
                className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/15 transition-all text-sm">
                কারিগর হিসেবে যোগ দিন
              </Link>
            </div>
          </div>
        </section>

        <div className="h-16 md:hidden" />
      </div>
    </>
  );
}
