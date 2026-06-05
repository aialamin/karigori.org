import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">

      {/* Main footer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-8 justify-between">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-extrabold font-bn text-lg">কারিগরি</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-bn">
              ঢাকার বিশ্বস্ত লোকাল সার্ভিস প্ল্যাটফর্ম — প্লাম্বার, ইলেক্ট্রিশিয়ান,
              ক্লিনার ও অন্যান্য দক্ষ কারিগর খুঁজে পান।
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-2 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">প্ল্যাটফর্ম</p>
              <Link to="/browse"   className="block hover:text-white transition-colors font-bn">ব্রাউজ করুন</Link>
              <Link to="/register" className="block hover:text-white transition-colors font-bn">রেজিস্টার করুন</Link>
              <Link to="/login"    className="block hover:text-white transition-colors font-bn">সাইন ইন</Link>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">তথ্য</p>
              <Link to="/disclaimer" className="block hover:text-white transition-colors font-bn flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 shrink-0" /> ডিসক্লেইমার
              </Link>
              <a href="/disclaimer" className="block hover:text-white transition-colors font-bn">শর্তাবলী</a>
              <a href="/disclaimer" className="block hover:text-white transition-colors font-bn">প্রাইভেসি পলিসি</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p className="font-bn">© ২০২৬ কারিগরি (karigori.org) — ঢাকা থেকে নির্মিত</p>
          <p className="font-bn">সার্ভিস পেতে সম্পূর্ণ বিনামূল্যে · কোনো কমিশন নেই</p>
        </div>
      </div>
    </footer>
  );
}
