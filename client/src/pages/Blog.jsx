import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Search, Clock, Calendar, User, ArrowRight, Tag,
  TrendingUp, Eye, BookOpen, Bell, ChevronRight,
  Wrench, Zap, Wind, Sparkles, Bug, Paintbrush,
  Camera, Droplets, Home, Star, Filter, X,
  CheckCircle2, Mail, Phone, MapPin, ExternalLink, Loader2,
} from 'lucide-react';
import { BLOGS as STATIC_BLOGS } from '../data/blogData.js';

/* ─────────────────────────────────────────────
   COLORS
───────────────────────────────────────────── */
const G = '#006A4E';
const GD = '#004d38';

/* ─────────────────────────────────────────────
   BLOG DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  { key: 'plumbing',     label: 'প্লাম্বিং',        labelEn: 'Plumbing',          Icon: Droplets,   color: '#0369a1', bg: '#e0f2fe' },
  { key: 'electrical',   label: 'ইলেকট্রিশিয়ান',    labelEn: 'Electrician',        Icon: Zap,        color: '#d97706', bg: '#fef3c7' },
  { key: 'ac',           label: 'AC সার্ভিস',         labelEn: 'AC Repair',          Icon: Wind,       color: '#0891b2', bg: '#cffafe' },
  { key: 'cleaning',     label: 'ক্লিনিং',           labelEn: 'Home Cleaning',      Icon: Sparkles,   color: '#7c3aed', bg: '#ede9fe' },
  { key: 'pest',         label: 'পেস্ট কন্ট্রোল',   labelEn: 'Pest Control',       Icon: Bug,        color: '#b45309', bg: '#fef9c3' },
  { key: 'painting',     label: 'পেইন্টিং',          labelEn: 'Painting',           Icon: Paintbrush, color: '#db2777', bg: '#fce7f3' },
  { key: 'cctv',         label: 'CCTV',               labelEn: 'CCTV',               Icon: Camera,     color: '#374151', bg: '#f3f4f6' },
  { key: 'water-tank',   label: 'ওয়াটার ট্যাংক',    labelEn: 'Water Tank',         Icon: Droplets,   color: '#0284c7', bg: '#dbeafe' },
  { key: 'maintenance',  label: 'হোম মেইনটেন্যান্স', labelEn: 'Home Maintenance',   Icon: Wrench,     color: G,         bg: '#dcfce7' },
  { key: 'interior',     label: 'ইন্টেরিয়র ডিজাইন', labelEn: 'Interior Design',    Icon: Home,       color: '#9333ea', bg: '#f3e8ff' },
];

/* Blog data: dynamic from API, static as fallback */

const FAQS = [
  {
    q: 'ঢাকায় প্লাম্বার বুক করতে কতক্ষণ লাগে?',
    a: 'কারিগরি প্ল্যাটফর্মে বুকিং করলে সাধারণত ১-৩ ঘণ্টার মধ্যে একজন NID যাচাইকৃত প্লাম্বার আসেন। ইমার্জেন্সি সার্ভিসে ৩০-৬০ মিনিটেও পাওয়া যায়।',
  },
  {
    q: 'বাংলাদেশে বাসার ক্লিনিং সার্ভিস কত টাকা?',
    a: 'ঢাকায় ৩ বেডরুমের বাসা ক্লিনিং খরচ সাধারণত ৮০০-১,৫০০ টাকা। ডিপ ক্লিনিং ও উইন্ডো ক্লিনিং আলাদা চার্জ হয়।',
  },
  {
    q: 'AC সার্ভিস বছরে কতবার করানো উচিত?',
    a: 'সর্বনিম্ন বছরে ১ বার, তবে ভারী ব্যবহারে (দিনে ১২+ ঘণ্টা) বছরে ২ বার সার্ভিস করানো উচিত। গরমের মৌসুমের আগে (ফেব্রুয়ারি-মার্চ) করানো সবচেয়ে ভালো।',
  },
  {
    q: 'ইলেকট্রিশিয়ান সার্ভিস কি বিশ্বস্ত?',
    a: 'কারিগরিতে সব ইলেকট্রিশিয়ান NID যাচাইকৃত এবং ফোন ভেরিফাইড। আগের কাজের রিভিউ দেখে সিদ্ধান্ত নিন। কাজের পর রেটিং দেওয়ার সুবিধা আছে।',
  },
  {
    q: 'পেস্ট কন্ট্রোল কি বাচ্চাদের জন্য নিরাপদ?',
    a: 'পেশাদার পেস্ট কন্ট্রোল সার্ভিস WHO অনুমোদিত কেমিক্যাল ব্যবহার করে। সার্ভিসের পর ৪-৬ ঘণ্টা ঘর ছেড়ে থাকা উচিত। শিশু ও পোষা প্রাণীর জন্য নিরাপদ পদ্ধতি জিজ্ঞেস করুন।',
  },
  {
    q: 'পানির ট্যাংক কতদিন পরপর পরিষ্কার করতে হয়?',
    a: 'স্বাস্থ্য বিশেষজ্ঞদের মতে প্রতি ৩-৬ মাসে একবার পানির ট্যাংক পরিষ্কার করা উচিত। বর্ষার পর এবং গরমের আগে পরিষ্কার করলে সবচেয়ে বেশি সুবিধা পাওয়া যায়।',
  },
];

