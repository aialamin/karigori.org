import { Helmet } from 'react-helmet-async';
import { ShieldCheck, AlertTriangle, Phone, CheckCircle2 } from 'lucide-react';

const sections = [
  {
    num: '১',
    title: 'প্ল্যাটফর্মের ভূমিকা',
    body: `কারিগরি (karigori.org) শুধুমাত্র একটি সংযোগকারী (Marketplace/Directory) প্ল্যাটফর্ম হিসেবে কাজ করে।\n\nআমাদের প্ল্যাটফর্মে তালিকাভুক্ত সকল কর্মী স্বাধীন ব্যক্তি বা প্রতিষ্ঠান। কারিগরি কোনো কর্মীকে সরাসরি নিয়োগ, নিয়ন্ত্রণ বা পরিচালনা করে না।`,
  },
  {
    num: '২',
    title: 'কর্মী যাচাইকরণ (Verification)',
    body: `আমরা কর্মীদের পরিচয়, যোগাযোগের তথ্য এবং কিছু প্রয়োজনীয় তথ্য যাচাই করার সর্বোচ্চ চেষ্টা করি, যাতে ব্যবহারকারীরা আরও ভালো অভিজ্ঞতা পান।\n\nতবে, কর্মী যাচাইকরণ কোনোভাবেই শতভাগ নিরাপত্তা, সততা, দক্ষতা বা কাজের মানের নিশ্চয়তা প্রদান করে না। সেবা গ্রহণের আগে ব্যবহারকারীদের নিজ দায়িত্বে যাচাই করার জন্য বিশেষভাবে অনুরোধ করা হচ্ছে।`,
  },
  {
    num: '৩',
    title: 'দায়-দায়িত্ব সীমাবদ্ধতা',
    body: `কারিগরি (karigori.org), এর মালিক, টিম, কর্মচারী, সহযোগী বা অংশীদার কোনো অবস্থাতেই নিচের বিষয়ের জন্য দায়ী থাকবে না:`,
    bullets: [
      'কাজের নিম্নমান বা অসম্পূর্ণ কাজ',
      'সম্পদের ক্ষতি',
      'দুর্ঘটনা বা শারীরিক ক্ষতি',
      'প্রতারণা, চুরি বা অসদাচরণ',
      'আর্থিক ক্ষতি',
      'ব্যবহারকারী ও কর্মীর মধ্যে বিরোধ',
      'সেবা গ্রহণ বা যোগাযোগের ফলে ঘটে যাওয়া যেকোনো অনাকাঙ্ক্ষিত ঘটনা',
    ],
    footer: 'কারিগরি প্ল্যাটফর্ম ব্যবহার সম্পূর্ণ আপনার নিজ দায়িত্ব ও ঝুঁকিতে (Use at Your Own Risk)।',
  },
  {
    num: '৪',
    title: 'নিরাপত্তা নির্দেশনা',
    body: 'আপনার নিরাপত্তার জন্য অনুগ্রহ করে:',
    bullets: [
      'কর্মীর পরিচয় যাচাই করুন',
      'অজানা ব্যক্তির সাথে যোগাযোগে সতর্ক থাকুন',
      'ঘরে প্রবেশের আগে তথ্য নিশ্চিত করুন',
      'সম্পূর্ণ অগ্রিম অর্থ প্রদান থেকে বিরত থাকুন',
      'সম্ভব হলে পূর্বের কাজ বা রিভিউ দেখুন',
      'মূল্য ও কাজের শর্ত আগে থেকেই পরিষ্কার করুন',
    ],
    footer: 'অজানা ব্যক্তির সাথে যোগাযোগ ও সেবা গ্রহণের ক্ষেত্রে সর্বোচ্চ সতর্কতা অবলম্বন করুন।',
  },
  {
    num: '৫',
    title: 'ব্যবহারকারীর দায়িত্ব',
    body: `কোনো কর্মীকে নির্বাচন, যোগাযোগ, নিয়োগ, পেমেন্ট বা সেবা গ্রহণের সম্পূর্ণ সিদ্ধান্ত ও দায় ব্যবহারকারীর নিজস্ব।\n\nকারিগরি কোনো আর্থিক লেনদেন, ব্যক্তিগত চুক্তি বা কাজের ফলাফলের জন্য দায়বদ্ধ নয়।`,
  },
  {
    num: '৬',
    title: 'জরুরি পরিস্থিতি',
    body: `কারিগরি জরুরি সেবা প্রদান করে না।\n\nবিদ্যুৎ শর্ট সার্কিট, আগুনের ঝুঁকি, গ্যাস লিক, বড় ধরনের পাইপ লিক বা বিপজ্জনক পরিস্থিতিতে দ্রুত স্থানীয় জরুরি সেবা বা লাইসেন্সধারী বিশেষজ্ঞের সাথে যোগাযোগ করুন।`,
  },
  {
    num: '৭',
    title: 'শর্তাবলীতে সম্মতি',
    body: `কারিগরি (karigori.org) ব্যবহার করার মাধ্যমে আপনি নিশ্চিত করছেন যে আপনি এই ডিসক্লেইমার ও নিরাপত্তা নীতিমালা পড়েছেন, বুঝেছেন এবং এতে সম্মতি প্রদান করেছেন।\n\nএই প্ল্যাটফর্ম ব্যবহার সম্পূর্ণ আপনার নিজ দায়িত্ব ও ঝুঁকিতে।`,
  },
];

