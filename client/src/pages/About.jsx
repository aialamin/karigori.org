import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck, Star, Clock, MapPin, Users, CheckCircle2,
  Zap, Wrench, Sparkles, ArrowRight, ChevronDown, ChevronUp,
  BadgeCheck, Banknote, HeartHandshake, Phone, Building2, HardHat,
} from 'lucide-react';
import { useState } from 'react';
import { useConfig } from '../context/ConfigContext.jsx';

/* ── FAQ data ── */
const FAQS = [
  {
    q: 'কারিগরি কী?',
    a: 'কারিগরি হলো বাংলাদেশের একটি অনলাইন হোম সার্ভিস মার্কেটপ্লেস। এখানে আপনি প্লাম্বার, ইলেকট্রিশিয়ান, ক্লিনার, এসি মেকানিক, রাজমিস্ত্রি সহ ১১টি ক্যাটাগরিতে যাচাইকৃত কারিগর খুঁজে পাবেন।',
  },
  {
    q: 'ঢাকায় প্লাম্বার বুক করবো কীভাবে?',
    a: 'কারিগরি ওয়েবসাইটে প্রবেশ করুন → "প্লাম্বার" ক্যাটাগরি বেছে নিন → আপনার এলাকা সিলেক্ট করুন → যাচাইকৃত প্লাম্বারের প্রোফাইল দেখুন → সরাসরি যোগাযোগ করুন। পুরো প্রক্রিয়াটি ৫ মিনিটের মধ্যে সম্পন্ন করা সম্ভব।',
  },
  {
    q: 'কারিগরি কি বিনামূল্যে?',
    a: 'হ্যাঁ, কারিগর খোঁজা সম্পূর্ণ বিনামূল্যে। গ্রাহকদের কোনো রেজিস্ট্রেশন ফি বা সার্ভিস চার্জ নেই। কারিগরদের রেজিস্ট্রেশনও সম্পূর্ণ বিনামূল্যে।',
  },
  {
    q: 'কারিগররা কি যাচাইকৃত?',
    a: 'হ্যাঁ। প্রতিটি কারিগর ফোন নম্বর OTP দিয়ে যাচাই করা হয়। Level 2 ব্যাজের জন্য NID ও সেলফি জমা দিতে হয়। সব প্রোফাইল অ্যাডমিন রিভিউয়ের পর অ্যাপ্রুভ হয়।',
  },
  {
    q: 'কোন কোন শহরে সেবা পাওয়া যায়?',
    a: 'বর্তমানে ঢাকা, গাজীপুর, নারায়ণগঞ্জ, চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা, বরিশাল, কুমিল্লা, রংপুরসহ বাংলাদেশের প্রধান শহরগুলোতে সেবা পাওয়া যাচ্ছে।',
  },
  {
    q: 'কারিগর হিসেবে কীভাবে যোগ দেবো?',
    a: '"রেজিস্টার" বাটনে ক্লিক করুন → "সার্ভিস প্রোভাইডার" বেছে নিন → আপনার ট্রেড ক্যাটাগরি ও সেবা এলাকা সিলেক্ট করুন → প্রোফাইল জমা দিন। অ্যাডমিন অ্যাপ্রুভ করলে আপনার প্রোফাইল লাইভ হয়ে যাবে।',
  },
  {
    q: 'কারিগরির সার্ভিসের দাম কত?',
    a: 'প্রতিটি সার্ভিসের আনুমানিক মূল্য আমাদের প্রাইস গাইডে পাওয়া যাবে। প্লাম্বার সার্ভিস সাধারণত ৩০০-১৫০০ টাকা, ইলেকট্রিশিয়ান ৩০০-২০০০ টাকা, এসি সার্ভিসিং ৫০০-৩০০০ টাকার মধ্যে হয়।',
  },
];

/* ── Stats ── */
const STATS = [
  { val: '১,২০০+', label: 'সফল সার্ভিস',      desc: 'সম্পন্ন কাজ',           icon: CheckCircle2, color: '#006A4E', bg: '#dcfce7' },
  { val: '৫০০+',   label: 'যাচাইকৃত কারিগর',  desc: 'NID ও ফোন যাচাইকৃত',  icon: BadgeCheck,   color: '#1d4ed8', bg: '#dbeafe' },
  { val: '২১+',    label: 'শহরে সেবা',          desc: 'সারা বাংলাদেশে',        icon: MapPin,       color: '#7c3aed', bg: '#ede9fe' },
  { val: '৪.৮★',  label: 'গড় রেটিং',          desc: 'গ্রাহক সন্তুষ্টি',     icon: Star,         color: '#b45309', bg: '#fef3c7' },
  { val: '৯৬%',   label: 'সন্তুষ্ট গ্রাহক',   desc: 'পুনরায় বুকিং করেন',   icon: HeartHandshake, color: '#be185d', bg: '#fce7f3' },
  { val: '<১ ঘণ্টা', label: 'রেসপন্স টাইম',  desc: 'গড় উত্তর দেওয়ার সময়', icon: Clock,        color: '#0369a1', bg: '#e0f2fe' },
];

