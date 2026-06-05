import { useState, useRef, useEffect } from 'react';
import { Camera, Save, CheckCircle2, RefreshCw, MapPin, Star, Phone, Upload, CreditCard, FileText, X, ZoomIn, Languages as LangIcon, MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DHAKA_AREAS, getCategoryInfo } from '../constants.js';
import { CategoryIcon } from '../components/CategoryIcon.jsx';
import { FloatInput, FloatTextarea, Toggle, Alert, Spinner } from '../components/ui.jsx';
import { VerificationProgress } from '../components/VerificationBadge.jsx';

/* ── Lightbox ── */
function Lightbox({ src, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" onClick={onClose}>
      <img src={src} alt="Document" className="max-h-[90vh] max-w-full rounded-xl shadow-2xl object-contain"
        onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ── Doc upload area ── */
function DocCard({ label, sublabel, src, onSelect }) {
  const ref = useRef(null);
  const [lb, setLb] = useState(false);
  return (
    <>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</p>
        <div className="relative group border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all
          hover:border-brand-400 bg-gray-50 hover:bg-brand-50"
          onClick={() => ref.current?.click()}>
          {src ? (
            <>
              <img src={src} alt={label} className="w-full h-28 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button type="button" onClick={(e) => { e.stopPropagation(); setLb(true); }}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" /> View
                </button>
                <button type="button" className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> Change
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-5">
              <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center"><Upload className="w-4 h-4 text-gray-400" /></div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500">Click to upload</p>
                {sublabel && <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>}
              </div>
            </div>
          )}
        </div>
        <input ref={ref} type="file" accept="image/*,.pdf" onChange={onSelect} className="hidden" />
      </div>
      {lb && <Lightbox src={src} onClose={() => setLb(false)} />}
    </>
  );
}

/* ── OTP Phone Verification ── */
function OTPVerification({ wp, token, onSuccess }) {
  const [step, setStep]     = useState('idle'); // idle | sent
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoad]  = useState(false);
  const inputRefs           = useRef([]);
  const otpValue            = digits.join('');

  /* Already verified — success strip */
  if (wp?.otpVerified) return (
    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
        <Phone className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-emerald-800">Phone Verified</p>
        <p className="text-xs text-emerald-600">{wp.phone} · Level 1 unlocked</p>
      </div>
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
    </div>
  );

  async function sendOtp() {
    setLoad(true); setError('');
    try {
      const res  = await fetch('/api/auth/send-otp', { method: 'POST', headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      if (data.devOtp) setDevOtp(data.devOtp);
      setStep('sent');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch { setError('Network error'); }
    finally { setLoad(false); }
  }

  async function verifyOtp() {
    if (otpValue.length !== 6) return;
    setLoad(true); setError('');
    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      onSuccess(data.worker);
    } catch { setError('Network error'); }
    finally { setLoad(false); }
  }

  function handleDigitChange(i, e) {
    const raw = e.target.value.replace(/\D/g, '');
    // Handle pasting a full code into one box
    if (raw.length > 1) {
      const chars = raw.slice(0, 6).split('');
      const next = [...digits];
      chars.forEach((c, j) => { if (i + j < 6) next[i + j] = c; });
      setDigits(next); setError('');
      const focusIdx = Math.min(i + chars.length, 5);
      inputRefs.current[focusIdx]?.focus();
      return;
    }
    const val  = raw.slice(0, 1);
    const next = [...digits];
    next[i]    = val;
    setDigits(next); setError('');
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits]; next[i] = ''; setDigits(next);
      } else if (i > 0) {
        const next = [...digits]; next[i - 1] = ''; setDigits(next);
        inputRefs.current[i - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft'  && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputRefs.current[i + 1]?.focus();
    if (e.key === 'Enter' && otpValue.length === 6) verifyOtp();
  }

  function reset() {
    setStep('idle'); setDevOtp(''); setDigits(['','','','','','']); setError('');
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">Phone Verification</p>
          <p className="text-xs text-gray-400">Required for Level 1 — appear in search results</p>
        </div>
      </div>

      {/* Dev hint */}
      {devOtp && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3">
          <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-700">Dev mode — OTP not sent via SMS</p>
            <p className="text-xs text-amber-600 mt-1">
              Use this code:{' '}
              <span className="font-mono font-extrabold text-sm tracking-[0.25em] text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">{devOtp}</span>
            </p>
          </div>
        </div>
      )}

      {step === 'idle' ? (
        /* ────── Send OTP button ────── */
        <button onClick={sendOtp} disabled={loading}
          className="group relative w-full overflow-hidden rounded-2xl
            bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500
            hover:from-amber-500 hover:via-orange-500 hover:to-amber-600
            active:scale-[0.98] disabled:opacity-60
            shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300
            transition-all duration-200 px-5 py-4">

          {/* Decorative background circle */}
          <span className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          <span className="absolute -right-2 top-2 w-12 h-12 rounded-full bg-white/10 pointer-events-none" />

          <div className="relative flex items-center gap-4">
            {/* Phone icon with ring */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {loading
                  ? <RefreshCw className="w-6 h-6 text-white animate-spin" />
                  : <Phone className="w-6 h-6 text-white" />
                }
              </div>
            </div>

            {/* Text */}
            <div className="text-left flex-1">
              <p className="text-white font-extrabold text-base leading-tight">
                {loading ? 'Sending…' : 'Send Verification Code'}
              </p>
              <p className="text-white/75 text-xs font-medium mt-0.5 flex items-center gap-1.5">
                <span>SMS to</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-md font-mono font-semibold">{wp?.phone}</span>
              </p>
            </div>

            {!loading && (
              <ChevronRight className="w-5 h-5 text-white/60 shrink-0 group-hover:translate-x-1 transition-transform" />
            )}
          </div>
        </button>

      ) : (
        /* ────── OTP entry ────── */
        <div className="space-y-3">
          <p className="text-xs text-gray-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            Code sent to <span className="font-semibold text-gray-700">{wp?.phone}</span>
          </p>

          {/* Single input — no overflow, works everywhere */}
          <input
            ref={(el) => { inputRefs.current[0] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otpValue}
            placeholder="Enter 6-digit code"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              const padded = val.split('').concat(Array(6).fill('')).slice(0, 6);
              setDigits(padded);
              setError('');
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && otpValue.length === 6) verifyOtp(); }}
            className="w-full h-14 text-center text-3xl font-extrabold tracking-[0.5em] border-2 rounded-xl outline-none bg-white text-gray-900 placeholder:text-gray-300 placeholder:text-base placeholder:tracking-normal
              border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
            autoFocus
          />

          <button onClick={verifyOtp} disabled={loading || otpValue.length !== 6}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed
              text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2
              transition-all shadow-sm">
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin shrink-0" /><span>Verifying…</span></>
              : <><CheckCircle2 className="w-4 h-4 shrink-0" /><span>Verify Code</span></>
            }
          </button>
        </div>
      )}

      {step === 'sent' && (
        <button onClick={reset}
          className="text-xs text-gray-400 hover:text-brand-600 transition-colors flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Resend OTP
        </button>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

/* ── NID & Certificate section ── */
function NIDSection({ wp, nidNumber, setNidNumber, onSave, saving, saved, error }) {
  const [nidFrontFile, setNidFrontFile] = useState(null);
  const [nidBackFile,  setNidBackFile]  = useState(null);
  const [nidFrontPrev, setNidFrontPrev] = useState(null);
  const [nidBackPrev,  setNidBackPrev]  = useState(null);

  function readFile(file, setPreview) {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target.result);
    r.readAsDataURL(file);
  }

  const displayFront = nidFrontPrev || wp?.nidFront;
  const displayBack  = nidBackPrev  || wp?.nidBack;

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-brand-600 shrink-0" />
        <h3 className="font-bold text-gray-900">Identity & Documents</h3>
        {wp?.nidFront && wp?.nidBack
          ? <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> NID Uploaded</span>
          : <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">NID Required</span>
        }
      </div>

      <FloatInput id="nid_num" label="NID Card Number" value={nidNumber}
        onChange={(e) => setNidNumber(e.target.value)} icon={CreditCard} />

      <div className="grid grid-cols-2 gap-3">
        <DocCard label="NID Front" sublabel="JPG / PNG" src={displayFront}
          onSelect={(e) => { const f = e.target.files[0]; setNidFrontFile(f); readFile(f, setNidFrontPrev); }} />
        <DocCard label="NID Back" sublabel="JPG / PNG" src={displayBack}
          onSelect={(e) => { const f = e.target.files[0]; setNidBackFile(f); readFile(f, setNidBackPrev); }} />
      </div>

      {error  && <Alert type="error">{error}</Alert>}
      {saved  && <Alert type="success">Documents saved!</Alert>}

      <button onClick={() => onSave(nidFrontFile, nidBackFile)} disabled={saving}
        className="w-full bg-gray-800 hover:bg-gray-900 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
        {saving ? <Spinner label="Uploading…" /> : <><Upload className="w-4 h-4 shrink-0" /><span>Save Documents</span></>}
      </button>
    </div>
  );
}

const STATUS = {
  pending:  { cls: 'bg-amber-50 border-amber-200 text-amber-700',   dot: 'bg-amber-400',   label: 'Pending Approval' },
  approved: { cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-500', label: 'Approved & Live' },
  rejected: { cls: 'bg-red-50 border-red-200 text-red-700',          dot: 'bg-red-500',     label: 'Rejected' },
};

export default function WorkerDashboard() {
  const { user, workerProfile, token, updateWorkerProfile } = useAuth();
  const fileRef = useRef(null);

  const [wp, setWp]                   = useState(workerProfile);
  const [saving, setSaving]           = useState(false);
  const [photoLoading, setPhotoLoad]  = useState(false);
  const [docSaving, setDocSaving]     = useState(false);
  const [saved, setSaved]             = useState(false);
  const [docSaved, setDocSaved]       = useState(false);
  const [error, setError]             = useState('');
  const [docError, setDocError]       = useState('');
  const [selectedAreas, setAreas]     = useState(workerProfile?.areas || []);
  const [nidNumber, setNidNumber]     = useState(workerProfile?.nidNumber || '');

  const [form, setForm] = useState({
    bio:        workerProfile?.bio || '',
    experience: String(workerProfile?.experience || ''),
    hourlyRate: String(workerProfile?.hourlyRate || ''),
    languages:  workerProfile?.languages?.join(', ') || 'Bengali',
    phone:      workerProfile?.phone || user?.phone || '',
    available:  workerProfile?.available ?? true,
  });

  useEffect(() => {
    if (workerProfile) {
      setWp(workerProfile);
      setAreas(workerProfile.areas || []);
      setForm({
        bio:        workerProfile.bio || '',
        experience: String(workerProfile.experience || ''),
        hourlyRate: String(workerProfile.hourlyRate || ''),
        languages:  workerProfile.languages?.join(', ') || 'Bengali',
        phone:      workerProfile.phone || user?.phone || '',
        available:  workerProfile.available ?? true,
      });
    }
  }, [workerProfile]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggleArea = (a) => setAreas((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  async function handleSave() {
    setSaving(true); setError(''); setSaved(false);
    try {
      const res = await fetch('/api/profile/worker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ ...form, areas: selectedAreas, languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Save failed'); return; }
      updateWorkerProfile(data); setWp(data);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  }

  async function handleDocSave(nidFrontFile, nidBackFile) {
    setDocSaving(true); setDocError(''); setDocSaved(false);
    try {
      const fd = new FormData();
      if (nidFrontFile) fd.append('nidFront', nidFrontFile);
      if (nidBackFile)  fd.append('nidBack',  nidBackFile);
      fd.append('nidNumber', nidNumber);
      const res = await fetch('/api/profile/worker/documents', {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setDocError(data.message || 'Upload failed'); return; }
      updateWorkerProfile(data); setWp(data);
      setDocSaved(true); setTimeout(() => setDocSaved(false), 3000);
    } catch { setDocError('Network error.'); }
    finally { setDocSaving(false); }
  }

  async function handlePhoto(e) {
    const f = e.target.files[0]; if (!f) return;
    setPhotoLoad(true);
    const fd = new FormData(); fd.append('photo', f);
    try {
      const res = await fetch('/api/profile/worker/photo', {
        method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd,
      });
      const data = await res.json();
      if (res.ok) { updateWorkerProfile(data.worker); setWp(data.worker); }
    } finally { setPhotoLoad(false); }
  }

  if (!wp) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <RefreshCw className="w-7 h-7 text-gray-300 animate-spin" />
    </div>
  );

  const cat    = getCategoryInfo(wp.category);
  const status = STATUS[wp.status] || STATUS.pending;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">My Worker Profile</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage your listing on Karigori</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shrink-0 ${status.cls}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} />
            <span className="hidden sm:inline">{status.label}</span>
            <span className="sm:hidden">{wp.status}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: photo + stats ── */}
        <div className="space-y-4">
          {/* Photo card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center">
            <div className="relative mb-4">
              {photoLoading ? (
                <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : (
                <img
                  src={wp.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${wp.name}&backgroundColor=006A4E&textColor=ffffff`}
                  alt={wp.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                />
              )}
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-600 hover:bg-brand-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>

            <h2 className="font-bold text-gray-900 truncate w-full text-center">{wp.name}</h2>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mt-1 max-w-full"
              style={{ background: cat.bg, color: cat.color }}>
              <CategoryIcon category={wp.category} size={11} />
              <span className="truncate">{cat.label}</span>
            </span>

            {wp.status === 'approved' && (
              <div className="flex items-center gap-1.5 mt-2">
                {[1,2,3,4,5].map((i) => <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(wp.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}
                <span className="text-xs font-semibold text-gray-600">{wp.rating.toFixed(1)}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              {[
                { label: 'Reviews', val: wp.reviewCount },
                { label: 'Exp',     val: `${wp.experience}yr` },
                { label: 'Rate',    val: wp.hourlyRate ? `৳${wp.hourlyRate}` : '—' },
                { label: 'Areas',   val: wp.areas?.length || 0 },
              ].map(({ label, val }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-2 text-center">
                  <div className="text-[10px] text-gray-400">{label}</div>
                  <div className="text-sm font-bold text-gray-800 truncate">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <Toggle
              checked={form.available}
              onChange={(v) => setForm((f) => ({ ...f, available: v }))}
              label="Available for work"
              sublabel={form.available ? 'Visible to clients' : 'Hidden from clients'}
            />
          </div>

          {/* OTP verification card */}
          {!wp?.otpVerified && (
            <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-5">
              <OTPVerification wp={wp} token={token} onSuccess={(updated) => { updateWorkerProfile(updated); setWp(updated); }} />
            </div>
          )}

          {/* Verification progress */}
          <VerificationProgress
            level={wp.verificationLevel || 0}
            otpVerified={wp.otpVerified}
            nidFront={wp.nidFront}
            nidBack={wp.nidBack}
            selfie={wp.selfieWithId}
          />

          {wp.reuploadRequested && (
            <Alert type="warning">
              <strong>Re-upload requested:</strong> {wp.reuploadNote}
            </Alert>
          )}

          {wp.status === 'rejected' && wp.rejectionNote && (
            <Alert type="error"><strong>Rejection reason:</strong> {wp.rejectionNote}</Alert>
          )}
        </div>

        {/* ── Right: edit form ── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-gray-900">Edit Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FloatInput id="d_exp"   label="Experience (years)" value={form.experience} onChange={set('experience')} type="number" min="0" />
              <FloatInput id="d_rate"  label="Hourly Rate (৳)"    value={form.hourlyRate} onChange={set('hourlyRate')} type="number" min="0" />
            </div>
            <FloatInput    id="d_phone" label="Phone Number"                         value={form.phone}     onChange={set('phone')}     icon={Phone} />
            <FloatInput    id="d_lang"  label="Languages (comma-separated)"           value={form.languages} onChange={set('languages')} />
            <FloatTextarea id="d_bio"   label="Bio / About yourself"                  value={form.bio}       onChange={set('bio')}       rows={4} maxLen={400} />
          </div>

          {/* Service areas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" /> Service Areas
              <span className="text-xs font-normal text-gray-400">({selectedAreas.length} selected)</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-1 scrollbar-hide">
              {DHAKA_AREAS.map((a) => (
                <button key={a} type="button" onClick={() => toggleArea(a)}
                  className={`text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all
                    ${selectedAreas.includes(a) ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'}`}>
                  {selectedAreas.includes(a) ? '✓ ' : ''}{a}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {error  && <Alert type="error">{error}</Alert>}
          {saved  && <Alert type="success">Profile saved successfully!</Alert>}

          <button onClick={handleSave} disabled={saving}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
            {saving ? <Spinner label="Saving…" /> : <><Save className="w-4 h-4 shrink-0" /><span>Save Changes</span></>}
          </button>
        </div>

        {/* ── NID & Documents card ── */}
        <NIDSection wp={wp} nidNumber={nidNumber} setNidNumber={setNidNumber} onSave={handleDocSave} saving={docSaving} saved={docSaved} error={docError} />
      </div>
    </div>
  );
}
