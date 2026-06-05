import { Phone, CreditCard, Briefcase, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

/*
 * Verification Levels:
 *   0 — Unverified      (hidden from search)
 *   1 — Phone Verified
 *   2 — ID Verified
 *   3 — Skilled Verified
 *   4 — Trusted Professional
 */

const LEVELS = [
  { level: 0, label: 'Unverified',           Icon: null,        cls: 'bg-gray-100 text-gray-500 border-gray-200',    dot: 'bg-gray-400',   bar: 'bg-gray-300'  },
  { level: 1, label: 'Phone Verified',        Icon: Phone,       cls: 'bg-yellow-50 text-yellow-700 border-yellow-300', dot: 'bg-yellow-400', bar: 'bg-yellow-400' },
  { level: 2, label: 'ID Verified',           Icon: CreditCard,  cls: 'bg-blue-50 text-blue-700 border-blue-300',     dot: 'bg-blue-500',   bar: 'bg-blue-500'  },
  { level: 3, label: 'Skilled Verified',      Icon: Briefcase,   cls: 'bg-purple-50 text-purple-700 border-purple-300',dot: 'bg-purple-500', bar: 'bg-purple-500'},
  { level: 4, label: 'Trusted Professional',  Icon: Award,       cls: 'bg-amber-50 text-amber-700 border-amber-300',  dot: 'bg-amber-500',  bar: 'bg-amber-500' },
];

export const LEVEL_INFO = LEVELS;

export function getLevelInfo(level = 0) {
  return LEVELS[Math.min(4, Math.max(0, level))] ?? LEVELS[0];
}

/* ── Small inline chip badge ── */
export function VerificationBadge({ level = 0, size = 'sm' }) {
  if (level === 0) return null;
  const info = getLevelInfo(level);
  const { Icon } = info;
  const iconSz = size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  const textSz = size === 'xs' ? 'text-[10px] px-1.5 py-0.5 gap-1' : 'text-[11px] px-2 py-0.5 gap-1';

  return (
    <span className={`inline-flex items-center font-bold rounded-full border ${info.cls} ${textSz}`}>
      {Icon && <Icon className={`${iconSz} shrink-0`} />}
      <span>{info.label}</span>
    </span>
  );
}

/* ── Row of earned badges (profile page) ── */
export function BadgeRow({ level = 0 }) {
  const earned = LEVELS.slice(1).filter((l) => l.level <= level);
  if (!earned.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {earned.map((l) => (
        <span key={l.level}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${l.cls}`}>
          {l.Icon && <l.Icon className="w-3 h-3 shrink-0" />}
          {l.label}
        </span>
      ))}
    </div>
  );
}

/* ── Full progress card (worker dashboard) ── */
export function VerificationProgress({ level = 0, otpVerified = false, nidFront = '', nidBack = '', selfie = '' }) {
  const steps = [
    { l: 1, Icon: Phone,      label: 'Phone Verified (OTP)',                  done: otpVerified },
    { l: 2, Icon: CreditCard, label: 'ID Verified (NID front, back & selfie)', done: !!(nidFront && nidBack && selfie) },
    { l: 3, Icon: Briefcase,  label: 'Skilled Verified (certificates + admin)', done: level >= 3 },
    { l: 4, Icon: Award,      label: 'Trusted Pro (20+ jobs, 4.5+ rating)',    done: level >= 4 },
  ];

  const nextHints = [
    'Verify your phone number with an OTP to appear in search results.',
    'Upload your NID card (front & back) and a selfie holding it.',
    'Add trade certificates and work samples for Skilled verification.',
    'Complete 20+ jobs with a 4.5+ rating to earn Trusted Professional.',
  ];

  const { cls } = getLevelInfo(level);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" /> Verification Status
        </h3>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
          Level {level} — {getLevelInfo(level).label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {LEVELS.slice(1).map((l) => (
          <div key={l.level} className={`flex-1 h-2 rounded-full transition-all ${level >= l.level ? l.bar : 'bg-gray-100'}`} />
        ))}
      </div>

      {/* Checklist */}
      <div className="space-y-2.5">
        {steps.map(({ l, Icon, label, done }) => {
          const active = level >= l;
          return (
            <div key={l} className={`flex items-center gap-3 text-sm ${active ? 'text-gray-800' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                ${done ? 'bg-emerald-500' : active ? getLevelInfo(l).dot + ' opacity-80' : 'bg-gray-100'}`}>
                {done
                  ? <CheckCircle2 className="w-4 h-4 text-white" />
                  : <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-gray-400'}`} />
                }
              </div>
              <span className={active ? 'font-medium' : ''}>{label}</span>
            </div>
          );
        })}
      </div>

      {level < 4 && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5 text-xs text-brand-800">
          <strong>Next step:</strong> {nextHints[level]}
        </div>
      )}
    </div>
  );
}
