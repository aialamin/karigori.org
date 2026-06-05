import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, ArrowLeft, MapPin, Clock, BadgeCheck, Phone, MessageCircle,
  ShieldCheck, Eye, Briefcase, Languages, CheckCircle2, Send, ChevronRight,
  Flag, X, AlertTriangle, ThumbsUp, ChevronDown, User, Calendar,
  MessageSquare, Info,
} from 'lucide-react';
import { getCategoryInfo } from '../constants.js';
import { CategoryIcon } from '../components/CategoryIcon.jsx';
import { FloatInput, FloatTextarea, Alert, Spinner } from '../components/ui.jsx';
import { BadgeRow } from '../components/VerificationBadge.jsx';

/* ═══════════════════════════════ Stars ═══════════════════════════════ */
function Stars({ rating, size = 'md', interactive = false, value, onChange }) {
  const [hov, setHov] = useState(0);
  const sz = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6', xl: 'w-8 h-8' }[size];
  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  if (interactive) return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map((i) => (
          <button key={i} type="button"
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(0)}
            onClick={() => onChange(i)}
            className="transition-transform hover:scale-110 active:scale-95">
            <Star className={`w-9 h-9 transition-colors ${i <= (hov || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 hover:text-amber-200'}`} />
          </button>
        ))}
      </div>
      {(hov || value) > 0 && (
        <span className="text-sm font-semibold text-gray-600 ml-1">{LABELS[hov || value]}</span>
      )}
    </div>
  );

  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`${sz} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

/* ═══════════════════════════ Rating bar ══════════════════════════════ */
function RatingBar({ star, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-2 text-xs font-semibold text-gray-500 text-right shrink-0">{star}</span>
      <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-5 text-xs text-gray-400 text-right shrink-0">{count}</span>
    </div>
  );
}

/* ═══════════════════════════ Review card ════════════════════════════ */
function ReviewCard({ review }) {
  return (
    <div className="flex gap-3 pb-5 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
        {review.reviewerName[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{review.reviewerName}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {new Date(review.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Stars rating={review.rating} size="sm" />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════ Reviews section ════════════════════════ */
function ReviewsSection({ workerId, workerRating, workerReviewCount }) {
  const [reviews, setReviews] = useState([]);
  const [dist,    setDist]    = useState({});
  const [total,   setTotal]   = useState(workerReviewCount || 0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 5;

  const load = useCallback(async (pg = 1, append = false) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/workers/${workerId}/reviews?page=${pg}&limit=${LIMIT}`);
      const data = await res.json();
      setReviews((prev) => append ? [...prev, ...data.reviews] : data.reviews);
      setDist(data.distribution || {});
      setTotal(data.total || 0);
      setHasMore(pg * LIMIT < data.total);
    } catch {}
    finally { setLoading(false); }
  }, [workerId]);

  useEffect(() => { load(1); }, [load]);

  return (
    <div className="space-y-5">
      {/* Rating summary */}
      {total > 0 && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center justify-center text-center shrink-0">
            <span className="text-5xl font-extrabold text-gray-900 leading-none">{(workerRating || 0).toFixed(1)}</span>
            <Stars rating={workerRating || 0} size="sm" />
            <span className="text-xs text-gray-400 mt-1.5">{total} review{total !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5,4,3,2,1].map((s) => (
              <RatingBar key={s} star={s} count={dist[s] || 0} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* List */}
      {loading && reviews.length === 0 && (
        <div className="flex justify-center py-10">
          <span className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12">
          <ThumbsUp className="w-10 h-10 text-gray-200" />
          <p className="font-semibold text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400">Be the first to review this worker</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
          {hasMore && (
            <button onClick={() => { const n = page + 1; setPage(n); load(n, true); }} disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-sm text-brand-600 font-semibold border border-brand-200 rounded-xl py-2.5 hover:bg-brand-50 transition-colors">
              {loading ? <Spinner label="Loading…" /> : <><ChevronDown className="w-4 h-4" />Load more</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════ Booking form ════════════════════════════ */
function BookingForm({ worker }) {
  const [form, setForm]     = useState({ name: '', phone: '', date: '', problem: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name    = 'Your name is required';
    if (!form.phone.trim()) e.phone   = 'Phone number is required';
    else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/-/g, ''))) e.phone = 'Enter a valid BD mobile number';
    if (!form.problem.trim()) e.problem = 'Please describe your problem';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1200);
  }

  if (status === 'success') return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-emerald-500" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg">Request sent</h3>
        <p className="text-sm text-gray-500 mt-1">
          {worker.name.split(' ')[0]} will contact <strong>{form.phone}</strong> shortly.
        </p>
      </div>
      <button onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', date: '', problem: '' }); }}
        className="text-sm text-brand-600 font-semibold hover:underline">
        Send another request
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <FloatInput id="bname"  label="Your Name"              value={form.name}    onChange={set('name')}    required error={errors.name} icon={User} />
      <FloatInput id="bphone" label="Your Phone Number"      value={form.phone}   onChange={set('phone')}   required error={errors.phone} type="tel" icon={Phone} />
      <FloatInput id="bdate"  label="Preferred Date"         value={form.date}    onChange={set('date')}    type="date" icon={Calendar} />
      <FloatTextarea id="bprob" label="Describe your problem" value={form.problem} onChange={set('problem')} error={errors.problem} rows={4} maxLen={300} />
      <button type="submit" disabled={status === 'submitting'}
        className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-1">
        {status === 'submitting' ? <Spinner label="Sending…" /> : <><Send className="w-4 h-4 shrink-0" /><span>Send Request</span></>}
      </button>
      <p className="text-center text-xs text-gray-400">Worker will contact you directly — no middleman</p>
    </form>
  );
}

/* ═══════════════════════════ Review form ════════════════════════════ */
function ReviewForm({ workerId, onSuccess }) {
  const [form, setForm]     = useState({ name: '', rating: 0, comment: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };

  async function handleSubmit(e) {
    e.preventDefault();
    const er = {};
    if (!form.name.trim())    er.name    = 'Your name is required';
    if (!form.rating)         er.rating  = 'Please select a rating';
    if (!form.comment.trim()) er.comment = 'Please write your review';
    if (Object.keys(er).length) { setErrors(er); return; }
    setStatus('submitting');
    try {
      const res = await fetch(`/api/workers/${workerId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerName: form.name, rating: form.rating, comment: form.comment }),
      });
      if (!res.ok) { const d = await res.json(); setErrors({ submit: d.message }); setStatus('idle'); return; }
      setStatus('success');
      onSuccess?.();
    } catch { setErrors({ submit: 'Network error.' }); setStatus('idle'); }
  }

  if (status === 'success') return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-emerald-500" />
      </div>
      <p className="font-bold text-gray-900 text-lg">Thank you for your review</p>
      <p className="text-sm text-gray-400">Your feedback helps others in Dhaka.</p>
      <button onClick={() => { setStatus('idle'); setForm({ name: '', rating: 0, comment: '' }); onSuccess?.(); }}
        className="text-sm text-brand-600 font-semibold hover:underline">
        Write another review
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Select a rating</p>
        <Stars interactive value={form.rating} onChange={(v) => { setForm((f) => ({ ...f, rating: v })); setErrors((e) => ({ ...e, rating: '' })); }} />
        {errors.rating && <p className="mt-2 text-xs text-red-500">{errors.rating}</p>}
      </div>
      <FloatInput    id="rname"    label="Your Name"    value={form.name}    onChange={set('name')}    required error={errors.name} icon={User} />
      <FloatTextarea id="rcomment" label="Your Review"  value={form.comment} onChange={set('comment')} error={errors.comment} rows={4} maxLen={250} />
      {errors.submit && <Alert type="error">{errors.submit}</Alert>}
      <button type="submit" disabled={status === 'submitting'}
        className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
        {status === 'submitting' ? <Spinner label="Submitting…" /> : <><Star className="w-4 h-4 shrink-0 fill-white" /><span>Submit Review</span></>}
      </button>
    </form>
  );
}

/* ═══════════════════════════ Report modal ════════════════════════════ */
const REPORT_REASONS = ['Poor quality work', 'Did not show up', 'Rude or aggressive', 'Overcharged or scam', 'Fake profile', 'Other'];

function ReportModal({ workerId, workerName, open, onClose }) {
  const [reason, setReason]   = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState('idle');

  if (!open) return null;

  async function submit() {
    if (!reason) return;
    setStatus('loading');
    try {
      await fetch(`/api/workers/${workerId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, details, reporterEmail: email }),
      });
      setStatus('done');
    } catch { setStatus('idle'); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-gray-900">Report Worker</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {status === 'done' ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="font-bold text-gray-900">Report submitted</p>
            <p className="text-sm text-gray-400">Our team will review this report. Thank you.</p>
            <button onClick={onClose} className="mt-2 bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">Close</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reason</p>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_REASONS.map((r) => (
                  <button key={r} onClick={() => setReason(r)}
                    className={`text-left text-xs px-3 py-2 rounded-xl border-2 font-medium transition-all
                      ${reason === r ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Details (optional)</p>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3}
                placeholder="Describe what happened…"
                className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2 outline-none resize-none focus:border-red-300 transition-colors placeholder-gray-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Your Email (optional)</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com"
                className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-300 transition-colors placeholder-gray-400" />
            </div>
            <p className="text-xs text-gray-400">Reports are reviewed by our team. False reports may lead to account action.</p>
            <button onClick={submit} disabled={!reason || status === 'loading'}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              {status === 'loading' ? <Spinner label="Submitting…" /> : <><Flag className="w-4 h-4" />Submit Report</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Main Page
══════════════════════════════════════════════════════════════════════ */
export default function WorkerProfile() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [worker, setWorker]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [callRevealed, setCallRevealed] = useState(false);
  const [tab, setTab]                   = useState('about');
  const [reportOpen, setReportOpen]     = useState(false);
  const [reviewKey, setReviewKey]       = useState(0);

  const fetchWorker = useCallback(async () => {
    try {
      const res = await fetch(`/api/workers/${id}`);
      if (!res.ok) throw new Error('Worker not found');
      setWorker(await res.json());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchWorker(); }, [fetchWorker]);
  function onNewReview() { setReviewKey((k) => k + 1); fetchWorker(); setTab('reviews'); }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 animate-pulse space-y-5">
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="bg-white rounded-2xl p-6 flex gap-5">
        <div className="w-28 h-28 bg-gray-200 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-7 bg-gray-200 rounded w-52" />
          <div className="h-4 bg-gray-200 rounded w-36" />
          <div className="h-4 bg-gray-200 rounded w-72" />
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center gap-4 py-24 text-center px-4">
      <Info className="w-12 h-12 text-gray-300" />
      <p className="text-gray-600 font-medium">{error}</p>
      <button onClick={() => navigate('/browse')}
        className="border-2 border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-full hover:border-brand-500 hover:text-brand-600 transition-colors">
        Back to Browse
      </button>
    </div>
  );

  const cat = getCategoryInfo(worker.category);

  const TABS = [
    { key: 'about',   label: 'Overview',                      icon: Info },
    { key: 'reviews', label: `Reviews (${worker.reviewCount || 0})`, icon: Star },
    { key: 'book',    label: 'Send Request',                  icon: Send },
    { key: 'review',  label: 'Write Review',                  icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Back ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to results</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-5 flex flex-col lg:flex-row gap-6">

        {/* ══════════════════ LEFT / MAIN ══════════════════ */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── Profile hero card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Colour accent strip */}
            <div className="h-1" style={{ background: cat.color }} />

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">

                {/* Photo */}
                <div className="relative shrink-0 self-start">
                  <img
                    src={worker.photo}
                    alt={worker.name}
                    className="w-28 h-28 rounded-2xl object-cover bg-gray-100 ring-4 ring-white shadow-md"
                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${worker.name}&backgroundColor=006A4E&textColor=ffffff`; }}
                  />
                  {worker.available ? (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                      Available Now
                    </span>
                  ) : (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                      Unavailable
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pt-1">
                  {/* Name + verified */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{worker.name}</h1>
                    {worker.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full">
                        <BadgeCheck className="w-3.5 h-3.5 shrink-0" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full mb-4"
                    style={{ background: cat.bg, color: cat.color }}>
                    <CategoryIcon category={worker.category} size={14} />
                    {cat.label}
                  </span>

                  {/* Rating row — clickable */}
                  <button onClick={() => setTab('reviews')}
                    className="flex items-center gap-2.5 mb-4 group">
                    <Stars rating={worker.rating || 0} size="md" />
                    <span className="text-xl font-extrabold text-gray-900">{(worker.rating || 0).toFixed(1)}</span>
                    <span className="text-sm text-gray-400 group-hover:text-brand-600 group-hover:underline transition-colors">
                      ({worker.reviewCount || 0} reviews)
                    </span>
                  </button>

                  {/* Verification badges */}
                  <BadgeRow level={worker.verificationLevel || 0} />
                </div>
              </div>

              {/* ── Stat strip ── */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100">
                {[
                  { icon: Clock,    label: 'Experience', value: `${worker.experience} yr${worker.experience !== 1 ? 's' : ''}` },
                  { icon: Briefcase,label: 'Hourly Rate', value: worker.hourlyRate ? `৳${worker.hourlyRate}` : 'Negotiable' },
                  { icon: Star,     label: 'Reviews',    value: worker.reviewCount || 0 },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="text-base font-extrabold text-gray-900">{value}</span>
                    <span className="text-xs text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="border-t border-gray-100 flex overflow-x-auto scrollbar-hide">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2
                    ${tab === key ? 'border-brand-600 text-brand-700 bg-brand-50/60' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Overview ── */}
          {tab === 'about' && (
            <div className="space-y-4">

              {/* Bio */}
              {worker.bio && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">About</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">{worker.bio}</p>
                </div>
              )}

              {/* Areas */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Service Areas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {worker.areas.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1.5 text-sm bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" /> {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {worker.languages?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" /> Languages
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {worker.languages.map((l) => (
                      <span key={l} className="text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full font-semibold">{l}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Details grid */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Worker Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: null,       label: 'Trade',        value: cat.label,                    isCat: true },
                    { icon: Clock,      label: 'Experience',   value: `${worker.experience} year${worker.experience !== 1 ? 's' : ''}` },
                    { icon: BadgeCheck, label: 'Verification', value: worker.verified ? 'Verified by Karigori' : 'Unverified' },
                    { icon: Phone,      label: 'Availability', value: worker.available ? 'Available Now' : 'Currently Busy',
                      valueClass: worker.available ? 'text-emerald-600' : 'text-red-500' },
                  ].map(({ icon: Icon, label, value, isCat, valueClass }) => (
                    <div key={label} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-9 h-9 bg-white rounded-xl border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        {isCat
                          ? <CategoryIcon category={worker.category} size={16} style={{ color: cat.color }} />
                          : <Icon className="w-4 h-4 text-gray-400" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                        <p className={`text-sm font-bold truncate ${valueClass || 'text-gray-800'}`}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews preview */}
              {(worker.reviewCount || 0) > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Recent Reviews
                    </h2>
                    <button onClick={() => setTab('reviews')}
                      className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
                      See all <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ReviewsSection key={reviewKey} workerId={id}
                    workerRating={worker.rating} workerReviewCount={worker.reviewCount} />
                </div>
              )}
            </div>
          )}

          {/* ── Reviews tab ── */}
          {tab === 'reviews' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 text-lg">
                  {worker.reviewCount || 0} Review{(worker.reviewCount || 0) !== 1 ? 's' : ''}
                </h2>
                <button onClick={() => setTab('review')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> Write a Review
                </button>
              </div>
              <ReviewsSection key={reviewKey} workerId={id}
                workerRating={worker.rating} workerReviewCount={worker.reviewCount} />
            </div>
          )}

          {/* ── Book tab ── */}
          {tab === 'book' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Send a Service Request</h2>
              <p className="text-sm text-gray-400 mb-6">
                Fill in the form and {worker.name.split(' ')[0]} will call or message you directly.
              </p>
              <BookingForm worker={worker} />
            </div>
          )}

          {/* ── Write review tab ── */}
          {tab === 'review' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Write a Review</h2>
              <p className="text-sm text-gray-400 mb-6">
                Open to everyone — no account needed. Your review helps others in Dhaka.
              </p>
              <ReviewForm workerId={id} onSuccess={onNewReview} />
            </div>
          )}
        </div>

        {/* ══════════════════ RIGHT / SIDEBAR ══════════════════ */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0">
          <div className="sticky top-20 space-y-4">

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Rate header */}
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                <p className="text-xs text-gray-400 font-semibold mb-0.5">Hourly Rate</p>
                <p className="text-2xl font-extrabold text-brand-700">
                  {worker.hourlyRate ? `৳ ${worker.hourlyRate}` : 'Negotiable'}
                  {worker.hourlyRate && <span className="text-sm font-normal text-gray-400 ml-1">/ hr</span>}
                </p>
              </div>

              <div className="p-5 space-y-3">
                {!callRevealed ? (
                  <button onClick={() => setCallRevealed(true)}
                    className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-sm">
                    <Eye className="w-4 h-4 shrink-0" /><span>Show Phone Number</span>
                  </button>
                ) : (
                  <div className="space-y-2.5">
                    <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 flex items-center gap-3">
                      <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                      <a href={`tel:${worker.phone.replace(/-/g, '')}`}
                        className="font-extrabold text-gray-900 text-lg hover:text-brand-600 transition-colors tracking-wide truncate">
                        {worker.phone}
                      </a>
                    </div>
                    <a href={`tel:${worker.phone.replace(/-/g, '')}`}
                      className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                      <Phone className="w-4 h-4 shrink-0" /><span>Call Now</span>
                    </a>
                    <a href={`https://wa.me/880${worker.phone.replace(/^0/, '').replace(/-/g, '')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                      <MessageCircle className="w-4 h-4 shrink-0" /><span>WhatsApp</span>
                    </a>
                  </div>
                )}

                <p className="text-center text-[11px] text-gray-400 pt-1">
                  No commission — direct contact with the worker
                </p>

                {/* Mini stats */}
                <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{(worker.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-gray-200">|</span>
                  <span>{worker.reviewCount || 0} reviews</span>
                  <span className="text-gray-200">|</span>
                  <span>{worker.experience}yr exp</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setTab('book')}
                className="bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                <Send className="w-3.5 h-3.5 shrink-0" /><span>Request</span>
              </button>
              <button onClick={() => setTab('review')}
                className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                <Star className="w-3.5 h-3.5 shrink-0 fill-white" /><span>Review</span>
              </button>
            </div>

            {/* Safety */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3 text-sm">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" /> Safety Tips
              </h4>
              <ul className="space-y-2.5">
                {[
                  { icon: BadgeCheck, text: 'Verify ID before letting the worker in' },
                  { icon: Clock,      text: 'Agree on price before work begins' },
                  { icon: MessageSquare, text: 'Keep a written or voice record' },
                  { icon: CheckCircle2,  text: 'Pay only after work is completed' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-xs text-gray-600">
                    <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Report */}
            <button onClick={() => setReportOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-red-500 py-2.5 rounded-xl border border-dashed border-gray-200 hover:border-red-300 transition-all">
              <Flag className="w-3.5 h-3.5" /> Report this worker
            </button>

            <ReportModal workerId={id} workerName={worker.name}
              open={reportOpen} onClose={() => setReportOpen(false)} />
          </div>
        </aside>
      </div>
    </div>
  );
}
