/**
 * AllPages.jsx  →  শহরভিত্তিক সেবা
 * Route: /pages
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, CheckCircle2, Send, ChevronRight, Zap, Lock,
  Star, ShieldCheck, ThumbsUp, Users, Wrench, Clock,
} from 'lucide-react';

const G  = '#006A4E';
const GD = '#004d38';

const CITIES = [
  { slug:'dhaka',        nameBn:'ঢাকা'           },
  { slug:'chattogram',   nameBn:'চট্টগ্রাম'       },
  { slug:'gazipur',      nameBn:'গাজীপুর'         },
  { slug:'narayanganj',  nameBn:'নারায়ণগঞ্জ'      },
  { slug:'sylhet',       nameBn:'সিলেট'           },
  { slug:'cumilla',      nameBn:'কুমিল্লা'         },
  { slug:'mymensingh',   nameBn:'ময়মনসিংহ'        },
  { slug:'rajshahi',     nameBn:'রাজশাহী'         },
  { slug:'khulna',       nameBn:'খুলনা'           },
  { slug:'rangpur',      nameBn:'রংপুর'           },
  { slug:'bogura',       nameBn:'বগুড়া'           },
  { slug:'barishal',     nameBn:'বরিশাল'          },
  { slug:'jessore',      nameBn:'যশোর'            },
  { slug:'narsingdi',    nameBn:'নরসিংদী'         },
  { slug:'savar',        nameBn:'সাভার'           },
  { slug:'tongi',        nameBn:'টঙ্গী'           },
  { slug:'coxsbazar',    nameBn:'কক্সবাজার'       },
  { slug:'feni',         nameBn:'ফেনী'            },
  { slug:'tangail',      nameBn:'টাঙ্গাইল'        },
  { slug:'brahmanbaria', nameBn:'ব্রাহ্মণবাড়িয়া' },
  { slug:'keraniganj',   nameBn:'কেরানীগঞ্জ'      },
];


/* ══════════════════════════════════════════════════ */
export default function AllPages() {
  const [form,    setForm]    = useState({ name:'', phone:'', city:'', service:'', msg:'' });
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.city.trim()) return;
    setSending(true);
    setTimeout(() => { setSent(true); setSending(false); }, 1200);
  }

  return (
    <>
      <Helmet>
        <title>শহরভিত্তিক সেবা — কারিগরি | আপনার এলাকায় বিশ্বস্ত কারিগর</title>
        <meta name="description"
          content={`কারিগরি এখন ${CITIES.length}টি শহরে সক্রিয়। প্লাম্বার, ইলেকট্রিশিয়ান, AC সার্ভিস, ক্লিনিংসহ আরও অনেক সেবা এখন আপনার এলাকায়।`} />
        <link rel="canonical" href="https://karigori.org/pages" />
      </Helmet>

      <div className="flex flex-col bg-surface min-h-screen">

        {/* ══ HERO ══ */}
        <section className="relative text-white overflow-hidden"
          style={{ background:`linear-gradient(135deg,${G} 0%,${GD} 100%)` }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-black/10 rounded-full blur-2xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20
              text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap style={{ width:13, height:13, color:'#fbbf24' }} />
              এখন বাংলাদেশের বিভিন্ন শহরে কারিগরি সেবা চালু
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4"
              style={{ letterSpacing:'-0.025em' }}>
              আপনার এলাকায়{' '}
              <span className="text-yellow-300">বিশ্বস্ত কারিগর</span>{' '}
              খুঁজুন
            </h1>

            <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto mb-5 leading-relaxed">
              আপনার বাসা, অফিস বা দোকানের যেকোনো কাজের জন্য এখন সহজেই খুঁজে নিন বিশ্বস্ত ও
              যাচাইকৃত কারিগর। প্লাম্বার, ইলেকট্রিশিয়ান, AC সার্ভিস, ক্লিনিং, CCTV,
              পেইন্টিংসহ আরও অনেক সেবা এখন আপনার এলাকায়।
            </p>

            {/* Hero stats pills */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-8">
              {[
                { val: '২১টি', label: 'সক্রিয় শহর' },
                { val: '৫০০+', label: 'যাচাইকৃত কারিগর' },
                { val: '৬৪',   label: 'জেলা লক্ষ্যমাত্রা' },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white/10 border border-white/15 rounded-2xl py-3 px-2">
                  <p className="text-xl font-black text-yellow-300">{val}</p>
                  <p className="text-[11px] text-white/70 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TRUST STATS ══ */}
        <section className="py-20 border-b border-slate-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">

            {/* Eyebrow */}
            <div className="text-center mb-10">
              <h2 className="section-title">কেন গ্রাহকরা কারিগরিকে বিশ্বাস করেন?</h2>
            </div>

            {/* 6-card grid — 3 col desktop / 2 col mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  icon: Wrench,
                  val: '১,২০০+',
                  badge: '✔ সফল কাজ',
                  title: 'সফল কাজ সম্পন্ন',
                  desc: 'নির্ভরযোগ্য সার্ভিস সারা বাংলাদেশে',
                  accent: G,
                  iconBg: '#f0fdf4',
                },
                {
                  icon: Users,
                  val: '৫০০+',
                  badge: '✔ যাচাইকৃত',
                  title: 'যাচাইকৃত কারিগর',
                  desc: 'NID ও ফোন নম্বর যাচাই করা',
                  accent: '#3b82f6',
                  iconBg: '#eff6ff',
                },
                {
                  icon: Star,
                  val: '৪.৮ ★',
                  badge: '✔ বাস্তব রিভিউ',
                  title: 'গড় গ্রাহক রেটিং',
                  desc: 'বাস্তব ব্যবহারকারীদের রিভিউ থেকে',
                  accent: '#f59e0b',
                  iconBg: '#fffbeb',
                },
                {
                  icon: ThumbsUp,
                  val: '৯৬%',
                  badge: '✔ জরিপ ফলাফল',
                  title: 'সন্তুষ্ট গ্রাহক',
                  desc: 'সার্ভিস পরবর্তী জরিপে ইতিবাচক মতামত',
                  accent: '#10b981',
                  iconBg: '#f0fdf4',
                },
                {
                  icon: Clock,
                  val: '< ১ ঘণ্টা',
                  badge: '✔ দ্রুত সাড়া',
                  title: 'গড় রেসপন্স টাইম',
                  desc: 'কারিগর থেকে দ্রুত যোগাযোগ',
                  accent: '#8b5cf6',
                  iconBg: '#f5f3ff',
                },
                {
                  icon: ShieldCheck,
                  val: '০ টাকা',
                  badge: '✔ সম্পূর্ণ ফ্রি',
                  title: 'কোনো সার্ভিস ফি নেই',
                  desc: 'কোনো লুকানো চার্জ বা কমিশন নেই',
                  accent: '#ef4444',
                  iconBg: '#fff1f2',
                },
              ].map(({ icon: Icon, val, badge, title, desc, accent, iconBg }) => (
                <div key={title}
                  className="group relative bg-white rounded-xl border border-slate-100 p-3.5 sm:p-4
                    flex flex-col gap-2.5 cursor-default overflow-hidden
                    shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]
                    hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
                    transition-all duration-300">

                  {/* Thin top accent */}
                  <div className="absolute top-0 left-5 right-5 h-[3px] rounded-b-full opacity-0
                    group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: accent }} />

                  {/* Icon + badge row */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                      group-hover:scale-110 transition-transform duration-300"
                      style={{ background: iconBg }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                    </div>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: iconBg, color: accent }}>
                      {badge}
                    </span>
                  </div>

                  {/* Number */}
                  <p className="text-xl sm:text-2xl font-bold leading-none tracking-tight text-gray-900">
                    {val}
                  </p>

                  {/* Title + desc */}
                  <div className="mt-auto space-y-0.5">
                    <p className="text-xs font-semibold text-gray-700 leading-snug">{title}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
                  </div>

                  {/* Bottom glow on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 opacity-0
                    group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-b-xl"
                    style={{ background:`linear-gradient(to top, ${accent}08, transparent)` }} />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══ CITY GRID ══ */}
        <section className="py-14 bg-surface">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="section-title">আপনার শহরে সেবা খুঁজুন</h2>
              <p className="section-sub">
                নিচের শহর থেকে আপনার এলাকা নির্বাচন করে স্থানীয় কারিগর দেখুন
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CITIES.map((c) => (
                <Link key={c.slug} to={`/${c.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-2xl bg-white border
                    border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                    group-hover:scale-110 transition-transform" style={{ background:'#f0fdf4' }}>
                    <MapPin className="w-4 h-4" style={{ color: G }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm leading-tight truncate">{c.nameBn}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                      সক্রিয়
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600
                    ml-auto shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ REQUEST FORM ══ */}
        <section className="py-14 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="section-title">আপনার শহরে এখনো সেবা চালু হয়নি?</h2>
              <p className="section-sub mt-2 max-w-md mx-auto leading-relaxed">
                আপনার এলাকায় কারিগর সেবা চালু করতে অনুরোধ করুন।
                আপনার শহরে পর্যাপ্ত কারিগর পাওয়া গেলে আমরা সবার আগে আপনাকে জানাবো।
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-card p-6 sm:p-8">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background:'#dcfce7' }}>
                    <CheckCircle2 className="w-8 h-8" style={{ color: G }} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">অনুরোধ পাঠানো হয়েছে!</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    আপনার শহরে সেবা শুরু হলে সবার আগে আমরা আপনাকে জানাবো। ধন্যবাদ!
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name:'', phone:'', city:'', service:'', msg:'' }); }}
                    className="text-xs font-bold px-5 py-2.5 rounded-full border-2 transition-all"
                    style={{ borderColor: G, color: G }}>
                    আরেকটি অনুরোধ করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1.5">আপনার নাম</label>
                      <input type="text" placeholder="যেমন: মোঃ রাহিম"
                        value={form.name} onChange={e => set('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                          outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1.5">মোবাইল নম্বর</label>
                      <input type="tel" placeholder="০১XXXXXXXXX"
                        value={form.phone} onChange={e => set('phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                          outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">
                      আপনার শহর / উপজেলা <span className="text-red-400">*</span>
                    </label>
                    <input type="text" required
                      placeholder="যেমন: নোয়াখালী, পাবনা, মাদারীপুর"
                      value={form.city} onChange={e => set('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                        outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">কী ধরনের সেবা খুঁজছেন?</label>
                    <input type="text"
                      placeholder="যেমন: প্লাম্বার, ইলেকট্রিশিয়ান, AC সার্ভিস, ক্লিনিং"
                      value={form.service} onChange={e => set('service', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                        outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">অতিরিক্ত তথ্য (ঐচ্ছিক)</label>
                    <textarea rows={3}
                      placeholder="আপনার প্রয়োজন সম্পর্কে বিস্তারিত লিখুন"
                      value={form.msg} onChange={e => set('msg', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                        outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none" />
                  </div>

                  <button type="submit" disabled={sending || !form.city.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl
                      font-black text-sm text-white transition-all active:scale-95
                      disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background:`linear-gradient(135deg,${G} 0%,${GD} 100%)` }}>
                    {sending ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                          strokeDasharray="32" strokeDashoffset="12" />
                      </svg>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sending ? 'পাঠানো হচ্ছে...' : 'অনুরোধ পাঠান'}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    <p className="text-[11px] text-slate-400">
                      আপনার তথ্য নিরাপদ ও সম্পূর্ণ গোপন রাখা হবে। কোনো স্প্যাম নয়।
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <div className="h-16 md:hidden" />
      </div>
    </>
  );
}
