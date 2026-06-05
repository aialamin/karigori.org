import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Save, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { DHAKA_AREAS } from '../constants.js';
import { FloatInput, Alert, Spinner } from '../components/ui.jsx';

export default function ClientDashboard() {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name,  setName]  = useState(user?.name  || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [area,  setArea]  = useState(user?.area  || '');
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState('');

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/profile/client', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ name, phone, area }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Save failed'); return; }
      updateUser(data);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { setError('Network error.'); }
    finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl font-extrabold text-gray-900">My Account</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your profile and location preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          {/* User avatar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-xl font-extrabold text-blue-600 shrink-0">
              {(name || user?.name || 'C')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <FloatInput id="cl_name"  label="Full Name"    value={name}  onChange={(e) => setName(e.target.value)}  required />
            <FloatInput id="cl_phone" label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Area in Dhaka</p>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select value={area} onChange={(e) => setArea(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:border-brand-500 transition-colors appearance-none cursor-pointer">
                  <option value="">Any area (optional)</option>
                  {DHAKA_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              {area && (
                <p className="text-xs text-brand-600 mt-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" /> Browse will pre-filter for {area}
                </p>
              )}
            </div>

            {error  && <Alert type="error">{error}</Alert>}
            {saved  && <Alert type="success">Profile saved!</Alert>}

            <button type="submit" disabled={saving}
              className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              {saving ? <Spinner label="Saving…" /> : <><Save className="w-4 h-4 shrink-0" /><span>Save Profile</span></>}
            </button>
          </form>
        </div>

        {/* Find workers */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <h2 className="font-bold text-gray-900 mb-1">Find Workers Near You</h2>
            <p className="text-sm text-gray-400 mb-5">Search professionals in your area</p>

            <div className="space-y-3">
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select value={area} onChange={(e) => setArea(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:border-brand-500 transition-colors appearance-none cursor-pointer">
                  <option value="">Any area in Dhaka</option>
                  {DHAKA_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <button onClick={() => navigate(area ? `/browse?q=${encodeURIComponent(area)}` : '/browse')}
                className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                <Search className="w-4 h-4 shrink-0" />
                <span>{area ? `Search in ${area}` : 'Search All Areas'}</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-600 to-emerald-700 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-1.5">Browse All Services</h3>
            <p className="text-white/70 text-sm mb-5 leading-relaxed">Plumbers, electricians, cleaners and more across all Dhaka areas</p>
            <button onClick={() => navigate('/browse')}
              className="bg-white text-brand-700 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all w-fit">
              <span>Browse Workers</span><ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
