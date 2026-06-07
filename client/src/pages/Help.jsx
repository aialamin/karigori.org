/**
 * Help.jsx — Help center / FAQ page
 * Route: /help
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, ChevronRight, HelpCircle, User, Wrench, ShieldCheck,
  Phone, Star, BadgeCheck, ArrowRight, MessageSquare, CheckCircle2,
  AlertCircle, Zap, Clock, Flag, Lightbulb, Send,
} from 'lucide-react';

const G  = '#006A4E';
const GD = '#004d38';

/* ── All Q&A sections ── */
const SECTIONS = [
  {
    id: 'getting-started',
    icon: Search,
    iconBg: '#f0fdf4',
    iconColor: G,
    title: 'শুরু করুন',
    titleEn: 'Getting Started',
    faqs: [
      { q: 'কারিগরি কী?', a: 'কারিগরি বাংলাদেশের #১ লোকাল হোম সার্ভিস মার্কেটপ্লেস। এখানে আপনি প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার, এসি মেকানিক সহ ১০ ধরনের যাচাইকৃত কারিগর খুঁজে পাবেন।' },
      { q: 'কারিগরি কি সম্পূর্ণ বিনামূল্যে?', a: 'হ্যাঁ। কারিগরিতে কারিগর খোঁজা ও তাদের সাথে যোগাযোগ করা সম্পূর্ণ বিনামূল্যে। কোনো বুকিং ফি, সার্ভিস চার্জ বা কমিশন নেই।' },
      { q: 'কোন কোন শহরে সার্ভিস পাওয়া যায়?', a: 'বর্তমানে ঢাকা, গাজীপুর, চট্টগ্রাম, নারায়ণগঞ্জ, সিলেট, রাজশাহী, খুলনা, বরিশাল, ময়মনসিংহ, রংপুরসহ ২১টি শহরে সার্ভিস আছে।' },
      { q: 'কোন কোন সার্ভিস পাওয়া যায়?', a: 'ইলেক্ট্রিশিয়ান, প্লাম্বার, এসি মেকানিক, ক্লিনার, পেইন্টার, কাঠমিস্ত্রি, পেস্ট কন্ট্রোল, CCTV ইনস্টলেশন, ওয়াটার ট্যাংক ক্লিনিং, গ্যাস ফিটার — মোট ১০টি ক্যাটাগরি।' },
      { q: 'অ্যাপ আছে কি?', a: 'কারিগরি একটি PWA (Progressive Web App)। ব্রাউজার থেকে "Add to Home Screen" করলে অ্যাপের মতো ব্যবহার করতে পারবেন।' },
    ],
  },
  {
    id: 'for-clients',
    icon: User,
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
    title: 'ক্লায়েন্টদের জন্য',
    titleEn: 'For Clients',
    faqs: [
      { q: 'কারিগর কীভাবে খুঁজবো?', a: '১) Browse পেজে যান → ২) ক্যাটাগরি বেছে নিন → ৩) এলাকা দিয়ে ফিল্টার করুন → ৪) রেটিং ও Karigor Score দেখুন → ৫) পছন্দের কারিগরকে সরাসরি ফোন করুন।' },
      { q: 'কারিগরের সাথে কীভাবে যোগাযোগ করবো?', a: 'কারিগরের প্রোফাইলে সরাসরি ফোন নম্বর দেওয়া আছে। কোনো চ্যাট বা মধ্যস্থতাকারী নেই — সরাসরি কল করুন।' },
      { q: 'সার্ভিসের দাম কত?', a: 'প্রতিটি কারিগরের প্রোফাইলে আনুমানিক রেট দেওয়া থাকে। কাজ শুরুর আগে কারিগরের সাথে কথা বলে দাম ঠিক করুন। আমাদের Price Guide দেখতে পারেন।' },
      { q: 'কারিগর না আসলে কী করবো?', a: 'কারিগর না আসলে সরাসরি তাকে ফোন করুন। সমস্যা সমাধান না হলে আমাদের সাইটে অন্য কারিগর খুঁজুন। কারিগরের প্রোফাইলে রিপোর্ট করতে পারেন।' },
      { q: 'রিভিউ কীভাবে দেবো?', a: 'কারিগরের প্রোফাইল পেজে গিয়ে "রিভিউ লিখুন" বাটনে ক্লিক করুন। বাস্তব অভিজ্ঞতার ভিত্তিতে রেটিং ও মন্তব্য দিন।' },
      { q: 'ভুয়া কারিগর রিপোর্ট করবো কীভাবে?', a: 'কারিগরের প্রোফাইলে "Report" বাটন আছে। কারণ উল্লেখ করে রিপোর্ট করুন। আমাদের টিম ২৪ ঘণ্টার মধ্যে তদন্ত করবে।' },
    ],
  },
  {
    id: 'for-workers',
    icon: Wrench,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'কারিগরদের জন্য',
    titleEn: 'For Workers',
    faqs: [
      { q: 'কারিগর হিসেবে কীভাবে রেজিস্টার করবো?', a: '১) Register পেজে যান → ২) "কারিগর হিসেবে রেজিস্টার" বেছে নিন → ৩) নাম, ফোন, এলাকা ও ক্যাটাগরি দিন → ৪) প্রোফাইল সম্পূর্ণ করুন → ৫) অ্যাডমিন অনুমোদনের জন্য অপেক্ষা করুন।' },
      { q: 'রেজিস্ট্রেশন কি বিনামূল্যে?', a: 'হ্যাঁ, সম্পূর্ণ বিনামূল্যে। কোনো মাসিক ফি বা কমিশন নেই। কারিগরি একটি ডিরেক্টরি — ক্লায়েন্ট সরাসরি আপনাকে ফোন করবে।' },
      { q: 'প্রোফাইল অনুমোদন কতদিন লাগে?', a: 'সাধারণত ১–৩ কার্যদিবসের মধ্যে অনুমোদন হয়। NID ও ফোন ভেরিফিকেশন দ্রুত অনুমোদনে সাহায্য করে।' },
      { q: 'Karigor Score কী এবং কীভাবে বাড়াবো?', a: 'Karigor Score = ৩০% রেটিং + ২০% কাজের সংখ্যা + ১৫% রেসপন্স টাইম + ১০% পুনরাবৃত্তি + ১০% ভেরিফিকেশন + ১০% সময়মতো + ৫% মূল্য। বেশি কাজ করুন, ভালো রিভিউ পান, দ্রুত রেসপন্ড করুন।' },
      { q: 'ব্যাজ কীভাবে পাবো?', a: '৯০+ স্কোরে 🥇 Gold Karigor, ৭৫+ এ 🥈 Silver, ৬০+ এ 🥉 Bronze। NID যাচাই করলে ⭐ Verified Expert ব্যাজ পাবেন যা বিশ্বাসযোগ্যতা বাড়ায়।' },
      { q: 'প্রোফাইল ফটো আপলোড করবো কীভাবে?', a: 'Dashboard → প্রোফাইল সেকশনে গিয়ে ফটো আপলোড করুন। পরিষ্কার প্রফেশনাল ছবি ব্যবহার করুন — এটি ক্লায়েন্টের বিশ্বাস বাড়ায়।' },
    ],
  },
  {
    id: 'verification',
    icon: ShieldCheck,
    iconBg: '#dcfce7',
    iconColor: G,
    title: 'যাচাইকরণ ও নিরাপত্তা',
    titleEn: 'Verification & Safety',
    faqs: [
      { q: 'কারিগররা কীভাবে যাচাই হয়?', a: 'কারিগরিতে ৩ স্তরের যাচাই: ১) ফোন নম্বর OTP যাচাই ২) NID কার্ড যাচাই ৩) অ্যাডমিন ম্যানুয়াল রিভিউ। প্রোফাইলে ভেরিফিকেশন ব্যাজ দেখে বুঝতে পারবেন।' },
      { q: 'যাচাইকরণ কি সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দেয়?', a: 'না। যাচাইকরণ পরিচয় নিশ্চিত করে কিন্তু সম্পূর্ণ নিরাপত্তার গ্যারান্টি দেয় না। কাজের আগে কারিগরের রেটিং, রিভিউ ও Karigor Score দেখুন।' },
      { q: 'নিরাপদ থাকার জন্য কী করবো?', a: '১) প্রথমবার সার্ভিসে পরিচিত কেউ থাকুন ২) কাজ শুরুর আগে দাম লিখিতভাবে নিন ৩) পরিচয়পত্র দেখতে চাইতে পারেন ৪) মূল্যবান জিনিস নিরাপদ রাখুন।' },
      { q: 'সমস্যা হলে কোথায় অভিযোগ করবো?', a: 'কারিগরের প্রোফাইলে Report বাটন আছে। ৩টি রিপোর্ট জমা হলে অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে পর্যালোচনায় যায়।' },
    ],
  },
  {
    id: 'pricing',
    icon: Star,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    title: 'মূল্য ও পেমেন্ট',
    titleEn: 'Pricing & Payment',
    faqs: [
      { q: 'পেমেন্ট কীভাবে করবো?', a: 'কারিগরিতে কোনো অনলাইন পেমেন্ট নেই। কারিগরের সাথে সরাসরি নগদ, bKash বা যেকোনো পদ্ধতিতে পেমেন্ট করুন।' },
      { q: 'দাম নিয়ে বিতর্ক হলে কী করবো?', a: 'কাজ শুরুর আগেই দাম চূড়ান্ত করুন এবং মেসেজে লিখে রাখুন। পরে বিতর্ক হলে সেই মেসেজ দেখান।' },
      { q: 'প্রাইস গাইড কোথায় পাবো?', a: <span>আমাদের <Link to="/price-guide/electrician" className="text-green-700 font-bold underline">Price Guide</Link> পেজে সব সার্ভিসের আনুমানিক মূল্য তালিকা আছে।</span> },
      { q: 'অতিরিক্ত চার্জ করলে কী করবো?', a: 'কাজ শুরুর আগে দাম ঠিক না করলে এটি ঘটতে পারে। সমস্যা হলে কারিগরের প্রোফাইলে রিপোর্ট করুন এবং অভিজ্ঞতা শেয়ার করতে রিভিউ দিন।' },
    ],
  },
];

