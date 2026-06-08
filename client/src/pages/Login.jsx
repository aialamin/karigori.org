import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Wrench, User, ArrowRight, Lock, AtSign, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { FloatInput, Alert, Spinner } from '../components/ui.jsx';

const G = '#006A4E';

const TABS = [
  { key: 'worker', label: 'কারিগর',    Icon: Wrench, color: 'text-green-700' },
  { key: 'client', label: 'ক্লায়েন্ট', Icon: User,   color: 'text-blue-600'  },
];

const REMEMBER_KEY = 'kg_remember';
function loadRemembered() {
  try { return JSON.parse(localStorage.getItem(REMEMBER_KEY)) || null; } catch { return null; }
}
function saveRemembered(d) { try { localStorage.setItem(REMEMBER_KEY, JSON.stringify(d)); } catch {} }
function clearRemembered() { try { localStorage.removeItem(REMEMBER_KEY); } catch {} }

/* ── Forgot Password Modal ── */
function ForgotModal({ onClose }) {
  const [step,    setStep]    = useState(1);
  const [email,   setEmail]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [pass,    setPass]    = useState('');
  const [pass2,   setPass2]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [show,    setShow]    = useState(false);

  async function sendOtp() {
    if (!email.trim()) { setError('ইমেইল দিন'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.message || 'ব্যর্থ হয়েছে'); return; }
      setStep(2);
    } catch { setError('নেটওয়ার্ক সমস্যা'); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    if (!otp.trim()) { setError('OTP দিন'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.message || 'OTP ভুল'); return; }
      setStep(3);
    } catch { setError('নেটওয়ার্ক সমস্যা'); }
    finally { setLoading(false); }
  }

  async function resetPass() {
    if (!pass || pass.length < 6) { setError('কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন'); return; }
    if (pass !== pass2) { setError('পাসওয়ার্ড মিলছে না'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp, newPassword: pass }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.message || 'ব্যর্থ হয়েছে'); return; }
      setStep(4);
    } catch { setError('নেটওয়ার্ক সমস্যা'); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${G}, #16a34a)` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.18)' }}>
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-base">পাসওয়ার্ড ভুলে গেছেন?</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {step === 1 && 'ইমেইল দিন — OTP পাঠাবো'}
                {step === 2 && 'ইমেইলে আসা OTP দিন'}
                {step === 3 && 'নতুন পাসওয়ার্ড সেট করুন'}
                {step === 4 && 'পাসওয়ার্ড রিসেট সম্পন্ন!'}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 mt-4">
            {[1,2,3,4].map((s) => (
              <div key={s} className="h-1.5 flex-1 rounded-full transition-all"
                style={{ background: step >= s ? '#fff' : 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {error && <Alert type="error">{error}</Alert>}

          {step === 1 && (
            <>
              <FloatInput id="fp_email" label="নিবন্ধিত ইমেইল ঠিকানা" type="email"
                value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                icon={AtSign} required />
              <button onClick={sendOtp} disabled={loading}
                className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${G}, #16a34a)` }}>
                {loading ? <Spinner label="পাঠানো হচ্ছে…" /> : 'OTP পাঠান →'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                📧 <strong>{email}</strong>-এ ৬ সংখ্যার OTP পাঠানো হয়েছে।
              </p>
              <FloatInput id="fp_otp" label="OTP কোড (৬ সংখ্যা)" type="number"
                value={otp} onChange={(e) => { setOtp(e.target.value); setError(''); }} required />
              <button onClick={verifyOtp} disabled={loading}
                className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${G}, #16a34a)` }}>
                {loading ? <Spinner label="যাচাই হচ্ছে…" /> : 'OTP যাচাই করুন →'}
              </button>
              <button onClick={() => { setStep(1); setOtp(''); setError(''); }}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1">
                ← ইমেইল পরিবর্তন করুন
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="relative">
                <FloatInput id="fp_pass" label="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                  type={show ? 'text' : 'password'}
                  value={pass} onChange={(e) => { setPass(e.target.value); setError(''); }}
                  icon={Lock} required
                  right={
                    <button type="button" onClick={() => setShow(!show)}
                      className="text-gray-400 hover:text-gray-600 p-1">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>
              <FloatInput id="fp_pass2" label="পাসওয়ার্ড নিশ্চিত করুন"
                type="password" value={pass2}
                onChange={(e) => { setPass2(e.target.value); setError(''); }}
                icon={Lock} required />
              {pass && pass2 && pass !== pass2 && (
                <p className="text-xs text-red-500">⚠ পাসওয়ার্ড মিলছে না</p>
              )}
              <button onClick={resetPass} disabled={loading}
                className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${G}, #16a34a)` }}>
                {loading ? <Spinner label="সেট হচ্ছে…" /> : 'পাসওয়ার্ড সেট করুন ✓'}
              </button>
            </>
          )}

          {step === 4 && (
            <div className="text-center py-4 space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: '#dcfce7' }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: G }} />
              </div>
              <p className="font-black text-gray-900">পাসওয়ার্ড রিসেট সম্পন্ন!</p>
              <p className="text-sm text-gray-500">নতুন পাসওয়ার্ড দিয়ে এখন লগইন করুন।</p>
              <button onClick={onClose}
                className="w-full py-3 rounded-xl font-black text-white text-sm"
                style={{ background: G }}>
                লগইন পেজে যান
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Login Page ── */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const from = location.state?.from || '/';

  const [tab,        setTab]      = useState('worker');
  const [identifier, setId]       = useState('');
  const [password,   setPass]     = useState('');
  const [showPass,   setShow]     = useState(false);
  const [remember,   setRemember] = useState(false);
  const [error,      setError]    = useState('');
  const [loading,    setLoading]  = useState(false);
  const [savedLabel, setSaved]    = useState('');
  const [forgot,     setForgot]   = useState(false);

  useEffect(() => {
    const saved = loadRemembered();
    if (saved) {
      setId(saved.identifier || '');
      // Password intentionally NOT restored — never persisted for security
      setTab(saved.tab || 'worker');
      setRemember(true);
      setSaved(saved.identifier || '');
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin')       navigate('/admin',     { replace: true });
      else if (user.role === 'worker') navigate('/dashboard', { replace: true });
      else                             navigate(from,          { replace: true });
    }
  }, [user, navigate, from]);

  const isEmail   = identifier.includes('@');
  const inputType = identifier && !isEmail ? 'tel' : 'email';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password) { setError('সব তথ্য পূরণ করুন।'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'লগইন ব্যর্থ হয়েছে'); return; }
      if (data.user.role !== tab) {
        setError(`এই অ্যাকাউন্টটি "${data.user.role}" হিসেবে নিবন্ধিত। সঠিক ট্যাব বেছে নিন।`);
        return;
      }
      // Never store password — only save identifier + tab for convenience
      if (remember) saveRemembered({ identifier: identifier.trim(), tab });
      else clearRemembered();
      login(data);
    } catch { setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>লগইন | কারিগরি</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {forgot && <ForgotModal onClose={() => setForgot(false)} />}

      {/* Hero strip */}
      <div className="py-10 text-center" style={{ background: `linear-gradient(135deg, ${G}, #16a34a)` }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.18)' }}>
          <Wrench className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-black text-white text-2xl">কারিগরি</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          {savedLabel && (
            <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-2xl border-2"
              style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: G }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-green-800">সেভ করা অ্যাকাউন্ট</p>
                <p className="text-xs text-green-700 truncate">{savedLabel}</p>
              </div>
              <button type="button"
                onClick={() => { clearRemembered(); setId(''); setPass(''); setRemember(false); setSaved(''); }}
                className="text-xs text-green-600 hover:text-green-900 font-semibold shrink-0">
                মুছুন
              </button>
            </div>
          )}

          {/* Role tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-5 gap-1">
            {TABS.map((t) => (
              <button key={t.key} type="button" onClick={() => { setTab(t.key); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-sm font-bold transition-all
                  ${tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                <t.Icon className={`w-4 h-4 shrink-0 ${tab === t.key ? t.color : ''}`} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                ইমেইল অথবা ফোন নম্বর
              </p>
              <FloatInput id="login_id" label="ইমেইল বা ফোন নম্বর দিন"
                type={inputType} value={identifier}
                onChange={(e) => { setId(e.target.value); setError(''); }}
                icon={AtSign} required />
              {identifier && (
                <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${isEmail ? 'bg-blue-400' : 'bg-amber-400'}`} />
                  {isEmail ? 'ইমেইল দিয়ে লগইন হবে' : 'ফোন নম্বর দিয়ে লগইন হবে'}
                </p>
              )}
            </div>

            <FloatInput id="login_pass" label="পাসওয়ার্ড"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPass(e.target.value); setError(''); }}
              icon={Lock} required
              right={
                <button type="button" onClick={() => setShow(!showPass)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Remember + Forgot row */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div onClick={() => setRemember(!remember)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
                    ${remember ? 'border-green-700' : 'border-gray-300 group-hover:border-green-400'}`}
                  style={remember ? { background: G } : {}}>
                  {remember && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-600">মনে রাখুন</span>
              </label>
              <button type="button" onClick={() => setForgot(true)}
                className="text-xs font-bold transition-colors hover:underline"
                style={{ color: G }}>
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            {error && <Alert type="error">{error}</Alert>}

            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${G} 0%, #16a34a 100%)` }}>
              {loading
                ? <Spinner label="লগইন হচ্ছে…" />
                : <><span>সাইন ইন</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            অ্যাকাউন্ট নেই?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: G }}>
              {tab === 'worker' ? 'কারিগর হিসেবে নিবন্ধন করুন' : 'ক্লায়েন্ট নিবন্ধন করুন'}
            </Link>
          </p>

          {/* Admin login link */}
          <p className="text-center mt-3">
            <Link to="/admin-login"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
              🔐 অ্যাডমিন? এখানে লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