/* ── How it works ── */
const STEPS = [
  { step: '০১', title: 'সার্ভিস বেছে নিন', desc: '১১টি ক্যাটাগরি থেকে আপনার প্রয়োজনীয় সার্ভিস সিলেক্ট করুন — প্লাম্বার, ইলেকট্রিশিয়ান, ক্লিনার বা যেকোনো কারিগর।', icon: Wrench },
  { step: '০২', title: 'এলাকা দিন',        desc: 'আপনার শহর বা উপজেলা সিলেক্ট করুন। কাছের যাচাইকৃত কারিগরদের তালিকা দেখুন।', icon: MapPin },
  { step: '০৩', title: 'প্রোফাইল দেখুন',  desc: 'রেটিং, রিভিউ, অভিজ্ঞতা ও মূল্য দেখে নিজে সিদ্ধান্ত নিন। কোনো লুকানো চার্জ নেই।', icon: Star },
  { step: '০৪', title: 'সরাসরি যোগাযোগ',  desc: 'পছন্দের কারিগরকে সরাসরি কল করুন বা মেসেজ করুন। কাজ শেষে রিভিউ দিন।', icon: Phone },
];

/* ── Trust points ── */
const TRUST = [
  { icon: BadgeCheck,    title: 'NID ও ফোন যাচাই',       desc: 'প্রতিটি কারিগর ফোন OTP ও NID কার্ড দিয়ে পরিচয় যাচাই করা হয়।' },
  { icon: Banknote,      title: 'স্বচ্ছ মূল্য',           desc: 'কোনো লুকানো চার্জ নেই। সার্ভিসের আনুমানিক মূল্য আগেই দেখতে পাবেন।' },
  { icon: Star,          title: 'রিয়েল রিভিউ',            desc: 'প্রতিটি রিভিউ বাস্তব গ্রাহকের। কোনো ফেক রেটিং নেই।' },
  { icon: Clock,         title: 'দ্রুত রেসপন্স',          desc: 'গড়ে ১ ঘণ্টার মধ্যে কারিগর সাড়া দেন। জরুরি কাজে দেরি নেই।' },
  { icon: ShieldCheck,   title: 'অ্যাডমিন অ্যাপ্রুভড',  desc: 'সব প্রোফাইল আমাদের টিম রিভিউ করে। সন্দেহজনক প্রোফাইল বাদ দেওয়া হয়।' },
  { icon: HeartHandshake,title: 'সাপোর্ট',                desc: 'কোনো সমস্যায় আমাদের সাহায্য পাতায় যান। আমরা সাহায্য করতে প্রস্তুত।' },
];

/* ── Coverage cities ── */
const CITIES = [
  { name: 'ঢাকা',          slug: '/dhaka',        kw: 'কারিগর ঢাকা' },
  { name: 'গাজীপুর',        slug: '/gazipur',      kw: 'কারিগর গাজীপুর' },
  { name: 'নারায়ণগঞ্জ',    slug: '/narayanganj',  kw: 'কারিগর নারায়ণগঞ্জ' },
  { name: 'চট্টগ্রাম',      slug: '/chittagong',   kw: 'কারিগর চট্টগ্রাম' },
  { name: 'সিলেট',          slug: '/sylhet',       kw: 'কারিগর সিলেট' },
  { name: 'রাজশাহী',        slug: '/rajshahi',     kw: 'কারিগর রাজশাহী' },
  { name: 'খুলনা',          slug: null,            kw: 'কারিগর খুলনা' },
  { name: 'বরিশাল',         slug: null,            kw: 'কারিগর বরিশাল' },
  { name: 'কুমিল্লা',       slug: null,            kw: 'কারিগর কুমিল্লা' },
  { name: 'রংপুর',          slug: null,            kw: 'কারিগর রংপুর' },
  { name: 'ময়মনসিংহ',      slug: null,            kw: 'কারিগর ময়মনসিংহ' },
  { name: 'টাঙ্গাইল',       slug: null,            kw: 'কারিগর টাঙ্গাইল' },
];

