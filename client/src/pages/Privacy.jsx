import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock, Eye, Database, Bell, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    icon: Database,
    title: 'আমরা কী তথ্য সংগ্রহ করি?',
    items: [
      'নাম, ইমেইল ঠিকানা এবং ফোন নম্বর (রেজিস্ট্রেশনের সময়)',
      'কারিগরদের ক্ষেত্রে: পেশাদার তথ্য, সার্ভিস এলাকা, অভিজ্ঞতা',
      'পরিচয় যাচাইয়ের জন্য: জাতীয় পরিচয়পত্র (NID) ছবি',
      'প্রোফাইল ফটো (ঐচ্ছিক)',
      'ব্যবহারকারীর রিভিউ এবং রেটিং',
    ],
  },
  {
    icon: Eye,
    title: 'আমরা কীভাবে তথ্য ব্যবহার করি?',
    items: [
      'প্ল্যাটফর্মে অ্যাকাউন্ট তৈরি ও পরিচালনার জন্য',
      'কারিগরদের পরিচয় যাচাইকরণ (Admin Review) এর জন্য',
      'ক্লায়েন্ট ও কারিগরের মধ্যে যোগাযোগ সহজ করতে',
      'প্ল্যাটফর্মের মান উন্নয়ন ও সুরক্ষার জন্য',
      'প্রয়োজনে ব্যবহারকারীকে গুরুত্বপূর্ণ বিজ্ঞপ্তি পাঠাতে',
    ],
  },
  {
    icon: Lock,
    title: 'তথ্য সুরক্ষা',
    items: [
      'পাসওয়ার্ড এনক্রিপ্ট করে সংরক্ষণ করা হয় (bcrypt hashing)',
      'NID ও পরিচয়পত্রের ছবি শুধুমাত্র অ্যাডমিন দেখতে পারেন',
      'সকল API যোগাযোগ HTTPS/SSL এর মাধ্যমে সুরক্ষিত',
      'JWT টোকেন ব্যবহার করে নিরাপদ অথেনটিকেশন',
      'ডেটাবেস MongoDB Atlas-এ সুরক্ষিতভাবে সংরক্ষিত',
    ],
  },
  {
    icon: Bell,
    title: 'তথ্য শেয়ারিং',
    items: [
      'কারিগরির ফোন নম্বর শুধুমাত্র "Show Phone Number" বাটনে ক্লিক করলেই দেখা যায়',
      'আমরা তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি করি না',
      'আইনগত বাধ্যবাধকতা ছাড়া কোনো তথ্য সরকারি সংস্থাকে দেওয়া হয় না',
      'অ্যাডমিন প্যানেলে শুধুমাত্র অনুমোদিত অ্যাডমিন কারিগরের তথ্য দেখতে পারেন',
    ],
  },
  {
    icon: Mail,
    title: 'আপনার অধিকার',
    items: [
      'আপনি যেকোনো সময় আপনার অ্যাকাউন্ট তথ্য আপডেট করতে পারবেন',
      'অ্যাকাউন্ট মুছে ফেলার অনুরোধ করতে পারবেন',
      'আপনার সম্পর্কে সংরক্ষিত তথ্য জানতে চাইতে পারবেন',
      'যোগাযোগ: support@karigori.org',
    ],
  },
];

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Helmet>
        <title>গোপনীয়তা নীতি | কারিগরি</title>
        <meta name="description" content="কারিগরি আপনার তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষা করে তা জানুন। আমাদের গোপনীয়তা নীতি পড়ুন।" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://karigori.org/privacy" />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-700 to-emerald-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-bn">প্রাইভেসি পলিসি</h1>
              <p className="text-white/70 text-sm font-bn mt-0.5">Privacy Policy — karigori.org</p>
            </div>
          </div>
          <p className="text-white/75 text-sm leading-relaxed font-bn">
            কারিগরি ব্যবহারকারীদের গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই নীতিমালায় আমরা কী তথ্য সংগ্রহ করি,
            কীভাবে ব্যবহার করি এবং কীভাবে সুরক্ষিত রাখি তা বিস্তারিত জানানো হয়েছে।
          </p>
          <p className="text-white/50 text-xs mt-3 font-bn">সর্বশেষ আপডেট: জুন ২০২৬</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {SECTIONS.map(({ icon: Icon, title, items }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-extrabold text-gray-900 mb-4 flex items-center gap-3 font-bn">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-brand-600" />
              </div>
              {title}
            </h2>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 font-bn leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Cookie notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="font-bold text-amber-900 mb-2 font-bn flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" /> কুকি ও লোকাল স্টোরেজ
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed font-bn">
            আমরা লগইন তথ্য মনে রাখতে <strong>localStorage</strong> ব্যবহার করি। এতে আপনার সেশন টোকেন
            সংরক্ষিত থাকে। ব্রাউজার ক্লিয়ার করলে বা সাইন আউট করলে এই তথ্য মুছে যায়।
            আমরা কোনো তৃতীয় পক্ষের ট্র্যাকিং কুকি ব্যবহার করি না।
          </p>
        </div>

        {/* Contact */}
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-brand-800 font-bn">
            প্রাইভেসি সংক্রান্ত যেকোনো প্রশ্নের জন্য যোগাযোগ করুন:{' '}
            <a href="mailto:support@karigori.org" className="font-bold hover:underline">
              support@karigori.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
