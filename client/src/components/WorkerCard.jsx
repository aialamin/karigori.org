import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, ChevronRight } from 'lucide-react';
import { getCategoryInfo } from '../constants.js';
import { CategoryIcon } from './CategoryIcon.jsx';
import { VerificationBadge } from './VerificationBadge.jsx';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function WorkerCard({ worker }) {
  const cat = getCategoryInfo(worker.category);

  return (
    <Link
      to={`/worker/${worker._id}`}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Top */}
      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={worker.photo}
            alt={worker.name}
            className="w-14 h-14 rounded-xl object-cover bg-gray-100"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${worker.name}&backgroundColor=006A4E&textColor=ffffff`;
            }}
          />
          {worker.available && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate mb-1">
            {worker.name}
          </h3>

          {/* Category tag */}
          <span
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: cat.bg, color: cat.color }}
          >
            <CategoryIcon category={worker.category} size={11} />
            {cat.label}
          </span>

          {/* Verification badge */}
          <div className="mt-1">
            <VerificationBadge level={worker.verificationLevel || 0} size="xs" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <StarRating rating={worker.rating} />
            <span className="text-xs font-semibold text-gray-700">{worker.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({worker.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Areas */}
      <div className="px-4 pb-3 flex flex-wrap gap-1">
        {worker.areas.slice(0, 3).map((a) => (
          <span key={a} className="inline-flex items-center gap-0.5 text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            <MapPin className="w-2.5 h-2.5" /> {a}
          </span>
        ))}
        {worker.areas.length > 3 && (
          <span className="text-[11px] text-gray-400 px-1 self-center">+{worker.areas.length - 3} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {worker.experience}yr exp
          </span>
          {worker.hourlyRate && (
            <span className="font-semibold text-gray-700">৳{worker.hourlyRate}/hr</span>
          )}
        </div>
        <span className="text-xs font-semibold text-brand-600 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
          View <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