/* ── FAQ item ── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm sm:text-base font-semibold text-gray-900">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-trust-500 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function About() {
  const navigate = useNavigate();
  const { allCategories } = useConfig();

  /* JSON-LD schemas */
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'কারিগরি',
    alternateName: 'Karigori',
    url: 'https://karigori.org',
    logo: 'https://karigori.org/logo.png',
    description: 'বাংলাদেশের বিশ্বস্ত হোম সার্ভিস মার্কেটপ্লেস। যাচাইকৃত প্লাম্বার, ইলেকট্রিশিয়ান, ক্লিনার ও অন্যান্য কারিগর খুঁজে পাওয়ার সহজ উপায়।',
    areaServed: 'Bangladesh',
    foundingLocation: { '@type': 'Place', name: 'Dhaka, Bangladesh' },
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['Bengali', 'English'] },
  };

  const localBizSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'কারিগরি — Karigori',
    description: 'Karigori is Bangladesh\'s trusted local service marketplace connecting customers with verified home service professionals.',
    url: 'https://karigori.org',
    address: { '@type': 'PostalAddress', addressCountry: 'BD', addressLocality: 'Dhaka' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '500', bestRating: '5' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>কারিগরি সম্পর্কে জানুন | বাংলাদেশের বিশ্বস্ত কারিগর প্ল্যাটফর্ম</title>
        <meta name="description" content="কারিগরি হলো বাংলাদেশের #১ হোম সার্ভিস মার্কেটপ্লেস। যাচাইকৃত প্লাম্বার, ইলেকট্রিশিয়ান, ক্লিনার, এসি মেকানিক ও অন্যান্য কারিগর খুঁজুন সহজে।" />
        <meta name="keywords" content="কারিগরি, কারিগর, হোম সার্ভিস, প্লাম্বার ঢাকা, ইলেকট্রিশিয়ান, বাংলাদেশ সার্ভিস, karigori, home service bangladesh" />
        <link rel="canonical" href="https://karigori.org/about" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karigori.org/about" />
        <meta property="og:title" content="কারিগরি সম্পর্কে | Bangladesh Home Service Marketplace" />
        <meta property="og:description" content="বাংলাদেশের বিশ্বস্ত হোম সার্ভিস প্ল্যাটফর্ম। ৫০০+ যাচাইকৃত কারিগর, ২১+ শহরে সেবা।" />
        <meta property="og:image" content="https://karigori.org/og-about.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="কারিগরি — Bangladesh Home Service Marketplace" />
        <meta name="twitter:description" content={`যাচাইকৃত কারিগর খুঁজুন। প্লাম্বার, ইলেকট্রিশিয়ান, ক্লিনার সহ ${allCategories.length || 11}টি সার্ভিস ক্যাটাগরি।`} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBizSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-white">

        {/* ══ 1. HERO ══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-[#003d2b] to-[#006A4E]">
          {/* background pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)', backgroundSize: '50px 50px' }} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-green-300" />
              বাংলাদেশের বিশ্বস্ত কারিগর প্ল্যাটফর্ম
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              বিশ্বস্ত কারিগর খুঁজে পাওয়া<br />
              <span className="text-green-300">এখন আরও সহজ</span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              কারিগরি হলো বাংলাদেশের প্রথম যাচাইকৃত হোম সার্ভিস মার্কেটপ্লেস।
              অপরিচিত কারিগরের উপর অন্ধভাবে ভরসা না করে — রেটিং, রিভিউ ও
              NID যাচাইয়ের মাধ্যমে নিরাপদ কারিগর বেছে নিন।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/browse')}
                className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-300 text-navy-900 font-black px-8 py-4 rounded-full text-base transition-all active:scale-95 shadow-xl shadow-black/20">
                কারিগর খুঁজুন
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full text-base transition-all backdrop-blur-sm">
                কারিগর হিসেবে যোগ দিন
              </button>
            </div>
          </div>
        </section>

        {/* ══ 2. WHAT IS KARIGORI ══════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid sm:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold text-trust-600 uppercase tracking-widest mb-3">কারিগরি কী?</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
                বাংলাদেশের #১ হোম সার্ভিস মার্কেটপ্লেস
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                কারিগরি একটি অনলাইন প্ল্যাটফর্ম যেখানে গ্রাহকরা তাদের
                আশেপাশের <strong>যাচাইকৃত সার্ভিস প্রোভাইডারদের</strong> সাথে
                সরাসরি যোগাযোগ করতে পারেন। প্লাম্বার থেকে শুরু করে ইন্টারনেট
                টেকনিশিয়ান — সব কারিগর একটি জায়গায়।
              </p>
              <p className="text-gray-600 leading-relaxed">
                আগে মানুষ পরিচিতের মাধ্যমে কারিগর খুঁজতেন — যা সময়সাপেক্ষ
                এবং ঝুঁকিপূর্ণ ছিল। কারিগরি সেই সমস্যার সমাধান করেছে
                <strong> স্বচ্ছতা, যাচাই ও রিভিউ সিস্টেমের</strong> মাধ্যমে।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BadgeCheck,  label: `${allCategories.length || 11}টি সার্ভিস ক্যাটাগরি`, color: '#006A4E', bg: '#dcfce7' },
                { icon: MapPin,      label: '২১+ শহরে সেবা',           color: '#1d4ed8', bg: '#dbeafe' },
                { icon: ShieldCheck, label: 'NID যাচাইকৃত কারিগর',   color: '#7c3aed', bg: '#ede9fe' },
                { icon: Star,        label: '৪.৮★ গড় রেটিং',          color: '#b45309', bg: '#fef3c7' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div key={label} className="p-4 rounded-2xl border border-gray-100 text-center" style={{ background: bg }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: color }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-gray-700 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. MISSION ══════════════════════════════════════════════ */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-trust-600 uppercase tracking-widest mb-3">আমাদের লক্ষ্য</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">আমরা কেন কারিগরি তৈরি করেছি?</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  emoji: '🔍',
                  title: 'বিশ্বস্ত কারিগর খোঁজা কঠিন',
                  desc: 'অপরিচিত কারিগরকে ঘরে ডাকা মানে ঝুঁকি নেওয়া। কারিগরি সেই ঝুঁকি কমায় — যাচাইকৃত পরিচয় ও বাস্তব রিভিউর মাধ্যমে।',
                },
                {
                  emoji: '💸',
                  title: 'অযৌক্তিক দাম ও প্রতারণা',
                  desc: 'না জেনে কাজ দিলে অতিরিক্ত চার্জ করা হয়। আমাদের প্রাইস গাইড ও স্বচ্ছ মূল্য কাঠামো গ্রাহকদের রক্ষা করে।',
                },
                {
                  emoji: '👷',
                  title: 'দক্ষ কারিগরদের আয় বাড়ানো',
                  desc: 'দক্ষ কারিগররা কাজ পান না শুধু পরিচিতি না থাকায়। কারিগরি তাদের ডিজিটাল পরিচয় দেয় ও নতুন গ্রাহক এনে দেয়।',
                },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <p className="text-3xl mb-3">{emoji}</p>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 4. HOW IT WORKS ════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-trust-600 uppercase tracking-widest mb-3">কীভাবে কাজ করে</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">মাত্র ৪টি ধাপে কারিগর বুক করুন</h2>
            <p className="text-gray-500 text-sm mt-2">কোনো অ্যাপ ডাউনলোড ছাড়াই, সরাসরি ওয়েবসাইট থেকে</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ step, title, desc, icon: Icon }, i) => (
              <div key={step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-trust-200 to-transparent z-0" />
                )}
                <div className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow z-10">
                  <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-trust-500 tracking-widest">{step}</span>
                  <h3 className="font-bold text-gray-900 mt-1 mb-2 text-sm">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/browse')}
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-full transition-all active:scale-95 shadow-lg">
              এখনই শুরু করুন
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ══ 5. TRUST BLOCK ═════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-navy-900 to-[#006A4E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-green-300 uppercase tracking-widest mb-3">কেন বিশ্বাস করবেন</p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">কারিগরিকে যা আলাদা করে</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TRUST.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-colors">
                  <div className="w-10 h-10 bg-green-400/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-green-300" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 6. STATS ═══════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-trust-600 uppercase tracking-widest mb-3">সংখ্যায় কারিগরি</p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">বিশ্বাসযোগ্যতার প্রমাণ</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STATS.map(({ val, label, desc, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">{val}</p>
                <p className="text-xs font-bold text-gray-700 mt-1">{label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 7. COVERAGE ════════════════════════════════════════════ */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-trust-600 uppercase tracking-widest mb-3">আমাদের কভারেজ</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">বাংলাদেশের প্রধান শহরে সেবা</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
                ঢাকা থেকে চট্টগ্রাম — বড় শহর থেকে জেলা পর্যায়ে কারিগরি সার্ভিস পাওয়া যাচ্ছে।
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {CITIES.map(({ name, slug }) => (
                slug ? (
                  <Link key={name} to={slug}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-trust-400 hover:bg-trust-50 text-gray-700 hover:text-trust-700 text-sm font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {name}
                  </Link>
                ) : (
                  <span key={name}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-400 text-sm font-medium px-4 py-2.5 rounded-full cursor-default">
                    <MapPin className="w-3.5 h-3.5" />
                    {name}
                    <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">শীঘ্রই</span>
                  </span>
                )
              ))}
            </div>
          </div>
        </section>

        {/* ══ 8. FOR KARIGORS ════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid sm:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">কারিগরদের জন্য</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
                আপনার দক্ষতাকে<br />
                <span className="text-trust-600">ডিজিটাল পরিচয় দিন</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                কারিগরিতে বিনামূল্যে রেজিস্ট্রেশন করুন এবং হাজারো গ্রাহকের
                কাছে নিজেকে তুলে ধরুন। প্রোফাইলে রেটিং বাড়লে আরও বেশি কাজ পাবেন।
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'বিনামূল্যে প্রোফাইল তৈরি',
                  'নিজের এলাকা ও দর নির্ধারণ',
                  'সরাসরি গ্রাহকের কাছ থেকে কাজ',
                  'যাচাই ব্যাজ — আস্থা বাড়ে',
                  'সর্বোচ্চ ৩টি ট্রেড ক্যাটাগরি যোগ',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-trust-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 bg-trust-600 hover:bg-trust-700 text-white font-bold px-7 py-3.5 rounded-full transition-all active:scale-95 shadow-md">
                বিনামূল্যে যোগ দিন
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wrench,      label: 'প্লাম্বার',         color: '#006A4E', bg: '#dcfce7' },
                { icon: Zap,         label: 'ইলেকট্রিশিয়ান',    color: '#1d4ed8', bg: '#dbeafe' },
                { icon: Sparkles,    label: 'ক্লিনার',            color: '#7c3aed', bg: '#ede9fe' },
                { icon: Building2,   label: 'কন্ট্রাক্টর',       color: '#0369a1', bg: '#e0f2fe' },
                { icon: HardHat,     label: 'রাজমিস্ত্রি',        color: '#b45309', bg: '#fef3c7' },
                { icon: ShieldCheck, label: 'আরও ৬+ ক্যাটাগরি',  color: '#be185d', bg: '#fce7f3' },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div key={label} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 9. FAQ ═════════════════════════════════════════════════ */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs font-bold text-trust-600 uppercase tracking-widest mb-3">সাধারণ প্রশ্ন</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">কারিগরি নিয়ে সব প্রশ্নের উত্তর</h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} {...faq} />
              ))}
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              আরও প্রশ্ন আছে?{' '}
              <Link to="/help" className="text-trust-600 font-semibold hover:underline">সাহায্য পেজ দেখুন →</Link>
            </p>
          </div>
        </section>

        {/* ══ 10. FINAL CTA ══════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-xs font-bold text-trust-600 uppercase tracking-widest mb-4">এখনই শুরু করুন</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
            আপনার কাজ এখনই<br />
            <span className="text-trust-600">বুক করুন</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            বাংলাদেশের ৫০০+ যাচাইকৃত কারিগর আপনার জন্য অপেক্ষা করছেন।
            বিনামূল্যে খুঁজুন, সরাসরি যোগাযোগ করুন।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/browse')}
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-black px-10 py-4 rounded-full text-base transition-all active:scale-95 shadow-xl">
              সার্ভিস বুক করুন
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-trust-400 hover:bg-trust-50 text-gray-700 hover:text-trust-700 font-bold px-8 py-4 rounded-full text-base transition-all">
              কারিগর হিসেবে যোগ দিন
            </button>
          </div>

          {/* Internal links for SEO */}
          <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs">
            {[
              { to: '/browse/plumber',     label: 'প্লাম্বার খুঁজুন' },
              { to: '/browse/electrician', label: 'ইলেকট্রিশিয়ান খুঁজুন' },
              { to: '/browse/cleaner',     label: 'ক্লিনার খুঁজুন' },
              { to: '/browse/ac_repair',   label: 'এসি মেকানিক খুঁজুন' },
              { to: '/browse/rajmistri',   label: 'রাজমিস্ত্রি খুঁজুন' },
              { to: '/dhaka',              label: 'ঢাকা কারিগর' },
              { to: '/gazipur',            label: 'গাজীপুর কারিগর' },
              { to: '/chittagong',         label: 'চট্টগ্রাম কারিগর' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-gray-400 hover:text-trust-600 hover:underline transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
