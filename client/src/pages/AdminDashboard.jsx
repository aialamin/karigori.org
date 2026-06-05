import { useState, useEffect, useCallback } from 'react';
import {
  Users, CheckCircle2, Clock, XCircle, BarChart3, Check, X,
  RefreshCw, ChevronDown, ChevronUp, MapPin, Phone, BadgeCheck,
  CreditCard, FileText, Star, StickyNote, Calendar, Mail,
  ShieldCheck, AlertCircle, ZoomIn, ShieldAlert, Upload,
  Flag, AlertTriangle,
} from 'lucide-react';
import { getLevelInfo } from '../components/VerificationBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCategoryInfo } from '../constants.js';
import { CategoryIcon } from '../components/CategoryIcon.jsx';

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
    await api(`/api/admin/workers/${workerId}/flag`, { flag: !w.flagged, reason: rejNote || 'Flagged by admin' });
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
    else loadClients();
  }, [view, activeTab]);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" /> Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Review workers, manage accounts</p>
          </div>
          <div className="flex gap-2">
            {['workers', 'clients'].map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`flex-1 sm:flex-none text-sm font-bold px-5 py-2 rounded-xl capitalize transition-all
                  ${view === v ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAT_CARDS.map(({ label, val, icon: Icon, bg, ic }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${ic}`} />
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{val ?? '—'}</div>
                <div className="text-xs text-gray-400 truncate">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Workers view */}
        {view === 'workers' && (
          <>
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold border transition-all
                    ${activeTab === t.key ? t.cls : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  <t.icon className="w-4 h-4 shrink-0" />
                  <span>{t.label}</span>
                  {t.key === 'pending' && stats?.pendingWorkers > 0 && (
                    <span className="bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      {stats.pendingWorkers}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {loading && <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-gray-300 animate-spin" /></div>}

            {!loading && workers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <CheckCircle2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No {activeTab} workers</p>
              </div>
            )}

            {!loading && workers.length > 0 && (
              <div className="space-y-3">
                {workers.map((w) => (
                  <WorkerRow key={w._id} worker={w} token={token} onRefresh={() => { loadWorkers(); loadStats(); }} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Clients view */}
        {view === 'clients' && (
          <>
            {loading && <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-gray-300 animate-spin" /></div>}
            {!loading && clients.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 font-medium">No clients registered yet</p>
              </div>
            )}
            {!loading && clients.length > 0 && (
              <div className="space-y-3">
                {clients.map((c) => <ClientRow key={c._id} client={c} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
