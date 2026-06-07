import { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, BadgeCheck, Star } from 'lucide-react';
import { getCategoryInfo } from '../constants.js';
import { CategoryIcon } from './CategoryIcon.jsx';
import { VerificationBadge } from './VerificationBadge.jsx';

function StarsRow({ rating }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={i <= Math.round(rating) ? '#FBBF24' : 'none'}
            stroke={i <= Math.round(rating) ? '#FBBF24' : '#D1D5DB'}
            strokeWidth="1.5" strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

const WorkerCard = memo(function WorkerCard({ worker }) {
  const cat = getCategoryInfo(worker.category);

  return (
    <Link to={`/worker/${worker.phone || worker._id}`}
      className="group block bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden hover:-translate-y-0.5">

      {/* Colour accent top strip */}
      <div className="h-1" style={{ background: cat.color }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={worker.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(worker.name || 'K')}&backgroundColor=006A4E&textColor=ffffff`}
              alt={worker.name}
              loading="lazy"
              decoding="async"
              width="56"
              height="56"
              className="w-14 h-14 rounded-2xl object-cover bg-gray-100"
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(worker.name || 'K')}&backgroundColor=006A4E&textColor=ffffff`;
              }}
            />
            {worker.available && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-trust-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Name + category */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-sm font-bold text-navy-900 truncate">{worker.name}</h3>
              {worker.verified && (
                <BadgeCheck className="w-4 h-4 text-trust-500 shrink-0" />
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: cat.bg, color: cat.color }}>
              <CategoryIcon category={worker.category} size={10} />
              {cat.labelBn || cat.label}
            </span>

            {/* Verification level */}
            <div className="mt-1">
              <VerificationBadge level={worker.verificationLevel || 0} size="xs" />
            </div>
          </div>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 mb-3">
          <StarsRow rating={worker.rating || 0} />
          <span className="text-xs font-bold text-navy-900">{(worker.rating || 0).toFixed(1)}</span>
          <span className="text-xs text-slate-400">({worker.reviewCount || 0} রিভিউ)</span>
        </div>

        {/* Areas */}
        <div className="flex flex-wrap gap-1 mb-3">
          {worker.areas?.slice(0, 2).map((a) => (
            <span key={a} className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              <MapPin className="w-2.5 h-2.5 shrink-0" /> {a}
            </span>
          ))}
          {(worker.areas?.length || 0) > 2 && (
            <span className="text-[10px] text-slate-400 self-center">+{worker.areas.length - 2}</span>
          )}
        </div>

        {/* Footer: exp + rate + CTA */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3 shrink-0" />
            {worker.experience}yr
          </span>
          {worker.hourlyRate && (
            <span className="text-xs font-bold text-navy-900">৳{worker.hourlyRate}/hr</span>
          )}
          <span className="ml-auto inline-flex items-center justify-center gap-1 bg-trust-500 hover:bg-trust-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all">
            বিস্তারিত →
          </span>
        </div>
      </div>
    </Link>
  );
});

export default WorkerCard;