// TRENDING and RECENT are computed dynamically in component

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getCat(key) { return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0]; }

function BlogImage({ blog, className = '', style = {} }) {
  const cat = getCat(blog.category);
  return (
    <div
      className={className}
      style={{
        background: blog.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        ...style,
      }}>
      <div style={{ opacity: 0.15, position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)' }} />
      <cat.Icon style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.9)' }} />
    </div>
  );
}

function CategoryBadge({ catKey, small }) {
  const cat = getCat(catKey);
  return (
    <span style={{
      background: cat.bg, color: cat.color,
      fontSize: small ? 10 : 11,
      fontWeight: 700,
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 20,
      whiteSpace: 'nowrap',
    }}>
      {cat.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   JSON-LD SCHEMAS
───────────────────────────────────────────── */
const BASE_URL = 'https://karigori.com';

// blogListSchema is now built dynamically in component from API data

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'হোম', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'ব্লগ', item: `${BASE_URL}/blog` },
  ],
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function Blog() {
  const [search,      setSearch]      = useState('');
  const [activeCat,   setActiveCat]   = useState('all');
  const [openFaq,     setOpenFaq]     = useState(null);
  const [email,       setEmail]       = useState('');
  const [subDone,     setSubDone]     = useState(false);
  const [BLOGS,       setBlogs]       = useState(STATIC_BLOGS);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs?limit=50')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.blogs?.length) setBlogs(d.blogs); })
      .catch(() => {})
      .finally(() => setBlogsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = BLOGS;
    if (activeCat !== 'all') list = list.filter((b) => b.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.title?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        (b.tags || []).some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [search, activeCat, BLOGS]);

  const featured = BLOGS.filter((b) => b.featured);
  const TRENDING = BLOGS.slice(0, 4);
  const RECENT   = [...BLOGS].sort(() => Math.random() - 0.5).slice(0, 5);

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'কারিগরি ব্লগ',
    description: 'বাংলাদেশের সেরা হোম সার্ভিস টিপস ও গাইড',
    url: `${BASE_URL}/blog`,
    publisher: { '@type': 'Organization', name: 'কারিগরি', logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` } },
    blogPost: BLOGS.slice(0, 6).map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      description: b.metaDesc || b.excerpt,
      url: `${BASE_URL}/blog/${b.slug}`,
      datePublished: b.createdAt || '2025-05-01',
      author: { '@type': 'Person', name: b.author?.name || 'কারিগরি টিম' },
    })),
  };

  return (
    <>
      <Helmet>
        <title>কারিগরি ব্লগ — হোম সার্ভিস টিপস, গাইড ও পরামর্শ | Karigori</title>
        <meta name="description" content="প্লাম্বিং, ইলেকট্রিশিয়ান, AC সার্ভিস, ক্লিনিং ও অন্যান্য হোম সার্ভিস সম্পর্কে বিশেষজ্ঞ টিপস। বাংলাদেশের সেরা কারিগর খুঁজুন কারিগরিতে।" />
        <meta name="keywords" content="ঢাকা প্লাম্বার, ইলেকট্রিশিয়ান সার্ভিস, AC মেকানিক, হোম ক্লিনিং, পেস্ট কন্ট্রোল, বাংলাদেশ কারিগর" />
        <link rel="canonical" href={`${BASE_URL}/blog`} />
        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:title"       content="কারিগরি ব্লগ — হোম সার্ভিস টিপস ও গাইড" />
        <meta property="og:description" content="প্লাম্বিং, ইলেকট্রিশিয়ান, AC সার্ভিস ও ক্লিনিং সম্পর্কে বিশেষজ্ঞ পরামর্শ।" />
        <meta property="og:url"         content={`${BASE_URL}/blog`} />
        <meta property="og:site_name"   content="কারিগরি" />
        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="কারিগরি ব্লগ — হোম সার্ভিস গাইড" />
        <meta name="twitter:description" content="বাংলাদেশের সেরা হোম সার্ভিস টিপস ও গাইড।" />
        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(blogListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="bg-gray-50 min-h-screen">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section style={{ background: `linear-gradient(135deg, ${G} 0%, ${GD} 100%)`, position: 'relative', overflow: 'hidden' }}>
          {/* Decorative blobs */}
          <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
          <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

          <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 relative">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-6 text-xs" style={{ color:'rgba(255,255,255,0.65)' }}>
              <Link to="/" style={{ color:'inherit' }} className="hover:text-white transition-colors">হোম</Link>
              <ChevronRight style={{ width:12, height:12 }} />
              <span style={{ color:'#fff' }}>ব্লগ</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)' }}>
                <BookOpen style={{ width:12, height:12 }} /> বিশেষজ্ঞ পরামর্শ ও গাইড
              </span>

              <h1 className="font-black leading-tight mb-4 text-white"
                style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
                সেবা, মেরামত ও হোম সার্ভিস<br className="hidden sm:block" /> সম্পর্কে দরকারি তথ্য
              </h1>

              <p className="mb-8 leading-relaxed" style={{ color:'rgba(255,255,255,0.82)', fontSize:'clamp(0.95rem, 2vw, 1.1rem)', maxWidth:560, margin:'0 auto 2rem' }}>
                প্লাম্বিং, ইলেকট্রিশিয়ান, AC সার্ভিস, ক্লিনিং ও অন্যান্য সার্ভিস সম্পর্কে বিশেষজ্ঞ টিপস ও গাইড।
              </p>

              {/* Search bar */}
              <div className="relative max-w-xl mx-auto mb-6">
                <Search style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', width:18, height:18, color:'#9ca3af' }} />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="প্লাম্বার, AC সার্ভিস, ক্লিনিং..."
                  aria-label="ব্লগ খুঁজুন"
                  className="w-full bg-white rounded-2xl pl-11 pr-4 py-4 text-sm font-medium text-gray-800 outline-none shadow-xl"
                  style={{ boxShadow:'0 8px 32px rgba(0,0,0,0.18)' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)' }}>
                    <X style={{ width:16, height:16, color:'#9ca3af' }} />
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 flex-wrap" style={{ color:'rgba(255,255,255,0.75)', fontSize:13 }}>
                {[['১২+','আর্টিকেল'],['১০টি','ক্যাটাগরি'],['৫০,০০০+','পাঠক']].map(([n,l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <span className="font-black text-white" style={{ fontSize:16 }}>{n}</span>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CATEGORY FILTER BAR
        ══════════════════════════════════════ */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar" style={{ scrollbarWidth:'none' }}>
              <button
                onClick={() => setActiveCat('all')}
                className="shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all"
                style={activeCat === 'all'
                  ? { background: G, color:'#fff', boxShadow:`0 2px 12px rgba(0,106,78,0.3)` }
                  : { background:'#f3f4f6', color:'#374151' }}>
                সব পোস্ট
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActiveCat(c.key)}
                  className="shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
                  style={activeCat === c.key
                    ? { background: c.color, color:'#fff', boxShadow:`0 2px 12px ${c.color}44` }
                    : { background: c.bg, color: c.color }}>
                  <c.Icon style={{ width:12, height:12 }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">

          {/* ══════════════════════════════════════
              FEATURED BLOGS
          ══════════════════════════════════════ */}
          {activeCat === 'all' && !search && (
            <section className="mb-14" aria-label="ফিচার্ড ব্লগ">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 rounded-full" style={{ background: G }} />
                <h2 className="text-xl font-black text-gray-900">ফিচার্ড আর্টিকেল</h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: G }}>টপ পিক</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Large card */}
                <article className="md:col-span-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col">
                  <BlogImage blog={featured[0]} style={{ height: 240 }} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryBadge catKey={featured[0].category} />
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock style={{ width:11, height:11 }} /> {featured[0].readTime}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                        <Eye style={{ width:11, height:11 }} /> {featured[0].views}
                      </span>
                    </div>
                    <h3 className="font-black text-gray-900 leading-snug mb-2 text-lg group-hover:text-green-700 transition-colors">
                      <Link to={`/blog/${featured[0].slug}`}>{featured[0].title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{featured[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <AuthorChip author={featured[0].author} date={featured[0].date} />
                      <ReadMore slug={featured[0].slug} />
                    </div>
                  </div>
                </article>

                {/* 2 small cards stacked */}
                <div className="flex flex-col gap-5">
                  {featured.slice(1, 3).map((blog) => (
                    <SmallFeaturedCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════
              MAIN CONTENT + SIDEBAR
          ══════════════════════════════════════ */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── LEFT: Blog grid ── */}
            <main className="flex-1 min-w-0">
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-7 rounded-full" style={{ background: G }} />
                  <h2 className="text-xl font-black text-gray-900">
                    {search ? `"${search}" — ফলাফল` : activeCat === 'all' ? 'সর্বশেষ আর্টিকেল' : getCat(activeCat).label}
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{filtered.length}টি</span>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                  <Search style={{ width:40, height:40, color:'#d1d5db', margin:'0 auto 12px' }} />
                  <p className="text-gray-400 font-semibold">কোনো আর্টিকেল পাওয়া যায়নি</p>
                  <button onClick={() => { setSearch(''); setActiveCat('all'); }} className="mt-4 text-sm font-bold px-4 py-2 rounded-full text-white" style={{ background: G }}>
                    সব দেখুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filtered.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </main>

            {/* ── RIGHT: Sidebar ── */}
            <aside className="w-full lg:w-72 shrink-0 space-y-5">
              <TrendingWidget blogs={TRENDING} />
              <CategoryWidget activeCat={activeCat} onSelect={setActiveCat} allBlogs={BLOGS} />
              <RecentWidget blogs={RECENT} />
              <NewsletterWidget />
            </aside>
          </div>

          {/* ══════════════════════════════════════
              CATEGORY CARDS SECTION
          ══════════════════════════════════════ */}
          {activeCat === 'all' && !search && (
            <section className="mt-16 mb-4" aria-label="ক্যাটাগরি">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 rounded-full" style={{ background: G }} />
                <h2 className="text-xl font-black text-gray-900">বিষয়ভিত্তিক পড়ুন</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CATEGORIES.map((c) => {
                  const count = BLOGS.filter((b) => b.category === c.key).length;
                  return (
                    <button
                      key={c.key}
                      onClick={() => setActiveCat(c.key)}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 text-center group"
                      style={{ background: c.bg, borderColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = c.color + '40'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm" style={{ background: c.color }}>
                        <c.Icon style={{ width:22, height:22, color:'#fff' }} />
                      </div>
                      <div>
                        <p className="text-xs font-black leading-tight" style={{ color: c.color }}>{c.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: c.color, opacity: 0.65 }}>{count}টি পোস্ট</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* ══════════════════════════════════════
            NEWSLETTER
        ══════════════════════════════════════ */}
        <section className="py-16 px-4 mt-8" style={{ background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
          <div className="max-w-2xl mx-auto text-center relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg" style={{ background:'rgba(255,255,255,0.15)' }}>
              <Bell style={{ width:26, height:26, color:'#fff' }} />
            </div>
            <h2 className="font-black text-white mb-3" style={{ fontSize:'clamp(1.4rem,4vw,2rem)' }}>
              নতুন টিপস সরাসরি ইনবক্সে পান
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color:'rgba(255,255,255,0.78)', fontSize:15 }}>
              প্রতি সপ্তাহে হোম সার্ভিসের দরকারি টিপস, সিজনাল গাইড ও বিশেষ অফার পাবেন। কোনো স্প্যাম নেই।
            </p>
            {subDone ? (
              <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-white font-bold" style={{ background:'rgba(255,255,255,0.15)' }}>
                <CheckCircle2 style={{ width:20, height:20 }} /> সাবস্ক্রাইব সম্পন্ন! ধন্যবাদ 🎉
              </div>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => { e.preventDefault(); if (email) setSubDone(true); }}>
                <div className="relative flex-1">
                  <Mail style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#9ca3af' }} />
                  <input
                    type="email" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল লিখুন"
                    className="w-full bg-white rounded-2xl pl-10 pr-4 py-3.5 text-sm font-medium text-gray-800 outline-none shadow-lg"
                  />
                </div>
                <button type="submit"
                  className="font-black text-sm px-6 py-3.5 rounded-2xl transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                  style={{ background:'#fff', color: G, boxShadow:'0 4px 14px rgba(0,0,0,0.15)' }}>
                  সাবস্ক্রাইব করুন
                </button>
              </form>
            )}
            <p className="mt-4 text-xs" style={{ color:'rgba(255,255,255,0.5)' }}>
              🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FAQ
        ══════════════════════════════════════ */}
        <section className="py-16 px-4 bg-white" aria-label="সচরাচর জিজ্ঞাসা">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-3" style={{ background:'#dcfce7', color: G }}>
                সচরাচর জিজ্ঞাসা
              </span>
              <h2 className="font-black text-gray-900 mb-3" style={{ fontSize:'clamp(1.4rem,4vw,1.9rem)' }}>
                হোম সার্ভিস নিয়ে সাধারণ প্রশ্ন
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">বাংলাদেশে হোম সার্ভিস বুকিং নিয়ে সবচেয়ে বেশি জিজ্ঞেস করা প্রশ্নের উত্তর।</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i}
                  className="rounded-2xl border transition-all overflow-hidden"
                  style={{ borderColor: openFaq === i ? `${G}30` : '#f3f4f6', background: openFaq === i ? '#f0fdf4' : '#fff' }}>
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}>
                    <span className="font-bold text-sm text-gray-800 leading-snug">{faq.q}</span>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={{ background: openFaq === i ? G : '#f3f4f6', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                      <ChevronRight style={{ width:14, height:14, color: openFaq === i ? '#fff' : '#6b7280', transform:'rotate(90deg)' }} />
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <div className="h-px mb-4" style={{ background:`${G}20` }} />
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA
        ══════════════════════════════════════ */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
              style={{ background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
              <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
              <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
              <div className="relative">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_,i) => <Star key={i} style={{ width:18, height:18, fill:'#fbbf24', color:'#fbbf24' }} />)}
                </div>
                <h2 className="font-black text-white mb-3" style={{ fontSize:'clamp(1.5rem,4vw,2.1rem)' }}>
                  বিশ্বস্ত কারিগর খুঁজছেন?
                </h2>
                <p className="mb-8 leading-relaxed" style={{ color:'rgba(255,255,255,0.8)', fontSize:15, maxWidth:480, margin:'0 auto 2rem' }}>
                  NID যাচাইকৃত, রিভিউ দেখা, সরাসরি যোগাযোগ — কারিগরিতে বাংলাদেশের সেরা কারিগর খুঁজুন। কোনো কমিশন নেই।
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/browse"
                    className="inline-flex items-center gap-2 font-black text-sm px-8 py-4 rounded-2xl transition-all hover:opacity-90 active:scale-95"
                    style={{ background:'#fff', color: G, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
                    এখনই সার্ভিস বুক করুন <ArrowRight style={{ width:16, height:16 }} />
                  </Link>
                  <Link to="/register"
                    className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-2xl border-2 border-white text-white transition-all hover:bg-white"
                    style={{}}
                    onMouseEnter={(e) => { e.currentTarget.style.color = G; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#fff'; }}>
                    কারিগর হিসেবে যোগ দিন
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function AuthorChip({ author, date }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
        style={{ background: G }}>
        {author.avatar}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-700 leading-none">{author.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-none">{date}</p>
      </div>
    </div>
  );
}

function ReadMore({ slug }) {
  return (
    <Link to={`/blog/${slug}`}
      className="inline-flex items-center gap-1 text-xs font-black rounded-full px-3 py-1.5 transition-all hover:gap-2"
      style={{ background:'#f0fdf4', color: G }}>
      পড়ুন <ArrowRight style={{ width:12, height:12 }} />
    </Link>
  );
}

function SmallFeaturedCard({ blog }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group flex">
      <BlogImage blog={blog} style={{ width:90, minHeight:90, flexShrink:0 }} />
      <div className="p-3.5 flex flex-col justify-between flex-1 min-w-0">
        <div>
          <CategoryBadge catKey={blog.category} small />
          <h3 className="font-bold text-gray-900 text-xs leading-snug mt-1.5 line-clamp-2 group-hover:text-green-700 transition-colors">
            <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Clock style={{ width:10, height:10, color:'#9ca3af' }} />
          <span className="text-xs text-gray-400">{blog.readTime}</span>
          <span className="ml-auto"><ReadMore slug={blog.slug} /></span>
        </div>
      </div>
    </article>
  );
}

function BlogCard({ blog }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col">
      <BlogImage blog={blog} style={{ height:160 }} />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          <CategoryBadge catKey={blog.category} small />
          <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
            <Eye style={{ width:10, height:10 }} /> {blog.views}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-green-700 transition-colors flex-1">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{blog.excerpt}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background: G }}>
              {blog.author.avatar}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 leading-none">{blog.author.name}</p>
              <p className="text-xs text-gray-400 leading-none mt-0.5 flex items-center gap-1">
                <Calendar style={{ width:9, height:9 }} /> {blog.date}
              </p>
            </div>
          </div>
          <ReadMore slug={blog.slug} />
        </div>
      </div>
    </article>
  );
}

function TrendingWidget({ blogs = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
        <TrendingUp style={{ width:16, height:16, color:'#ef4444' }} />
        <h3 className="font-black text-sm text-gray-900">ট্রেন্ডিং পোস্ট</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {blogs.map((blog, i) => (
          <Link key={blog.id} to={`/blog/${blog.slug}`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
            <span className="font-black text-2xl shrink-0 leading-none mt-0.5"
              style={{ color: i === 0 ? '#ef4444' : i === 1 ? '#f97316' : '#9ca3af', minWidth:24, textAlign:'center' }}>
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{blog.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <CategoryBadge catKey={blog.category} small />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye style={{ width:9, height:9 }} /> {blog.views}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategoryWidget({ activeCat, onSelect, allBlogs = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
        <Filter style={{ width:15, height:15, color: G }} />
        <h3 className="font-black text-sm text-gray-900">ক্যাটাগরি</h3>
      </div>
      <div className="p-3 space-y-1">
        {CATEGORIES.map((c) => {
          const count = allBlogs.filter((b) => b.category === c.key).length;
          const active = activeCat === c.key;
          return (
            <button key={c.key} onClick={() => onSelect(c.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left"
              style={{ background: active ? c.bg : 'transparent' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: active ? c.color : '#f3f4f6' }}>
                <c.Icon style={{ width:13, height:13, color: active ? '#fff' : '#9ca3af' }} />
              </div>
              <span className="text-xs font-bold flex-1" style={{ color: active ? c.color : '#374151' }}>{c.label}</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-md" style={{ background: active ? c.color + '20' : '#f3f4f6', color: active ? c.color : '#9ca3af' }}>{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RecentWidget({ blogs = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
        <Clock style={{ width:15, height:15, color:'#8b5cf6' }} />
        <h3 className="font-black text-sm text-gray-900">সাম্প্রতিক পোস্ট</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {blogs.map((blog) => (
          <Link key={blog.id} to={`/blog/${blog.slug}`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
            <BlogImage blog={blog} style={{ width:44, height:44, borderRadius:10, flexShrink:0 }} />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{blog.title}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock style={{ width:9, height:9 }} /> {blog.readTime}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NewsletterWidget() {
  const [em, setEm] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div className="rounded-2xl p-5 text-center" style={{ background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
      <Bell style={{ width:24, height:24, color:'#fff', margin:'0 auto 10px' }} />
      <h3 className="font-black text-white text-sm mb-1">নিউজলেটার সাবস্ক্রাইব</h3>
      <p className="text-xs mb-4" style={{ color:'rgba(255,255,255,0.72)' }}>নতুন আর্টিকেল সরাসরি ইমেইলে পান</p>
      {done ? (
        <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
          <CheckCircle2 style={{ width:14, height:14 }} /> সাবস্ক্রাইব সম্পন্ন!
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); if (em) setDone(true); }}>
          <input type="email" required value={em} onChange={(e) => setEm(e.target.value)}
            placeholder="ইমেইল লিখুন"
            className="w-full rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none mb-2 bg-white" />
          <button type="submit" className="w-full text-xs font-black py-2.5 rounded-xl transition-all hover:opacity-90"
            style={{ background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)' }}>
            সাবস্ক্রাইব করুন ✉️
          </button>
        </form>
      )}
    </div>
  );
}
