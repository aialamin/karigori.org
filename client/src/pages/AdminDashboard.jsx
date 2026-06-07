import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, CheckCircle2, Clock, XCircle, BarChart3, Check, X,
  RefreshCw, ChevronDown, ChevronUp, MapPin, Phone, BadgeCheck,
  CreditCard, FileText, Star, StickyNote, Calendar, Mail,
  ShieldCheck, AlertCircle, ZoomIn, ShieldAlert, Upload, Download,
  Flag, AlertTriangle, Eye, MousePointerClick, Search as SearchIcon, TrendingUp,
  LayoutGrid, Zap, Heart, Radio, EyeOff,
} from 'lucide-react';
import { getLevelInfo } from '../components/VerificationBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCategoryInfo } from '../constants.js';
import { CategoryIcon, ICON_OPTIONS } from '../components/CategoryIcon.jsx';
import AdminBlogManager from '../components/AdminBlogManager.jsx';

/* ── Image lightbox ── */
function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" onClick={onClose}>
      <img src={src} alt="Document preview" className="max-h-[90vh] max-w-full rounded-xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ── Document thumbnail ── */
function DocThumb({ src, label }) {
  const [lightbox, setLightbox] = useState(false);
  if (!src) return (
    <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
      <FileText className="w-6 h-6" />
      <span className="text-[10px] font-semibold">{label}</span>
      <span className="text-[10px]">Not uploaded</span>
    </div>
  );
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(src);
  return (
    <>
      <button onClick={() => setLightbox(true)}
        className="group flex flex-col items-center gap-1.5 p-3 bg-gray-50 hover:bg-brand-50 rounded-xl border-2 border-gray-200 hover:border-brand-400 transition-all text-gray-600 hover:text-brand-700">
        {isImage ? (
          <div className="relative">
            <img src={src} alt={label} className="w-16 h-12 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
              <ZoomIn className="w-4 h-4 text-white" />
            </div>
          </div>
        ) : (
          <FileText className="w-6 h-6" />
        )}
        <span className="text-[10px] font-semibold">{label}</span>
      </button>
      {lightbox && <Lightbox src={src} onClose={() => setLightbox(false)} />}
    </>
  );
}

/* ── Status badge ── */
const STATUS = {
  pending:  { cls: 'bg-amber-100 text-amber-700 border-amber-300',   dot: 'bg-amber-400',   label: 'Pending' },
  approved: { cls: 'bg-emerald-100 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500', label: 'Approved' },
  rejected: { cls: 'bg-red-100 text-red-700 border-red-300',          dot: 'bg-red-500',     label: 'Rejected' },
};

