import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Wrench, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { FloatInput, Alert, Spinner } from '../components/ui.jsx';

const TABS = [
  { key: 'worker', label: 'Worker', icon: Wrench,     color: 'text-brand-600'  },
  { key: 'client', label: 'Client', icon: User,        color: 'text-blue-600'   },
  { key: 'admin',  label: 'Admin',  icon: ShieldCheck, color: 'text-purple-600' },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from || '/';

  const [tab, setTab]         = useState('worker');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShow]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Login failed'); return; }
      if (data.user.role !== tab) {
        setError(`This account is registered as "${data.user.role}". Please select the correct tab.`);
        return;
      }
      login(data);
      if (data.user.role === 'admin')  navigate('/admin');
      else if (data.user.role === 'worker') navigate('/dashboard');
      else navigate(from);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your Karigori account</p>
        </div>

        {/* Role tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 gap-1">
          {TABS.map((t) => (
            <button key={t.key} type="button"
              onClick={() => { setTab(t.key); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-sm font-semibold transition-all duration-200 min-w-0
                ${tab === t.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <t.icon className={`w-4 h-4 shrink-0 ${tab === t.key ? t.color : ''}`} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'admin' && (
          <div className="mb-4">
            <Alert type="info">
              Demo credentials: <strong>admin@karigori.com</strong> / <strong>admin123</strong>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <FloatInput id="login_email" label="Email address" type="email"
            value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />

          <FloatInput id="login_pass" label="Password" type={showPass ? 'text' : 'password'}
            value={password} onChange={(e) => setPass(e.target.value)} icon={Lock} required
            right={
              <button type="button" onClick={() => setShow(!showPass)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {error && <Alert type="error">{error}</Alert>}

          <button type="submit" disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm">
            {loading ? <Spinner label="Signing in…" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4 shrink-0" /></>}
          </button>
        </form>

        {tab !== 'admin' && (
          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Register as {tab}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
