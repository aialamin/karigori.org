import { Helmet } from 'react-helmet-async';
import { FileText, CheckCircle2, XCircle, AlertTriangle, Scale, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    icon: CheckCircle2,
    title: 'প্ল্যাটফর্ম ব্যবহারের শর্তাবলী',
    items: [
      'কারিগরি একটি সংযোগকারী প্ল্যাটফর্ম — আমরা সরাসরি কোনো সার্ভিস প্রদান করি না।',
      'প্ল্যাটফর্ম ব্যবহার করতে আপনাকে ১৮ বছর বা তার বেশি বয়সী হতে হবে।',
      'প্রতিটি ব্যবহারকারী তার অ্যাকাউন্টের যাবতীয় কার্যক্রমের জন্য দায়ী।',
      'একই ইমেইল বা ফোন নম্বর দিয়ে একাধিক অ্যাকাউন্ট তৈরি করা নিষিদ্ধ।',
      'মিথ্যা তথ্য দিয়ে রেজিস্ট্রেশন করলে অ্যাকাউন্ট বাতিল করা হবে।',
    ],
  },
  {
    icon: FileText,
    title: 'কারিগরদের জন্য শর্ত',
    items: [
      'কারিগরদের অবশ্যই সত্য তথ্য ও বৈধ জাতীয় পরিচয়পত্র (NID) জমা দিতে হবে।',
      'অ্যাডমিন অনুমোদন ছাড়া কোনো কারিগর প্রোফাইল সার্চ রেজাল্টে দেখা যাবে না।',
      'কারিগর নিজেই তার প্রোফাইল তথ্য আপডেট করতে পারবেন।',
      'মিথ্যা দক্ষতা বা অভিজ্ঞতার দাবি করলে অ্যাকাউন্ট স্থায়ীভাবে বাতিল হবে।',
      'কারিগর সার্ভিসের মান নিজে নিশ্চিত করবেন — কারিগরি এর দায় নেবে না।',
    ],
  },
  {
    icon: XCircle,
    title: 'নিষিদ্ধ কার্যক্রম',
    items: [
      'প্ল্যাটফর্মে স্প্যাম, ভুয়া রিভিউ বা মিথ্যা তথ্য প্রচার করা।',
      'অন্য ব্যবহারকারীর সাথে প্রতারণামূলক আচরণ।',
      'প্ল্যাটফর্মের সিস্টেম বা ডেটাবেজে অননুমোদিত প্রবেশের চেষ্টা।',
      'রিপোর্ট সিস্টেমের অপব্যবহার বা মিথ্যা অভিযোগ দায়ের।',
      'কারিগরি-এর নাম বা লোগো ব্যবহার করে তৃতীয় পক্ষকে বিভ্রান্ত করা।',
    ],
  },
  {
    icon: Scale,
    title: 'দায়-দায়িত্ব',
    items: [
      'কারিগর ও ক্লায়েন্টের মধ্যে যেকোনো বিরোধ তারা নিজেরাই মেটাবেন।',
      'কারিগরি কোনো আর্থিক লেনদেন বা চুক্তির জন্য দায়ী নয়।',
      'সার্ভিসের মান বা ফলাফলের জন্য কারিগরি দায়বদ্ধ নয়।',
      'কারিগরি যেকোনো সময় শর্তাবলী পরিবর্তনের অধিকার রাখে।',
      'পরিবর্তিত শর্তাবলী ওয়েবসাইটে প্রকাশের পর থেকে কার্যকর হবে।',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'অ্যাকাউন্ট বাতিল',
    items: [
      'উপরোক্ত শর্ত লঙ্ঘন করলে বিনা নোটিশে অ্যাকাউন্ট বাতিল করা হতে পারে।',
      '৩ বা তার বেশি ব্যবহারকারী রিপোর্ট এলে অ্যাকাউন্ট স্বয়ংক্রিয়ভাবে ফ্ল্যাগ হবে।',
      'ফ্ল্যাগ হওয়া অ্যাকাউন্ট অ্যাডমিন রিভিউ করে সিদ্ধান্ত নেবেন।',
      'বাতিল অ্যাকাউন্টের বিরুদ্ধে আপিলের জন্য support@karigori.org-এ যোগাযোগ করুন।',
    ],
  },
];

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Helmet>
        <title>সেবার শর্তাবলী | কারিগরি</title>
        <meta name="description" content="কারিগরি প্ল্যাটফর্ম ব্যবহারের নিয়মনীতি ও শর্তাবলী। কারিগর ও ক্লায়েন্ট উভয়ের জন্য প্রযোজ্য।" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://karigori.org/terms" />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> ফিরে যান
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-bn">শর্তাবলী</h1>
              <p className="text-white/70 text-sm font-bn mt-0.5">Terms of Service — karigori.org</p>
            </div>
          </div>
          <p className="text-white/75 text-sm leading-relaxed font-bn">
            কারিগরি ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।
            প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন।
          </p>
          <p className="text-white/50 text-xs mt-3 font-bn">সর্বশেষ আপডেট: জুন ২০২৬</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {SECTIONS.map(({ icon: Icon, title, items }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-extrabold text-gray-900 mb-4 flex items-center gap-3 font-bn">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-gray-600" />
              </div>
              {title}
            </h2>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 font-bn leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Agreement */}
        <div className="bg-gray-900 rounded-2xl p-5 text-center text-white">
          <Scale className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-300 font-bn leading-relaxed">
            কারিগরি ব্যবহার করার মাধ্যমে আপনি নিশ্চিত করছেন যে আপনি এই শর্তাবলী পড়েছেন
            এবং মেনে চলতে সম্মত হয়েছেন।
          </p>
          <p className="text-xs text-gray-500 mt-2 font-bn">
            প্রশ্নের জন্য: support@karigori.org
          </p>
        </div>
      </div>
    </div>
  );
}