/* ── Worker detail panel (expanded inline) ── */
function WorkerDetail({ workerId, token, onAction }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminNote, setNote]  = useState('');
  const [rejNote, setRejNote] = useState('');
  const [acting, setActing]   = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/workers/${workerId}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setData(d); setNote(d.worker?.adminNote || ''); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [workerId]);

  async function api(url, body) {
    return fetch(url, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json());
  }

  async function handleApprove(targetLevel) {
    setActing('approve');
    await api(`/api/admin/workers/${workerId}/approve`, { note: adminNote, targetLevel });
    setActing(''); onAction();
  }
  async function handleReject() {
    setActing('reject');
    await api(`/api/admin/workers/${workerId}/reject`, { note: rejNote, adminNote });
    setActing(''); onAction();
  }
  async function handleReupload() {
    setActing('reupload');
    await api(`/api/admin/workers/${workerId}/request-reupload`, { note: rejNote || 'Please re-upload your documents.' });
    setActing(''); onAction();
  }
  async function handleFlag() {
    setActing('flag');
    const w = data?.worker;
    await api(`/api/admin/workers/${workerId}/flag`, { flag: !w?.flagged, reason: rejNote || 'Flagged by admin' });
    setActing(''); onAction();
  }
  async function saveNote() {
    setActing('note');
    await api(`/api/admin/workers/${workerId}/note`, { note: adminNote });
    setActing('');
  }

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <RefreshCw className="w-5 h-5 text-gray-300 animate-spin" />
    </div>
  );
  if (!data) return <p className="p-6 text-sm text-gray-400">Failed to load details.</p>;

  const { worker: w, user } = data;
  const cat    = getCategoryInfo(w.category);
  const status = STATUS[w.status] || STATUS.pending;

  return (
    <div className="border-t border-gray-100 bg-gray-50">
      <div className="p-5 space-y-5">

        {/* ── Top: photo + identity ── */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="shrink-0">
            <img
              src={w.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${w.name}&backgroundColor=006A4E&textColor=ffffff`}
              alt={w.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
            />
          </div>
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {[
              { icon: Phone,    label: 'Phone',      val: w.phone },
              { icon: Mail,     label: 'Email',      val: w.email || user?.email || '—' },
              { icon: Calendar, label: 'Registered', val: new Date(w.createdAt).toLocaleDateString('en-BD') },
              { icon: Clock,    label: 'Experience', val: `${w.experience} year${w.experience !== 1 ? 's' : ''}` },
              { icon: MapPin,   label: 'Areas',      val: w.areas?.join(', ') || '—' },
              { icon: Star,     label: 'Rate',        val: w.hourlyRate ? `৳${w.hourlyRate}/hr` : '—' },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">{label}</span>
                  <span className="text-gray-800 font-medium text-xs break-all">{val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        {w.bio && (
          <div className="bg-white rounded-xl border border-gray-200 p-3.5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Bio</p>
            <p className="text-sm text-gray-700 leading-relaxed">{w.bio}</p>
          </div>
        )}

        {/* ── NID + documents ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Identity Documents
          </p>

          {w.nidNumber && (
            <div className="flex items-center gap-2 mb-3 text-sm">
              <span className="text-gray-400 text-xs font-semibold">NID Number:</span>
              <span className="font-bold text-gray-800 tracking-wide">{w.nidNumber}</span>
              {w.nidFront && w.nidBack
                ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Both sides uploaded</span>
                : <span className="flex items-center gap-1 text-amber-600 text-xs font-bold"><AlertCircle className="w-3.5 h-3.5" /> Incomplete</span>
              }
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <DocThumb src={w.nidFront}  label="NID Front" />
            <DocThumb src={w.nidBack}   label="NID Back" />
            {(w.certificates || []).map((c, i) => (
              <DocThumb key={i} src={c} label={`Certificate ${i + 1}`} />
            ))}
            {!w.nidFront && !w.nidBack && (w.certificates || []).length === 0 && (
              <div className="col-span-2 sm:col-span-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                No documents uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* ── Admin note (private) ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <StickyNote className="w-3.5 h-3.5" /> Internal Admin Note <span className="font-normal">(not visible to worker)</span>
          </p>
          <textarea
            value={adminNote} onChange={(e) => setNote(e.target.value)} rows={3}
            placeholder="Add a private note about this worker…"
            className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 outline-none resize-none focus:border-brand-500 transition-colors placeholder-gray-400"
          />
          <button onClick={saveNote} disabled={acting === 'note'}
            className="mt-2 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors flex items-center gap-1 disabled:opacity-50">
            {acting === 'note' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <StickyNote className="w-3.5 h-3.5" />}
            {acting === 'note' ? 'Saving…' : 'Save note'}
          </button>
        </div>

        {/* ── Verification Level Actions ── */}
        <div className="space-y-3">

          {/* Current level header */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Review Actions</p>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getLevelInfo(w.verificationLevel).cls}`}>
              Current: L{w.verificationLevel} — {getLevelInfo(w.verificationLevel).label}
            </span>
          </div>

          {/* Shared note input */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Note / Reason <span className="normal-case font-normal">(shown to worker on reject or re-upload request)</span>
            </p>
            <input value={rejNote} onChange={(e) => setRejNote(e.target.value)}
              placeholder="e.g. NID photo is unclear, please re-upload…"
              className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 outline-none
                focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all placeholder-gray-300" />
          </div>

          {/* Approve to level — vertical list, clear labels */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Approve to Level</p>
            {[
              { level: 1, label: 'Phone Verified',  sub: 'OTP confirmed',                    Icon: Phone,      bg: 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-200' },
              { level: 2, label: 'ID Verified',      sub: 'NID + selfie approved',             Icon: CreditCard, bg: 'bg-blue-500   hover:bg-blue-600   disabled:bg-blue-200'   },
              { level: 3, label: 'Skilled Verified', sub: 'Certificates + trade approved',    Icon: BadgeCheck, bg: 'bg-purple-500 hover:bg-purple-600 disabled:bg-purple-200' },
              { level: 4, label: 'Trusted Pro',      sub: '20+ jobs, 4.5+ rating',            Icon: Star,       bg: 'bg-amber-500  hover:bg-amber-600  disabled:bg-amber-200'  },
            ].map(({ level, label, sub, Icon, bg }) => {
              const done = w.verificationLevel >= level;
              return (
                <button key={level}
                  onClick={() => handleApprove(level)}
                  disabled={!!acting || done}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all
                    ${done ? 'bg-gray-100 text-gray-400 cursor-default' : bg}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${done ? 'bg-gray-200' : 'bg-white/20'}`}>
                    {acting === 'approve' && !done
                      ? <RefreshCw className="w-4 h-4 animate-spin" />
                      : done
                        ? <CheckCircle2 className={`w-4 h-4 ${done ? 'text-gray-400' : 'text-white'}`} />
                        : <Icon className="w-4 h-4" />
                    }
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-tight ${done ? 'text-gray-500' : 'text-white'}`}>
                      Level {level} — {label}
                    </p>
                    <p className={`text-xs mt-0.5 ${done ? 'text-gray-400' : 'text-white/70'}`}>{sub}</p>
                  </div>
                  {done && (
                    <span className="text-[10px] font-bold text-gray-400 shrink-0">Done</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Danger actions */}
          <div className="pt-1 border-t border-gray-100 space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Other Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleReupload} disabled={!!acting}
                className="flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200
                  disabled:opacity-50 text-orange-700 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                {acting === 'reupload' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 shrink-0" />}
                Re-upload
              </button>
              <button onClick={handleFlag} disabled={!!acting}
                className={`flex items-center justify-center gap-2 border text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50
                  ${w.flagged
                    ? 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600'
                    : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'}`}>
                {acting === 'flag' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
                {w.flagged ? 'Unflag' : 'Flag'}
              </button>
            </div>
            <button onClick={handleReject} disabled={!!acting}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
              {acting === 'reject' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5 shrink-0" />}
              Reject Account
            </button>
          </div>
        </div>

        {w.status !== 'idle' && w.reviewedAt && (
          <div className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold ${status.cls}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} />
            {status.label}
            <span className="font-normal text-xs ml-auto">{new Date(w.reviewedAt).toLocaleString('en-BD')}</span>
          </div>
        )}
        {w.rejectionNote && (
          <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
            <strong>Rejection reason:</strong> {w.rejectionNote}
          </div>
        )}

        {/* User reports */}
        {w.reports?.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-xs font-bold text-orange-700 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> User Reports ({w.reports.length})
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
              {w.reports.map((r, i) => (
                <div key={i} className="bg-white rounded-lg p-2.5 text-xs border border-orange-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-orange-700">{r.reason}</span>
                    <span className="text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.details && <p className="text-gray-600">{r.details}</p>}
                  {r.reporterEmail && r.reporterEmail !== 'anonymous' && (
                    <p className="text-gray-400 mt-0.5">By: {r.reporterEmail}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Worker summary row ── */
function WorkerRow({ worker, token, onRefresh }) {
  const [open, setOpen] = useState(false);
  const cat    = getCategoryInfo(worker.category);
  const status = STATUS[worker.status] || STATUS.pending;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Summary row */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
        <img
          src={worker.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${worker.name}&backgroundColor=006A4E&textColor=ffffff`}
          alt={worker.name} className="w-11 h-11 rounded-xl object-cover bg-gray-100 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm truncate">{worker.name}</span>
            {worker.verified && <BadgeCheck className="w-4 h-4 text-brand-600 shrink-0" />}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: cat.bg, color: cat.color }}>
              <CategoryIcon category={worker.category} size={10} />{cat.label}
            </span>
            <span className="text-xs text-gray-400">{worker.phone}</span>
            {worker.experience && <span className="text-xs text-gray-400">{worker.experience}yr exp</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Verification level pill */}
          <span className={`hidden sm:flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelInfo(worker.verificationLevel || 0).cls}`}>
            L{worker.verificationLevel || 0}
          </span>

          {/* Flagged */}
          {worker.flagged && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-bold border border-red-200">
              <Flag className="w-2.5 h-2.5 shrink-0" /> Flagged
            </span>
          )}

          {/* Reports */}
          {worker.reportCount > 0 && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-bold border border-orange-200">
              <AlertTriangle className="w-2.5 h-2.5 shrink-0" /> {worker.reportCount} report{worker.reportCount !== 1 ? 's' : ''}
            </span>
          )}

          {/* NID indicator */}
          {(worker.nidFront && worker.nidBack)
            ? <span className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                <CreditCard className="w-2.5 h-2.5 shrink-0" /> NID
                <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
              </span>
            : <span className="hidden sm:flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                <CreditCard className="w-2.5 h-2.5 shrink-0" /> NID missing
              </span>
          }
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && <WorkerDetail workerId={worker._id} token={token} onAction={() => { setOpen(false); onRefresh(); }} />}
    </div>
  );
}

/* ── Client row ── */
function ClientRow({ client }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-sm font-bold text-blue-600">
          {client.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{client.name}</p>
          <p className="text-xs text-gray-400 truncate">{client.email}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-xs text-gray-400">
          {client.area && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{client.area}</span>}
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            { label: 'Full Name',   val: client.name },
            { label: 'Email',       val: client.email },
            { label: 'Phone',       val: client.phone || '—' },
            { label: 'Area',        val: client.area  || '—' },
            { label: 'Registered',  val: new Date(client.createdAt).toLocaleDateString('en-BD') },
            { label: 'Role',        val: 'Client' },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
              <p className="text-gray-800 font-medium text-xs mt-0.5 break-all">{val}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────── Analytics Panel ────── */
function AnalyticsPanel({ token }) {
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(true);
  const [period, setPeriod] = useState('today');
  const [activeChart, setActiveChart] = useState('pageViews');

  useEffect(() => {
    fetch('/api/analytics/summary', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json()).then(setData).catch(() => {}).finally(() => setLoad(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="w-6 h-6 text-gray-300 animate-spin" /></div>;
  if (!data)   return <p className="text-center py-12 text-gray-400">Analytics data unavailable</p>;

  const d = period === 'today' ? data.today : period === 'monthly' ? data.monthly : data.yearly;

  const STAT_COLS = [
    { icon: Eye,              label: 'Page Views',      val: d?.pageViews      || 0, color: '#2563eb',  bg: '#eff6ff',  key: 'pageViews' },
    { icon: Users,            label: 'Visitors',        val: d?.uniqueVisitors || 0, color: '#7c3aed',  bg: '#f5f3ff',  key: 'uniqueVisitors' },
    { icon: MousePointerClick,label: 'Phone Clicks',    val: d?.phoneClicks    || 0, color: '#006A4E',  bg: '#f0fdf4',  key: 'phoneClicks' },
    { icon: SearchIcon,       label: 'Searches',        val: d?.searches       || 0, color: '#d97706',  bg: '#fffbeb',  key: 'searches' },
    { icon: BarChart3,        label: 'Worker Views',    val: d?.workerViews    || 0, color: '#0891b2',  bg: '#ecfeff',  key: 'workerViews' },
    { icon: TrendingUp,       label: 'Donations (৳)',   val: d?.donations      || 0, color: '#be123c',  bg: '#fff1f2',  key: 'donations' },
  ];

  /* Fake donation summary for UI (real data comes from backend) */
  const DONATION_SUMMARY = {
    total:   d?.donations       || 0,
    count:   d?.donationCount   || 0,
    avg:     d?.donationAvg     || 0,
    bkash:   d?.donationBkash   || 0,
    nagad:   d?.donationNagad   || 0,
    rocket:  d?.donationRocket  || 0,
  };

  return (
    <div className="space-y-4">
      {/* Period tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[['today','আজকে'], ['monthly','৩০ দিন'], ['yearly','১ বছর']].map(([k, lbl]) => (
          <button key={k} onClick={() => setPeriod(k)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${period === k ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Stat cards — 2 col on mobile, 3 col on sm, 6 col on lg */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAT_COLS.map(({ icon: Icon, label, val, color, bg, key }) => (
          <button key={label} onClick={() => setActiveChart(key)}
            className="bg-white rounded-2xl border shadow-sm p-3 sm:p-4 text-center transition-all hover:shadow-md"
            style={{ borderColor: activeChart === key ? color : '#f3f4f6', boxShadow: activeChart === key ? `0 0 0 2px ${color}30` : undefined }}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mx-auto mb-1.5 sm:mb-2" style={{ background: bg }}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{val.toLocaleString()}</div>
            <div className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 leading-tight">{label}</div>
          </button>
        ))}
      </div>

      {/* Chart */}
      {data.chartData?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-bold text-gray-900 text-sm">
              {STAT_COLS.find((s) => s.key === activeChart)?.label} — গত ৩০ দিন
            </h3>
            <div className="flex gap-1.5">
              {STAT_COLS.slice(0, 4).map((s) => (
                <button key={s.key} onClick={() => setActiveChart(s.key)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                  style={activeChart === s.key ? { background: s.color, color:'#fff' } : { background:'#f3f4f6', color:'#6b7280' }}>
                  {s.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-0.5 sm:gap-1 h-28 sm:h-36 overflow-x-auto">
            {data.chartData.map((row) => {
              const val = row[activeChart] ?? row.pageViews ?? 0;
              const max = Math.max(...data.chartData.map((x) => x[activeChart] ?? x.pageViews ?? 0), 1);
              const pct = (val / max) * 100;
              const col = STAT_COLS.find((s) => s.key === activeChart)?.color || '#006A4E';
              return (
                <div key={row.date} className="flex flex-col items-center gap-0.5 flex-1 min-w-[12px] sm:min-w-[18px] group"
                  title={`${row.date}: ${val}`}>
                  <div className="w-full rounded-t-sm transition-all"
                    style={{ height:`${Math.max(pct, 2)}%`, background: col, opacity: 0.85 }} />
                  <span className="text-[7px] sm:text-[8px] text-gray-300 hidden sm:block">
                    {row.date?.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Donation breakdown card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:'#fff1f2' }}>
            <Heart className="w-4 h-4" style={{ color:'#be123c' }} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">ডোনেশন সারসংক্ষেপ</h3>
          <span className="text-xs text-gray-400 ml-auto">{period === 'today' ? 'আজকে' : period === 'monthly' ? '৩০ দিন' : '১ বছর'}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: 'মোট ডোনেশন', val: `৳${DONATION_SUMMARY.total.toLocaleString()}`, color:'#be123c' },
            { label: 'ডোনার সংখ্যা', val: DONATION_SUMMARY.count, color:'#7c3aed' },
            { label: 'গড় ডোনেশন',   val: `৳${DONATION_SUMMARY.avg}`, color:'#d97706' },
          ].map(({ label, val, color }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background:'#f9fafb' }}>
              <p className="text-lg font-extrabold" style={{ color }}>{val || '০'}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        {/* Payment method breakdown */}
        <div className="space-y-2">
          {[
            { label:'bKash',  val: DONATION_SUMMARY.bkash,  color:'#E2136E', pct: DONATION_SUMMARY.total ? Math.round(DONATION_SUMMARY.bkash/DONATION_SUMMARY.total*100) : 0 },
            { label:'Nagad',  val: DONATION_SUMMARY.nagad,  color:'#F7941D', pct: DONATION_SUMMARY.total ? Math.round(DONATION_SUMMARY.nagad/DONATION_SUMMARY.total*100) : 0 },
            { label:'Rocket', val: DONATION_SUMMARY.rocket, color:'#8B1A8B', pct: DONATION_SUMMARY.total ? Math.round(DONATION_SUMMARY.rocket/DONATION_SUMMARY.total*100) : 0 },
          ].map(({ label, val, color, pct }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs font-bold w-14 shrink-0" style={{ color }}>{label}</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background: color }} />
              </div>
              <span className="text-xs text-gray-500 font-bold w-10 text-right">৳{val || 0}</span>
              <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 italic">* ডোনেশন ট্র্যাকিং ক্লায়েন্ট ড্যাশবোর্ড থেকে আসে।</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
        <strong>নোট:</strong> প্রতিটি পেজ ভিজিট ও ফোন ক্লিক স্বয়ংক্রিয়ভাবে ট্র্যাক হয়। আইপি অ্যাড্রেস থেকে ইউনিক ভিজিটর গণনা করা হয়।
      </div>
    </div>
  );
}

/* ────── Excel Bulk Upload ────── */
function ExcelUpload({ token }) {
  const fileRef = useRef(null);
  const [file,     setFile]    = useState(null);
  const [preview,  setPreview] = useState(null);
  const [result,   setResult]  = useState(null);
  const [loading,  setLoad]    = useState(false);
  const [error,    setError]   = useState('');

  async function handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    setFile(f); setPreview(null); setResult(null); setError('');
    setLoad(true);
    try {
      const fd = new FormData(); fd.append('file', f); fd.append('preview', 'true');
      const res = await fetch('/api/bulk/workers', {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setPreview(data);
    } catch { setError('Upload failed'); }
    finally { setLoad(false); }
  }

  async function handleInsert() {
    if (!file) return;
    setLoad(true); setError('');
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/bulk/workers', {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setResult(data); setPreview(null); setFile(null);
    } catch { setError('Insert failed'); }
    finally { setLoad(false); }
  }

  async function downloadTemplate() {
    const res = await fetch('/api/bulk/template', { headers: { Authorization: `Bearer ${token()}` } });
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'karigori_workers_template.xlsx'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Excel Bulk Worker Upload
        </h3>
        <p className="text-sm text-blue-800 mb-3 font-bn">
          এক্সেল ফাইলে একাধিক কারিগরের তথ্য একসাথে আপলোড করুন।
          প্রথমে টেমপ্লেট ডাউনলোড করুন, তথ্য পূরণ করুন, তারপর আপলোড করুন।
        </p>
        <button onClick={downloadTemplate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
          <Download className="w-4 h-4" /> Download Template (.xlsx)
        </button>
      </div>

      {/* Columns guide */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Required Columns</p>
        <div className="flex flex-wrap gap-2">
          {['Name *','Phone *','Email','Category *','Areas *','Experience','HourlyRate','Bio','Languages'].map((col) => (
            <span key={col} className={`text-xs px-2.5 py-1 rounded-full font-semibold ${col.includes('*') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600'}`}>
              {col}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Categories: plumber | electrician | cleaner | bua | painter | ac_repair | carpenter | gas_fitter</p>
        <p className="text-xs text-gray-400">Areas: comma-separated, e.g. "Gazipur Sadar, Tongi"</p>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-brand-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-gray-50 hover:bg-brand-50">
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="font-semibold text-gray-600">{file ? file.name : 'Click to upload Excel file'}</p>
        <p className="text-xs text-gray-400 mt-1">.xlsx, .xls, .csv — max 20MB</p>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
      </div>

      {loading && <div className="flex justify-center py-4"><RefreshCw className="w-5 h-5 text-brand-600 animate-spin" /></div>}
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>}

      {/* Preview */}
      {preview && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Preview</h3>
            <div className="flex gap-3 text-sm">
              <span className="text-emerald-600 font-semibold">{preview.valid} valid</span>
              {preview.errors.length > 0 && <span className="text-red-500 font-semibold">{preview.errors.length} errors</span>}
            </div>
          </div>

          {preview.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 space-y-1 max-h-32 overflow-y-auto">
              {preview.errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          {preview.sample?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {['Name','Phone','Category','Areas','Experience'].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-bold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {preview.sample.map((w, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium text-gray-900">{w.name}</td>
                      <td className="px-3 py-2 text-gray-600">{w.phone}</td>
                      <td className="px-3 py-2 text-gray-600">{w.category}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-[120px] truncate">{w.areas?.join(', ')}</td>
                      <td className="px-3 py-2 text-gray-600">{w.experience}yr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.valid > preview.sample.length && (
                <p className="text-xs text-gray-400 mt-2 px-3">…and {preview.valid - preview.sample.length} more rows</p>
              )}
            </div>
          )}

          <button onClick={handleInsert} disabled={loading || preview.valid === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Import {preview.valid} Workers
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-emerald-800 text-lg">{result.inserted} workers imported!</p>
          {result.errors?.length > 0 && <p className="text-sm text-amber-600 mt-1">{result.errors.length} rows had errors</p>}
          <button onClick={() => { setResult(null); setFile(null); }} className="mt-3 text-sm text-brand-600 font-semibold hover:underline">Upload another file</button>
        </div>
      )}
    </div>
  );
}

/* ────── Settings tab — category & area manager ────── */
function SettingsPanel({ token }) {
  const [extraCategories, setExtraCats] = useState([]);
  const [extraAreas,      setExtraAreas] = useState([]);
  const [catForm, setCatForm] = useState({
    key: '', label: '', labelBn: '', color: '#006A4E', bg: '#e6f4ef', iconName: 'Wrench',
  });
  const [iconSearch,   setIconSearch]   = useState('');
  const [areaInput,    setAreaInput]    = useState('');
  const [areaSearch,   setAreaSearch]   = useState('');
  const [saving,       setSaving]       = useState('');
  const [msg,          setMsg]          = useState('');

  /* Notice state */
  const [notice, setNotice] = useState({ active: false, title: '', subtitle: '', message: '', type: 'info', layout: 'modal' });
  const [noticeSaving, setNoticeSaving] = useState(false);
  const [noticeMsg,    setNoticeMsg]    = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => {
        setExtraCats(d.extraCategories || []);
        setExtraAreas(d.extraAreas || []);
        if (d.notice) setNotice({ active: false, title: '', subtitle: '', message: '', type: 'info', layout: 'modal', ...d.notice });
      })
      .catch(() => {});
  }, []);

  const auth = (url, opts = {}) =>
    fetch(url, { headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json', ...opts.headers }, ...opts })
      .then((r) => r.json());

  async function addCategory() {
    if (!catForm.key.trim() || !catForm.label.trim()) return;
    setSaving('cat');
    const d = await auth('/api/config/categories', { method: 'POST', body: JSON.stringify(catForm) });
    if (d.extraCategories) {
      setExtraCats(d.extraCategories);
      setCatForm({ key: '', label: '', labelBn: '', color: '#006A4E', bg: '#e6f4ef', iconName: 'Wrench' });
      setIconSearch('');
      setMsg('✓ Category added!');
    }
    setSaving(''); setTimeout(() => setMsg(''), 3000);
  }
  async function deleteCategory(key) {
    const d = await auth(`/api/config/categories/${key}`, { method: 'DELETE' });
    if (d.extraCategories) setExtraCats(d.extraCategories);
  }
  async function addArea() {
    if (!areaInput.trim()) return;
    setSaving('area');
    const d = await auth('/api/config/areas', { method: 'POST', body: JSON.stringify({ area: areaInput.trim() }) });
    if (d.extraAreas) { setExtraAreas(d.extraAreas); setAreaInput(''); setMsg('✓ Area added!'); }
    setSaving(''); setTimeout(() => setMsg(''), 3000);
  }
  async function deleteArea(area) {
    const d = await auth('/api/config/areas', { method: 'DELETE', body: JSON.stringify({ area }) });
    if (d.extraAreas) setExtraAreas(d.extraAreas);
  }

  async function saveNotice() {
    if (!notice.title.trim() || !notice.message.trim()) {
      setNoticeMsg('⚠️ Title and message are required.');
      setTimeout(() => setNoticeMsg(''), 3000);
      return;
    }
    setNoticeSaving(true);
    const d = await auth('/api/config/notice', { method: 'PUT', body: JSON.stringify(notice) });
    if (d.notice) {
      setNotice({ active: false, title: '', subtitle: '', message: '', type: 'info', layout: 'modal', ...d.notice });
      setNoticeMsg(d.notice.active ? '✓ Notice published!' : '✓ Notice hidden.');
    } else {
      setNoticeMsg('✗ Save failed — check server.');
    }
    setNoticeSaving(false); setTimeout(() => setNoticeMsg(''), 3000);
  }

  const filteredIcons = iconSearch
    ? ICON_OPTIONS.filter((i) => i.name.toLowerCase().includes(iconSearch.toLowerCase()))
    : ICON_OPTIONS;

  const filteredAreas = areaSearch
    ? extraAreas.filter((a) => a.toLowerCase().includes(areaSearch.toLowerCase()))
    : extraAreas;

  const selectedIconEntry = ICON_OPTIONS.find((i) => i.name === catForm.iconName) || ICON_OPTIONS[0];
  const SelectedIcon = selectedIconEntry.Icon;

  const NOTICE_TYPES = [
    { value: 'info',    label: 'Info (Blue)',      color: '#2563eb' },
    { value: 'success', label: 'Success (Green)',  color: '#006A4E' },
    { value: 'warning', label: 'Warning (Yellow)', color: '#d97706' },
    { value: 'urgent',  label: 'Urgent (Red)',      color: '#e11d48' },
  ];

  return (
    <div className="space-y-6">
      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {msg}
        </div>
      )}

      {/* ══ Site Notice ══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-amber-500" /> Site Notice / বিজ্ঞপ্তি
          </h3>
          {/* Active toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-semibold text-gray-500">{notice.active ? 'Active' : 'Hidden'}</span>
            <div
              onClick={() => setNotice((n) => ({ ...n, active: !n.active }))}
              className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${notice.active ? 'bg-green-600' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notice.active ? 'left-5' : 'left-0.5'}`} />
            </div>
          </label>
        </div>

        <p className="text-xs text-gray-400">This notice will appear as a modal popup on the first page load for each visitor (once per session).</p>

        {/* Type selector */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Notice Type</label>
          <div className="flex gap-2 flex-wrap">
            {NOTICE_TYPES.map((t) => (
              <button key={t.value} type="button"
                onClick={() => setNotice((n) => ({ ...n, type: t.value }))}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all ${notice.type === t.value ? 'text-white border-transparent' : 'text-gray-500 border-gray-200 hover:border-gray-300'}`}
                style={notice.type === t.value ? { background: t.color } : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Layout selector ── */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            Display Layout <span className="text-gray-300 normal-case font-normal">(কীভাবে দেখাবে)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              /* ── MODAL ── */
              {
                key: 'modal', label: 'Modal Popup', labelBn: 'সেন্টার মোডাল',
                preview: (
                  /* Phone frame */
                  <div className="h-28 rounded-xl overflow-hidden border border-gray-200 relative flex flex-col" style={{ background: '#f1f5f9' }}>
                    {/* Blurred backdrop tint */}
                    <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.45)' }} />
                    {/* Page content behind */}
                    <div className="absolute inset-0 flex flex-col gap-1 p-2 pointer-events-none">
                      <div className="h-2 w-10 rounded bg-gray-300/40" />
                      <div className="h-1.5 w-16 rounded bg-gray-300/30" />
                      <div className="h-1.5 w-12 rounded bg-gray-300/30" />
                    </div>
                    {/* Centered modal card */}
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden" style={{ maxWidth: 120 }}>
                        {/* Colored top bar */}
                        <div className="h-5 flex items-center gap-1 px-2" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
                          <div className="w-2.5 h-2.5 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                            <div className="w-1 h-1 rounded-full bg-white/80" />
                          </div>
                          <div className="flex-1 h-1 bg-white/50 rounded" />
                          <div className="w-2 h-2 rounded-sm bg-white/20 shrink-0" />
                        </div>
                        {/* Body */}
                        <div className="px-2 py-1.5 space-y-1">
                          <div className="w-3/4 h-1.5 bg-gray-800 rounded" />
                          <div className="w-full h-1 bg-gray-200 rounded" />
                          <div className="w-5/6 h-1 bg-gray-200 rounded" />
                          <div className="w-2/3 h-1 bg-gray-200 rounded" />
                          {/* Timer arc hint */}
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="w-6 h-1.5 rounded-full" style={{ background: '#2563eb' }} />
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-200" style={{ borderTopColor: '#2563eb' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },

              /* ── BANNER ── */
              {
                key: 'banner', label: 'Top Banner', labelBn: 'টপ ব্যানার',
                preview: (
                  <div className="h-28 rounded-xl overflow-hidden border border-gray-200 flex flex-col" style={{ background: '#f8fafc' }}>
                    {/* Navbar mockup */}
                    <div className="h-4 flex items-center px-2 gap-1 shrink-0" style={{ background: '#1e293b' }}>
                      <div className="w-2 h-2 rounded-sm bg-white/20" />
                      <div className="flex-1 h-1 bg-white/15 rounded" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                    </div>
                    {/* Notice banner — slides in from top */}
                    <div className="flex items-center gap-1.5 px-2 py-1.5 shrink-0" style={{ background: 'linear-gradient(90deg,#d97706,#f59e0b)', boxShadow: '0 2px 8px rgba(217,119,6,0.3)' }}>
                      <div className="w-3 h-3 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="w-16 h-1.5 bg-white/70 rounded" />
                        <div className="w-12 h-1 bg-white/40 rounded" />
                      </div>
                      {/* countdown bar */}
                      <div className="w-5 h-1 rounded-full bg-white/30 shrink-0">
                        <div className="w-3 h-full rounded-full bg-white/70" />
                      </div>
                      <div className="w-2.5 h-2.5 rounded-sm bg-white/20 shrink-0 flex items-center justify-center">
                        <div className="w-1 h-0.5 bg-white/80 rounded" />
                        <div className="w-0.5 h-0.5 bg-white/80 rounded ml-px" style={{ transform: 'rotate(45deg)' }} />
                      </div>
                    </div>
                    {/* Page content */}
                    <div className="flex-1 p-2 space-y-1">
                      <div className="w-10 h-1.5 bg-gray-200 rounded" />
                      <div className="w-16 h-1 bg-gray-100 rounded" />
                      <div className="w-12 h-1 bg-gray-100 rounded" />
                    </div>
                  </div>
                ),
              },

              /* ── BOTTOM SHEET ── */
              {
                key: 'bottom-sheet', label: 'Bottom Sheet', labelBn: 'নিচ থেকে স্লাইড',
                preview: (
                  <div className="h-28 rounded-xl overflow-hidden border border-gray-200 flex flex-col relative" style={{ background: '#f8fafc' }}>
                    {/* Page content */}
                    <div className="flex-1 p-2 space-y-1">
                      <div className="h-3 w-8 rounded" style={{ background: '#1e293b' }} />
                      <div className="w-14 h-1 bg-gray-200 rounded" />
                      <div className="w-10 h-1 bg-gray-100 rounded" />
                    </div>
                    {/* Dim overlay above sheet */}
                    <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.3)', bottom: 52 }} />
                    {/* Bottom sheet */}
                    <div className="shrink-0 bg-white shadow-2xl overflow-hidden" style={{ borderRadius: '12px 12px 0 0' }}>
                      {/* Drag pill */}
                      <div className="flex justify-center pt-1.5 pb-0.5">
                        <div className="w-6 h-1 rounded-full bg-gray-300" />
                      </div>
                      {/* Header bar with color */}
                      <div className="flex items-center gap-1.5 px-2 py-1" style={{ background: 'linear-gradient(90deg,#004d38,#006A4E)' }}>
                        <div className="w-3 h-3 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="w-14 h-1.5 bg-white/70 rounded" />
                          <div className="w-10 h-1 bg-white/40 rounded" />
                        </div>
                        <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center shrink-0">
                          <div className="text-white/60" style={{ fontSize: 6, lineHeight: 1 }}>✕</div>
                        </div>
                      </div>
                      {/* Body */}
                      <div className="px-2 py-1 space-y-0.5">
                        <div className="w-full h-1 bg-gray-200 rounded" />
                        <div className="w-4/5 h-1 bg-gray-100 rounded" />
                        <div className="flex justify-end pt-0.5">
                          <div className="w-8 h-2 rounded-md" style={{ background: '#006A4E' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },

              /* ── TOAST ── */
              {
                key: 'toast', label: 'Toast / Corner', labelBn: 'কর্নার নোটিফিকেশন',
                preview: (
                  <div className="h-28 rounded-xl overflow-hidden border border-gray-200 relative" style={{ background: '#f8fafc' }}>
                    {/* Page content */}
                    <div className="p-2 space-y-1">
                      <div className="h-3 w-8 rounded" style={{ background: '#1e293b' }} />
                      <div className="w-14 h-1 bg-gray-200 rounded" />
                      <div className="w-10 h-1 bg-gray-100 rounded" />
                      <div className="w-16 h-1 bg-gray-100 rounded" />
                    </div>
                    {/* Toast card — bottom right */}
                    <div className="absolute bottom-2 right-2 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100" style={{ width: 90 }}>
                      {/* Left accent */}
                      <div className="flex">
                        <div className="w-1.5 shrink-0" style={{ background: '#be123c' }} />
                        <div className="flex-1 px-1.5 py-1.5 space-y-0.5">
                          {/* Row: icon + title + close */}
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center" style={{ background: '#fff1f2' }}>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#be123c' }} />
                            </div>
                            <div className="flex-1 h-1.5 bg-gray-700 rounded" />
                            <div className="w-1.5 h-1.5 rounded-sm bg-gray-200 shrink-0" />
                          </div>
                          {/* Message lines */}
                          <div className="w-full h-1 bg-gray-200 rounded" />
                          <div className="w-3/4 h-1 bg-gray-100 rounded" />
                          {/* Progress bar */}
                          <div className="w-full h-0.5 rounded-full bg-gray-100 mt-0.5">
                            <div className="w-2/3 h-full rounded-full" style={{ background: '#be123c' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map(({ key, label, labelBn, preview }) => {
              const active = notice.layout === key;
              return (
                <button key={key} type="button"
                  onClick={() => setNotice((n) => ({ ...n, layout: key }))}
                  className="text-left rounded-2xl border-2 p-2 transition-all hover:shadow-md"
                  style={active
                    ? { borderColor: '#006A4E', background: '#f0fdf4', boxShadow: '0 0 0 1px #006A4E' }
                    : { borderColor: '#e5e7eb', background: '#fafafa' }}>
                  {preview}
                  <div className="mt-2 px-0.5 flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-black leading-tight" style={{ color: active ? '#006A4E' : '#374151' }}>{label}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: active ? '#16a34a' : '#9ca3af' }}>{labelBn}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all"
                      style={active ? { borderColor: '#006A4E', background: '#006A4E' } : { borderColor: '#d1d5db', background: 'transparent' }}>
                      {active && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            placeholder="e.g. সাইট আপডেট, ঈদ অফার..."
            value={notice.title}
            onChange={(e) => setNotice((n) => ({ ...n, title: e.target.value }))}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Subtitle <span className="text-gray-300">(optional)</span></label>
          <input
            type="text"
            placeholder="e.g. আজই সুযোগ নিন, সীমিত সময়ের জন্য..."
            value={notice.subtitle}
            onChange={(e) => setNotice((n) => ({ ...n, subtitle: e.target.value }))}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Message / Description */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Description <span className="text-red-400">*</span></label>
          <textarea
            rows={4}
            placeholder="Full notice message / বিস্তারিত বার্তা..."
            value={notice.message}
            onChange={(e) => setNotice((n) => ({ ...n, message: e.target.value }))}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
          />
        </div>

        {noticeMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-sm text-emerald-700 font-semibold">
            {noticeMsg}
          </div>
        )}

        <button onClick={saveNotice} disabled={noticeSaving}
          className="w-full text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #006A4E 0%, #16a34a 100%)' }}>
          {noticeSaving
            ? <span className="flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</span>
            : notice.active
              ? <span className="flex items-center justify-center gap-2"><Radio className="w-4 h-4" /> Publish Notice</span>
              : <span className="flex items-center justify-center gap-2"><EyeOff className="w-4 h-4" /> Hide Notice</span>
          }
        </button>
      </div>

      {/* ══ Add Custom Category ══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-brand-600" /> Add Custom Category
        </h3>

        {/* Text fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={catForm.key}
            onChange={(e) => setCatForm((f) => ({ ...f, key: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
            placeholder="key (e.g. mechanic)"
            className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors col-span-1" />
          <input value={catForm.label}
            onChange={(e) => setCatForm((f) => ({ ...f, label: e.target.value }))}
            placeholder="Label (English)"
            className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors" />
          <input value={catForm.labelBn}
            onChange={(e) => setCatForm((f) => ({ ...f, labelBn: e.target.value }))}
            placeholder="বাংলা নাম"
            className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors font-bn" />
        </div>

        {/* Colors */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 shrink-0">Icon Color</label>
            <input type="color" value={catForm.color}
              onChange={(e) => setCatForm((f) => ({ ...f, color: e.target.value }))}
              className="w-10 h-9 rounded-lg border border-gray-200 cursor-pointer" />
            <span className="text-xs text-gray-400 font-mono">{catForm.color}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 shrink-0">Background</label>
            <input type="color" value={catForm.bg}
              onChange={(e) => setCatForm((f) => ({ ...f, bg: e.target.value }))}
              className="w-10 h-9 rounded-lg border border-gray-200 cursor-pointer" />
            <span className="text-xs text-gray-400 font-mono">{catForm.bg}</span>
          </div>

          {/* Live preview */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-gray-500">Preview:</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border"
              style={{ background: catForm.bg, color: catForm.color, borderColor: catForm.color + '44' }}>
              <SelectedIcon size={13} />
              {catForm.label || 'Category'}
            </span>
          </div>
        </div>

        {/* Icon picker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Icon</label>
            <span className="text-xs text-brand-600 font-semibold">Selected: {catForm.iconName}</span>
          </div>

          {/* Search icons */}
          <input value={iconSearch} onChange={(e) => setIconSearch(e.target.value)}
            placeholder="Search icon name… (e.g. Hammer, Car, Leaf)"
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400 transition-colors mb-2" />

          {/* Icon grid */}
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto p-1 border-2 border-gray-100 rounded-xl bg-gray-50 scrollbar-hide">
            {filteredIcons.map(({ name, Icon }) => (
              <button key={name} type="button"
                onClick={() => setCatForm((f) => ({ ...f, iconName: name }))}
                title={name}
                className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all
                  ${catForm.iconName === name
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'hover:bg-white hover:shadow-sm text-gray-500'}`}>
                <Icon size={16} />
                <span className="text-[8px] leading-none truncate w-full text-center hidden sm:block">{name}</span>
              </button>
            ))}
            {filteredIcons.length === 0 && (
              <p className="col-span-8 sm:col-span-12 text-center py-4 text-xs text-gray-400">No icons match</p>
            )}
          </div>

          {/* Manual paste option */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-400 shrink-0">Or type icon name:</span>
            <input value={catForm.iconName}
              onChange={(e) => setCatForm((f) => ({ ...f, iconName: e.target.value }))}
              placeholder="Lucide component name"
              className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-brand-400 transition-colors font-mono" />
          </div>
        </div>

        <button onClick={addCategory} disabled={saving === 'cat' || !catForm.key || !catForm.label}
          className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
          {saving === 'cat' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Add Category
        </button>

        {/* Existing custom categories */}
        {extraCategories.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Custom Categories ({extraCategories.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {extraCategories.map((c) => {
                const CIcon = ICON_OPTIONS.find((i) => i.name === c.iconName)?.Icon;
                return (
                  <div key={c.key} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border"
                    style={{ background: c.bg, color: c.color, borderColor: c.color + '44' }}>
                    {CIcon && <CIcon size={12} />}
                    {c.label}
                    <button onClick={() => deleteCategory(c.key)} className="hover:opacity-70 transition-opacity ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ Add Custom Area / District ══ */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-600" /> Add Custom Area / District
        </h3>

        <div className="flex gap-2">
          <input value={areaInput} onChange={(e) => setAreaInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addArea()}
            placeholder="Area or district name (e.g. Kishoreganj)"
            className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-400 transition-colors" />
          <button onClick={addArea} disabled={saving === 'area' || !areaInput.trim()}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0">
            {saving === 'area' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Add
          </button>
        </div>

        {extraAreas.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Custom Areas ({extraAreas.length})
              </p>
              <input value={areaSearch} onChange={(e) => setAreaSearch(e.target.value)}
                placeholder="Filter…"
                className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-brand-400 transition-colors w-36" />
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
              {filteredAreas.map((a) => (
                <div key={a} className="flex items-center gap-1 text-xs font-medium bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 px-2.5 py-1.5 rounded-full border border-gray-200 hover:border-red-200 transition-all group">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  {a}
                  <button onClick={() => deleteArea(a)} className="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────── User Management Panel ────── */
const ROLE_COLORS = {
  worker: 'bg-green-100 text-green-700 border-green-300',
  client: 'bg-blue-100 text-blue-700 border-blue-300',
  admin:  'bg-purple-100 text-purple-700 border-purple-300',
};

function EditUserModal({ user, token, onSave, onClose }) {
  const [form, setForm] = useState({
    name:  user.name  || '',
    email: user.email || '',
    phone: user.phone || '',
    area:  user.area  || '',
    role:  user.role  || 'client',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) { setError('নাম ও ইমেইল আবশ্যক'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.message || 'আপডেট ব্যর্থ'); return; }
      onSave(d);
    } catch { setError('নেটওয়ার্ক সমস্যা'); }
    finally { setLoading(false); }
  }

  const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 bg-white';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <form onSubmit={handleSave} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 bg-gray-900 flex items-center justify-between">
          <div>
            <p className="font-black text-white text-sm">ব্যবহারকারী সম্পাদনা</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {error && (
            <div className="px-3 py-2 rounded-xl text-xs font-medium bg-red-50 text-red-600 border border-red-200">{error}</div>
          )}

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">নাম</label>
            <input className={inputCls} value={form.name} onChange={set('name')} required placeholder="পূর্ণ নাম" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">ইমেইল</label>
            <input className={inputCls} type="email" value={form.email} onChange={set('email')} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">ফোন</label>
              <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="01XXXXXXXXX" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">এলাকা</label>
              <input className={inputCls} value={form.area} onChange={set('area')} placeholder="ঢাকা, মিরপুর..." />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">ভূমিকা (Role)</label>
            <select className={inputCls + ' cursor-pointer'} value={form.role} onChange={set('role')}>
              <option value="worker">কারিগর (Worker)</option>
              <option value="client">ক্লায়েন্ট (Client)</option>
              <option value="admin">অ্যাডমিন (Admin)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
              বাতিল
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
              style={{ background: '#006A4E' }}>
              {loading ? 'সেভ হচ্ছে…' : 'সেভ করুন ✓'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function UserRow({ user: initUser, token, onDelete }) {
  const [user,    setUser]    = useState(initUser);
  const [editing, setEditing] = useState(false);
  const [delConf, setDelConf] = useState(false);
  const [deleting,setDeleting]= useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) onDelete(user._id);
    } catch {} finally { setDeleting(false); setDelConf(false); }
  }

  const roleColor = ROLE_COLORS[user.role] || ROLE_COLORS.client;

  return (
    <>
      {editing && (
        <EditUserModal user={user} token={token}
          onSave={(u) => { setUser(u); setEditing(false); }}
          onClose={() => setEditing(false)} />
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-white text-base"
          style={{ background: user.role === 'worker' ? '#006A4E' : user.role === 'admin' ? '#4f46e5' : '#2563eb' }}>
          {(user.name?.[0] || '?').toUpperCase()}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
            <span className="font-extrabold text-gray-900 text-sm truncate">{user.name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColor}`}>
              {user.role === 'worker' ? 'কারিগর' : user.role === 'client' ? 'ক্লায়েন্ট' : 'অ্যাডমিন'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
            <span className="flex items-center gap-0.5">
              <Mail className="w-3 h-3 shrink-0" />{user.email}
            </span>
            {user.phone && (
              <span className="flex items-center gap-0.5">
                <Phone className="w-3 h-3 shrink-0" />{user.phone}
              </span>
            )}
            {user.area && (
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 shrink-0" />{user.area}
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            নিবন্ধিত: {new Date(user.createdAt).toLocaleDateString('bn-BD')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all">
            <Eye className="w-3.5 h-3.5" />সম্পাদনা
          </button>
          {!delConf ? (
            <button onClick={() => setDelConf(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-all">
              <X className="w-3.5 h-3.5" />মুছুন
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-red-600 font-bold">নিশ্চিত?</span>
              <button onClick={handleDelete} disabled={deleting}
                className="px-2 py-1 rounded-lg text-[10px] font-black bg-red-500 text-white hover:bg-red-600 disabled:opacity-60">
                {deleting ? '…' : 'হ্যাঁ'}
              </button>
              <button onClick={() => setDelConf(false)}
                className="px-2 py-1 rounded-lg text-[10px] font-black bg-gray-200 text-gray-700">না</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function UserManagementPanel({ token }) {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [role,    setRole]    = useState('');
  const searchRef = useRef(null);

  async function loadUsers(q = '', r = '') {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (r) params.set('role', r);
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const d = await res.json();
      setUsers(Array.isArray(d) ? d : []);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadUsers(search, role); }, [role]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => loadUsers(search, role), 400);
    return () => clearTimeout(t);
  }, [search, role]);

  function handleDelete(id) {
    setUsers((u) => u.filter((x) => x._id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Users className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-sm">সমস্ত ব্যবহারকারী</p>
            <p className="text-xs text-gray-400">সব কারিগর + ক্লায়েন্ট — এক জায়গায় দেখুন ও সম্পাদনা করুন</p>
          </div>
          <div className="ml-auto">
            <span className="text-lg font-black text-gray-800">{users.length}</span>
            <span className="text-xs text-gray-400 ml-1">জন</span>
          </div>
        </div>

        {/* Single unified search bar */}
        <div className="relative mb-3">
          <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম, ইমেইল, ফোন নম্বর, এলাকা দিয়ে খুঁজুন…"
            className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role filter pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: '', label: 'সবাই' },
            { key: 'worker', label: 'কারিগর' },
            { key: 'client', label: 'ক্লায়েন্ট' },
          ].map((r) => (
            <button key={r.key} onClick={() => setRole(r.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                ${role === r.key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
              {r.label}
            </button>
          ))}
          {(search || role) && (
            <button onClick={() => { setSearch(''); setRole(''); }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-500 border border-red-200 hover:bg-red-100">
              ✕ ক্লিয়ার
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      )}
      {!loading && users.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
          {(search || role) && (
            <p className="text-xs text-gray-400 mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
          )}
        </div>
      )}
      {!loading && users.length > 0 && (
        <div className="space-y-2">
          {search && (
            <p className="text-xs text-gray-400 font-medium px-1">
              "{search}" — {users.length}টি ফলাফল
            </p>
          )}
          {users.map((u) => (
            <UserRow key={u._id} user={u} token={token} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ────── Main Admin Dashboard ────── */
export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats,   setStats]   = useState(null);
  const [workers, setWorkers] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeTab, setTab]   = useState('pending');
  const [view, setView]       = useState('workers');
  const [loading, setLoading] = useState(true);

  const authFetch = useCallback((url, opts = {}) =>
    fetch(url, { headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json', ...opts.headers }, ...opts })
      .then((r) => r.json()), [token]);

  const loadStats   = useCallback(() => authFetch('/api/admin/stats').then(setStats).catch(() => {}), [authFetch]);
  const loadWorkers = useCallback(() => {
    setLoading(true);
    authFetch(`/api/admin/workers?status=${activeTab}`)
      .then((d) => setWorkers(Array.isArray(d) ? d : []))
      .catch(() => setWorkers([]))
      .finally(() => setLoading(false));
  }, [authFetch, activeTab]);
  const loadClients = useCallback(() => {
    setLoading(true);
    authFetch('/api/admin/clients')
      .then((d) => setClients(Array.isArray(d) ? d : []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, [authFetch]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => {
    if (view === 'workers') loadWorkers();
    else if (view === 'clients') loadClients();
  }, [view, activeTab, loadWorkers, loadClients]);

  const STATUS_TABS = [
    { key: 'pending',  label: 'Pending',  icon: Clock,        cls: 'text-amber-600  bg-amber-50  border-amber-200' },
    { key: 'approved', label: 'Approved', icon: CheckCircle2, cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { key: 'rejected', label: 'Rejected', icon: XCircle,      cls: 'text-red-600   bg-red-50   border-red-200' },
  ];

  const STAT_CARDS = [
    { label: 'Total Workers', val: stats?.totalWorkers,    icon: Users,        bg: 'bg-blue-50',    ic: 'text-blue-600' },
    { label: 'Pending',       val: stats?.pendingWorkers,  icon: Clock,        bg: 'bg-amber-50',   ic: 'text-amber-600' },
    { label: 'Approved',      val: stats?.approvedWorkers, icon: CheckCircle2, bg: 'bg-emerald-50', ic: 'text-emerald-600' },
    { label: 'Clients',       val: stats?.totalClients,    icon: BarChart3,    bg: 'bg-purple-50',  ic: 'text-purple-600' },
  ];

  const [clientSearch, setClientSearch] = useState('');
  const [clientSort,   setClientSort]   = useState('newest');
  const [workerSearch, setWorkerSearch] = useState('');

  const filteredClients = clients.filter((c) => {
    if (!clientSearch.trim()) return true;
    const q = clientSearch.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q)  ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.area?.toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    if (clientSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (clientSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (clientSort === 'name')   return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  const filteredWorkers = workers.filter((w) => {
    if (!workerSearch.trim()) return true;
    const q = workerSearch.toLowerCase();
    return (
      w.name?.toLowerCase().includes(q) ||
      w.phone?.toLowerCase().includes(q) ||
      w.category?.toLowerCase().includes(q) ||
      w.area?.toLowerCase().includes(q)
    );
  });

  const NAV_ITEMS = [
    { key: 'workers',  label: 'কারিগর',   labelEn: 'Workers',    icon: Users },
    { key: 'clients',  label: 'ক্লায়েন্ট', labelEn: 'Clients',    icon: Users },
    { key: 'allusers', label: 'সব ইউজার', labelEn: 'All Users',  icon: Users },
    { key: 'blog',     label: 'ব্লগ',      labelEn: 'Blog',       icon: FileText },
    { key: 'analytics',label: 'Analytics', labelEn: 'Analytics',  icon: BarChart3 },
    { key: 'excel',    label: 'Excel',     labelEn: 'Excel',      icon: Download },
    { key: 'settings', label: 'সেটিংস',   labelEn: 'Settings',   icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Top row */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-100">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-gray-900 leading-none">Admin</h1>
                <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Karigori Dashboard</p>
              </div>
            </div>
            {/* Stats mini strip — desktop only */}
            <div className="hidden sm:flex items-center gap-3">
              {STAT_CARDS.map(({ label, val, icon: Icon, ic }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl">
                  <Icon className={`w-3.5 h-3.5 ${ic}`} />
                  <span className="text-xs font-extrabold text-gray-900">{val ?? '—'}</span>
                  <span className="text-xs text-gray-400 hidden md:block">{label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Tab nav — scrollable on mobile */}
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth:'none' }}>
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setView(key)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap"
                style={view === key
                  ? { background:'#1f2937', color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }
                  : { background:'#f3f4f6', color:'#6b7280' }}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                {label}
                {key === 'workers' && view !== 'workers' && (stats?.pendingWorkers || 0) > 0 && (
                  <span className="bg-amber-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
                    {stats.pendingWorkers}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Mobile stats cards */}
        <div className="grid grid-cols-2 sm:hidden gap-3">
          {STAT_CARDS.map(({ label, val, icon: Icon, bg, ic }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${ic}`} />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-extrabold text-gray-900">{val ?? '—'}</div>
                <div className="text-xs text-gray-400 truncate leading-tight">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Workers view ── */}
        {view === 'workers' && (
          <>
            {/* Search + filter bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search" value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  placeholder="নাম, ফোন, ক্যাটাগরি, এলাকা..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-green-500"
                />
              </div>
              <div className="flex gap-2">
                {STATUS_TABS.map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all
                      ${activeTab === t.key ? t.cls : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <t.icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden sm:inline">{t.label}</span>
                    <span className="sm:hidden">{t.label.slice(0,3)}</span>
                    {t.key === 'pending' && stats?.pendingWorkers > 0 && (
                      <span className="bg-amber-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">
                        {stats.pendingWorkers}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {workerSearch && (
              <p className="text-xs text-gray-400 font-medium">
                "{workerSearch}" — {filteredWorkers.length}টি ফলাফল
              </p>
            )}

            {loading && <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-gray-300 animate-spin" /></div>}
            {!loading && filteredWorkers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <CheckCircle2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">কোনো কারিগর পাওয়া যায়নি</p>
              </div>
            )}
            {!loading && filteredWorkers.length > 0 && (
              <div className="space-y-3">
                {filteredWorkers.map((w) => (
                  <WorkerRow key={w._id} worker={w} token={token} onRefresh={() => { loadWorkers(); loadStats(); }} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Clients view ── */}
        {view === 'clients' && (
          <>
            {/* Search + sort bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search" value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="নাম, ইমেইল, ফোন, এলাকা দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-green-500"
                />
              </div>
              <select value={clientSort} onChange={(e) => setClientSort(e.target.value)}
                className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 outline-none cursor-pointer font-medium text-gray-700">
                <option value="newest">সর্বশেষ রেজিস্ট্রেশন</option>
                <option value="oldest">পুরনো আগে</option>
                <option value="name">নাম অনুযায়ী</option>
              </select>
            </div>

            {/* Count chip */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">
                মোট: <span className="text-gray-800">{clients.length}</span>
                {clientSearch && ` / ফিল্টার: ${filteredClients.length}`}
              </span>
              {clientSearch && (
                <button onClick={() => setClientSearch('')}
                  className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100">
                  ✕ ক্লিয়ার
                </button>
              )}
            </div>

            {loading && <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-gray-300 animate-spin" /></div>}
            {!loading && filteredClients.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 font-medium">{clientSearch ? 'কোনো ফলাফল নেই' : 'কোনো ক্লায়েন্ট নেই'}</p>
              </div>
            )}
            {!loading && filteredClients.length > 0 && (
              <div className="space-y-3">
                {filteredClients.map((c) => <ClientRow key={c._id} client={c} />)}
              </div>
            )}
          </>
        )}

        {/* ── All Users Management ── */}
        {view === 'allusers' && <UserManagementPanel token={token} />}

        {/* Analytics */}
        {view === 'analytics' && <AnalyticsPanel token={token} />}

        {/* Excel upload */}
        {view === 'excel' && <ExcelUpload token={token} />}

        {/* Blog management */}
        {view === 'blog' && <AdminBlogManager token={token} />}

        {/* Settings */}
        {view === 'settings' && <SettingsPanel token={token} />}
      </div>
    </div>
  );
}