const safetyTips = [
  'কর্মীর পরিচয় যাচাই করুন',
  'সম্পূর্ণ অগ্রিম অর্থ প্রদান থেকে বিরত থাকুন',
  'মূল্য ও কাজের শর্ত আগে থেকেই পরিষ্কার করুন',
  'কাজ শেষ হওয়ার পরে পেমেন্ট করুন',
  'সম্ভব হলে পূর্বের রিভিউ দেখুন',
  'অজানা ব্যক্তিকে একা না রাখুন',
];

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Helmet>
        <title>দায়মুক্তি বিবৃতি | কারিগরি</title>
        <meta name="description" content="কারিগরি প্ল্যাটফর্মের দায়মুক্তি বিবৃতি। আমাদের সেবা ব্যবহারের শর্ত ও সীমাবদ্ধতা সম্পর্কে জানুন।" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://karigori.org/disclaimer" />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-700 to-emerald-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-5 backdrop-blur-sm border border-white/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 font-bn leading-snug">
            ডিসক্লেইমার ও নিরাপত্তা নীতিমালা
          </h1>
          <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            স্বাগতম <strong className="text-white">কারিগরি (karigori.org)</strong>-এ। এই প্ল্যাটফর্ম ব্যবহার করার আগে
            অনুগ্রহ করে নিচের বিষয়গুলো মনোযোগ সহকারে পড়ুন।
          </p>
          <div className="mt-5 inline-block bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs text-white/80">
            সর্বশেষ আপডেট: জুন ২০২৫
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">

        {/* Intro card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-600 leading-relaxed text-sm">
            <strong>কারিগরি</strong> এমন একটি ডিজিটাল প্ল্যাটফর্ম যেখানে আপনি আপনার নিকটস্থ ইলেকট্রিশিয়ান,
            প্লাম্বার, এসি টেকনিশিয়ান, মিস্ত্রি, মেকানিক এবং অন্যান্য দক্ষ কর্মী সহজেই খুঁজে পেতে পারেন।
            আমাদের উদ্দেশ্য হলো দক্ষ কর্মী ও গ্রাহকদের মধ্যে সহজ সংযোগ তৈরি করা।
          </p>
        </div>

        {/* Numbered sections */}
        {sections.map((s) => (
          <div key={s.num} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-sm font-extrabold text-brand-600 font-bn">{s.num}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-extrabold text-gray-900 mb-3 font-bn">{s.title}</h2>
                {s.body && s.body.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
                ))}
                {s.bullets && (
                  <ul className="space-y-2 my-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {s.footer && (
                  <p className="text-sm font-semibold text-gray-800 mt-3 pt-3 border-t border-gray-100">{s.footer}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Safety warning box */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-extrabold text-amber-900 text-lg font-bn">⚠️ নিরাপত্তা সতর্কতা</h2>
          </div>
          <p className="text-amber-800 text-sm leading-relaxed mb-4">
            <strong>কারিগরি</strong> কর্মীদের তথ্য যাচাই করার চেষ্টা করে, তবে কোনোভাবেই শতভাগ নিরাপত্তা নিশ্চিত
            করা সম্ভব নয়। সেবা গ্রহণের আগে অনুগ্রহ করে নিজ দায়িত্বে যাচাই করুন এবং অজানা ব্যক্তির সাথে
            যোগাযোগের ক্ষেত্রে সর্বোচ্চ সতর্কতা অবলম্বন করুন।
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {safetyTips.map((tip) => (
              <div key={tip} className="flex items-start gap-2 text-sm text-amber-800">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 mb-1">জরুরি পরিস্থিতিতে</h3>
            <p className="text-sm text-red-700 leading-relaxed">
              বিদ্যুৎ শর্ট সার্কিট, গ্যাস লিক বা বিপজ্জনক পরিস্থিতিতে <strong>কারিগরি</strong>-তে যোগাযোগ করবেন না।
              দ্রুত <strong>ফায়ার সার্ভিস: ১৬১৬৩</strong> বা <strong>জাতীয় জরুরি সেবা: ৯৯৯</strong>-এ কল করুন।
            </p>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 text-center">
          <ShieldCheck className="w-8 h-8 text-brand-600 mx-auto mb-3" />
          <p className="text-sm text-brand-800 leading-relaxed">
            <strong>কারিগরি (karigori.org)</strong> ব্যবহার করার মাধ্যমে আপনি নিশ্চিত করছেন যে আপনি এই
            ডিসক্লেইমার ও নিরাপত্তা নীতিমালা পড়েছেন, বুঝেছেন এবং এতে সম্মতি প্রদান করেছেন।
          </p>
          <p className="text-xs text-brand-600 font-bold mt-2">
            এই প্ল্যাটফর্ম ব্যবহার সম্পূর্ণ আপনার নিজ দায়িত্ব ও ঝুঁকিতে।
          </p>
        </div>
      </div>
    </div>
  );
}