const COMPLAINT_TYPES = [
  'অতিরিক্ত চার্জ নিয়েছে',
  'কাজ ঠিকমতো করেনি',
  'সময়মতো আসেনি',
  'অসদাচরণ করেছে',
  'ভুয়া পরিচয়',
  'অন্যান্য',
];

const SUGGESTION_TYPES = [
  'নতুন ফিচার',
  'ডিজাইন উন্নতি',
  'পারফরম্যান্স সমস্যা',
  'সার্ভিস যোগ করা',
  'অন্যান্য',
];

function ComplaintForm() {
  const [form, setForm] = useState({ karigorName:'', phone:'', type:'', desc:'', myPhone:'' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit(e) {
    e.preventDefault();
    if (!form.type || !form.desc.trim()) return;
    setSending(true);
    setTimeout(() => { setSent(true); setSending(false); }, 1200);
  }

  if (sent) return (
    <div className="text-center py-10">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:'#dcfce7' }}>
        <CheckCircle2 className="w-7 h-7" style={{ color: G }} />
      </div>
      <h4 className="text-lg font-black text-gray-900 mb-1">অভিযোগ গ্রহণ করা হয়েছে</h4>
      <p className="text-sm text-slate-500 mb-5">আমাদের টিম ২৪ ঘণ্টার মধ্যে পর্যালোচনা করবে।</p>
      <button onClick={() => { setSent(false); setForm({ karigorName:'', phone:'', type:'', desc:'', myPhone:'' }); }}
        className="text-xs font-bold px-4 py-2 rounded-full border-2 transition-all"
        style={{ borderColor:'#dc2626', color:'#dc2626' }}>
        আরেকটি অভিযোগ করুন
      </button>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">কারিগরের নাম</label>
          <input type="text" placeholder="যেমন: মোঃ করিম"
            value={form.karigorName} onChange={e => set('karigorName', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">কারিগরের ফোন নম্বর</label>
          <input type="tel" placeholder="০১৮XXXXXXXX"
            value={form.phone} onChange={e => set('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">অভিযোগের ধরন <span className="text-red-400">*</span></label>
        <div className="flex flex-wrap gap-2">
          {COMPLAINT_TYPES.map(t => (
            <button key={t} type="button"
              onClick={() => set('type', t)}
              className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all"
              style={form.type === t
                ? { background:'#dc2626', color:'#fff', borderColor:'#dc2626' }
                : { background:'#fff', color:'#374151', borderColor:'#e5e7eb' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">বিস্তারিত বিবরণ <span className="text-red-400">*</span></label>
        <textarea rows={4} required
          placeholder="কী ঘটেছে তা বিস্তারিত লিখুন..."
          value={form.desc} onChange={e => set('desc', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all resize-none" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">আপনার ফোন নম্বর (যোগাযোগের জন্য)</label>
        <input type="tel" placeholder="০১৮XXXXXXXX"
          value={form.myPhone} onChange={e => set('myPhone', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all" />
      </div>

      <button type="submit" disabled={sending || !form.type || !form.desc.trim()}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background:'linear-gradient(135deg,#dc2626 0%,#b91c1c 100%)' }}>
        {sending
          ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" /></svg>
          : <Send className="w-4 h-4" />}
        {sending ? 'পাঠানো হচ্ছে...' : 'অভিযোগ জমা দিন'}
      </button>
      <p className="text-[11px] text-slate-400 text-center">আপনার তথ্য গোপন রাখা হবে।</p>
    </form>
  );
}

function SuggestionForm() {
  const [form, setForm] = useState({ type:'', title:'', desc:'', phone:'' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit(e) {
    e.preventDefault();
    if (!form.desc.trim()) return;
    setSending(true);
    setTimeout(() => { setSent(true); setSending(false); }, 1200);
  }

  if (sent) return (
    <div className="text-center py-10">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:'#fef9c3' }}>
        <Lightbulb className="w-7 h-7" style={{ color:'#ca8a04' }} />
      </div>
      <h4 className="text-lg font-black text-gray-900 mb-1">পরামর্শ পাঠানো হয়েছে!</h4>
      <p className="text-sm text-slate-500 mb-5">আপনার মতামত কারিগরিকে আরও ভালো করতে সাহায্য করবে। ধন্যবাদ!</p>
      <button onClick={() => { setSent(false); setForm({ type:'', title:'', desc:'', phone:'' }); }}
        className="text-xs font-bold px-4 py-2 rounded-full border-2 transition-all"
        style={{ borderColor:'#ca8a04', color:'#ca8a04' }}>
        আরেকটি পরামর্শ দিন
      </button>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">পরামর্শের ধরন</label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTION_TYPES.map(t => (
            <button key={t} type="button"
              onClick={() => set('type', t)}
              className="text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all"
              style={form.type === t
                ? { background:'#ca8a04', color:'#fff', borderColor:'#ca8a04' }
                : { background:'#fff', color:'#374151', borderColor:'#e5e7eb' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">সংক্ষিপ্ত শিরোনাম</label>
        <input type="text" placeholder="যেমন: ডার্ক মোড যোগ করুন"
          value={form.title} onChange={e => set('title', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-50 transition-all" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">বিস্তারিত পরামর্শ <span className="text-red-400">*</span></label>
        <textarea rows={4} required
          placeholder="আপনার পরামর্শ বা আইডিয়া বিস্তারিত লিখুন..."
          value={form.desc} onChange={e => set('desc', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-50 transition-all resize-none" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1.5">ফোন নম্বর (ঐচ্ছিক)</label>
        <input type="tel" placeholder="০১৮XXXXXXXX"
          value={form.phone} onChange={e => set('phone', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-50 transition-all" />
      </div>

      <button type="submit" disabled={sending || !form.desc.trim()}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background:'linear-gradient(135deg,#ca8a04 0%,#a16207 100%)', color:'#fff' }}>
        {sending
          ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" /></svg>
          : <Lightbulb className="w-4 h-4" />}
        {sending ? 'পাঠানো হচ্ছে...' : 'পরামর্শ পাঠান'}
      </button>
      <p className="text-[11px] text-slate-400 text-center">সব মতামত আমরা গুরুত্বের সাথে বিবেচনা করি।</p>
    </form>
  );
}

export default function Help() {
  const [query,   setQuery]   = useState('');
  const [activeId, setActive] = useState(null);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? SECTIONS.map(s => ({ ...s, faqs: s.faqs.filter(f => f.q.toLowerCase().includes(q) || (typeof f.a === 'string' && f.a.toLowerCase().includes(q))) })).filter(s => s.faqs.length > 0)
    : SECTIONS;

  return (
    <>
      <Helmet>
        <title>সাহায্য কেন্দ্র — কারিগরি | Help Center</title>
        <meta name="description" content="কারিগরি সম্পর্কে সব প্রশ্নের উত্তর। কারিগর খোঁজা, রেজিস্ট্রেশন, যাচাইকরণ, মূল্য ও নিরাপত্তা সংক্রান্ত তথ্য।" />
        <link rel="canonical" href="https://karigori.org/help" />
      </Helmet>

      <div className="flex flex-col bg-surface min-h-screen">

        {/* ── Hero ── */}
        <section className="relative text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              <HelpCircle style={{ width: 13, height: 13, color: '#fbbf24' }} />
              সাহায্য কেন্দ্র
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.025em' }}>
              কীভাবে সাহায্য করতে পারি?
            </h1>
            <p className="text-white/70 text-sm sm:text-base mb-8 max-w-md mx-auto">
              কারিগরি সম্পর্কে যেকোনো প্রশ্নের উত্তর এখানে খুঁজুন
            </p>

            {/* Search */}
            <div className="max-w-lg mx-auto">
              <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
                <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="প্রশ্ন লিখুন…"
                  className="flex-1 px-3 py-4 text-gray-900 text-sm font-medium outline-none bg-transparent placeholder-slate-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick links ── */}
        <section style={{ background: GD }} className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id}
                  onClick={() => { setActive(s.id); setQuery(''); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className="shrink-0 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all"
                  style={activeId === s.id ? { background: '#fff', color: G } : { background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                  <Icon style={{ width: 13, height: 13 }} /> {s.title}
                </button>
              );
            })}
          </div>
        </section>

        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">"{query}" সম্পর্কে কোনো উত্তর পাওয়া যায়নি।</p>
              <p className="text-sm mt-2">নিচের ক্যাটাগরিগুলো দেখুন বা সরাসরি আমাদের সাথে যোগাযোগ করুন।</p>
            </div>
          )}

          {filtered.map(section => {
            const Icon = section.icon;
            return (
              <section key={section.id} id={section.id}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: section.iconBg }}>
                    <Icon style={{ width: 20, height: 20, color: section.iconColor }} />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">{section.title}</h2>
                    <p className="text-xs text-slate-400">{section.titleEn}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.faqs.map((faq, i) => (
                    <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all">
                      <summary className="flex items-start justify-between p-4 sm:p-5 cursor-pointer font-semibold text-gray-900 text-sm list-none gap-3">
                        <span className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 mt-0.5"
                            style={{ background: section.iconColor }}>{i + 1}</span>
                          {faq.q}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-open:rotate-90 transition-transform shrink-0 mt-0.5" />
                      </summary>
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-gray-50 pt-3">
                        {typeof faq.a === 'string'
                          ? <p>{faq.a}</p>
                          : faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}

          {/* ── Safety tips banner ── */}
          {!q && (
            <section className="rounded-card p-5 sm:p-6 border" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle style={{ width: 20, height: 20, color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 className="font-black text-amber-900 mb-1">নিরাপত্তা টিপস</h3>
                  <p className="text-sm text-amber-800">কারিগর হায়ার করার আগে এই বিষয়গুলো মনে রাখুন।</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: BadgeCheck,  text: 'ভেরিফিকেশন ব্যাজ ও Karigor Score দেখুন' },
                  { icon: Phone,       text: 'কাজের আগেই ফোনে বিস্তারিত কথা বলুন' },
                  { icon: Star,        text: 'রেটিং ও রিভিউ মনোযোগ দিয়ে পড়ুন' },
                  { icon: Clock,       text: 'প্রথমে ছোট কাজ দিয়ে পরীক্ষা করুন' },
                  { icon: CheckCircle2,text: 'কাজ শুরুর আগে দাম লিখিতভাবে নিন' },
                  { icon: Zap,         text: 'সমস্যায় পড়লে প্রোফাইলে রিপোর্ট করুন' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-amber-800">
                    <Icon style={{ width: 15, height: 15, color: '#d97706', flexShrink: 0 }} />
                    {text}
                  </div>
                ))}
              </div>
              <Link to="/disclaimer" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-amber-700 underline">
                সম্পূর্ণ ডিসক্লেইমার পড়ুন <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </section>
          )}

          {/* ── Still need help ── */}
          {!q && (
            <section className="text-center py-10 bg-white rounded-card border border-gray-100 shadow-card">
              <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: G }} />
              <h3 className="font-black text-gray-900 mb-2">এখনও প্রশ্ন আছে?</h3>
              <p className="text-slate-500 text-sm mb-5 max-w-xs mx-auto">
                সাহায্যের জন্য কারিগরি Browse পেজে যান বা সরাসরি কারিগরের সাথে কথা বলুন।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/browse"
                  className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full text-white transition-all hover:opacity-90"
                  style={{ background: G }}>
                  কারিগর খুঁজুন <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/register"
                  className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: G, color: G }}>
                  কারিগর হিসেবে যোগ দিন
                </Link>
              </div>
            </section>
          )}

          {/* ── Complaint form ── */}
          {!q && (
            <section id="complaint" className="bg-white border border-gray-100 rounded-card shadow-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:'#fee2e2' }}>
                  <Flag className="w-5 h-5" style={{ color:'#dc2626' }} />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-lg">কারিগরের বিরুদ্ধে অভিযোগ</h2>
                  <p className="text-xs text-slate-400 mt-0.5">কোনো কারিগর সমস্যা করলে আমাদের জানান</p>
                </div>
              </div>
              <ComplaintForm />
            </section>
          )}

          {/* ── Suggestion form ── */}
          {!q && (
            <section id="suggestion" className="bg-white border border-gray-100 rounded-card shadow-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:'#fef9c3' }}>
                  <Lightbulb className="w-5 h-5" style={{ color:'#ca8a04' }} />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-lg">অ্যাপ উন্নত করতে পরামর্শ দিন</h2>
                  <p className="text-xs text-slate-400 mt-0.5">আপনার আইডিয়া আমাদের আরও ভালো করতে সাহায্য করে</p>
                </div>
              </div>
              <SuggestionForm />
            </section>
          )}

        </div>

        <div className="h-16 md:hidden" />
      </div>
    </>
  );
}
