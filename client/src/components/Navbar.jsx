import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wrench, LogOut, User, ShieldCheck, LayoutDashboard,
  ChevronDown, Menu, X, Search, FileText, Lock, Shield, BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { pathname }          = useLocation();
  const navigate              = useNavigate();
  const { user, logout }      = useAuth();
  const [userMenu, setMenu]   = useState(false);
  const [mobileOpen, setMob]  = useState(false);

  function handleLogout() { logout(); navigate('/'); setMenu(false); setMob(false); }

  const active = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path);

  const dashPath = user?.role === 'admin' ? '/admin' : user?.role === 'worker' ? '/dashboard' : '/account';
  const RoleIcon = { worker: Wrench, client: User, admin: ShieldCheck }[user?.role] || User;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMob(false)}>
          <div className="w-9 h-9 bg-navy-900 rounded-xl flex items-center justify-center shadow-navy">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div className="hidden xs:block">
            <span className="block text-base font-black text-navy-900 leading-none tracking-tight">কারিগরি</span>
            <span className="block text-[10px] font-bold text-trust-500 tracking-[0.15em] uppercase leading-none mt-0.5">Karigori</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { to: '/',       label: 'হোম' },
            { to: '/browse', label: 'কারিগর খুঁজুন' },
            { to: '/blog',   label: 'ব্লগ' },
            { to: '/pages',  label: 'শহরভিত্তিক সেবা' },
            { to: '/about',  label: 'আমাদের সম্পর্কে' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${active(to)
                  ? 'bg-trust-50 text-trust-700'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-gray-50'}`}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search icon */}
          <button onClick={() => pathname === '/' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/browse')}
            className="p-2 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {!user ? (
            <>
              <Link to="/login"
                className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-navy-900 px-3 py-2 transition-colors">
                সাইন ইন
              </Link>
              <Link to="/register"
                className="btn-primary text-sm px-5 py-2.5 hidden sm:flex">
                রেজিস্টার
              </Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setMenu(!userMenu)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors">
                <div className="w-7 h-7 bg-navy-900 rounded-full flex items-center justify-center shrink-0">
                  <RoleIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-navy-900 max-w-[5rem] truncate hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
              </button>

              {userMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-navy-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 capitalize
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'worker' ? 'bg-trust-100 text-trust-700' : 'bg-blue-100 text-blue-700'}`}>
                        <RoleIcon className="w-2.5 h-2.5" /> {user.role}
                      </span>
                    </div>
                    <div className="py-1.5">
                      <button onClick={() => { navigate(dashPath); setMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-navy-900 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-slate-400 shrink-0" />
                        {user.role === 'admin' ? 'Admin Panel' : user.role === 'worker' ? 'আমার প্রোফাইল' : 'আমার অ্যাকাউন্ট'}
                      </button>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4 shrink-0" /> সাইন আউট
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button onClick={() => setMob(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
            {mobileOpen ? <X className="w-5 h-5 text-navy-900" /> : <Menu className="w-5 h-5 text-navy-900" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-6 pt-3 space-y-1">
          {[
            { to: '/',       label: 'হোম' },
            { to: '/browse', label: 'কারিগর খুঁজুন' },
            { to: '/blog',   label: 'ব্লগ' },
            { to: '/pages',  label: 'শহরভিত্তিক সেবা' },
            { to: '/about',  label: 'আমাদের সম্পর্কে' },
            { to: '/help',   label: 'সাহায্য' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMob(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                ${active(to) ? 'bg-trust-50 text-trust-700' : 'text-navy-900 hover:bg-gray-50'}`}>
              {label}
            </Link>
          ))}
          {!user && (
            <Link to="/login" onClick={() => setMob(false)}
              className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-navy-900 hover:bg-gray-50 transition-colors">
              সাইন ইন
            </Link>
          )}
          <div className="border-t border-gray-100 pt-3 mt-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">নীতিমালা</p>
            {[
              { to: '/disclaimer', icon: Shield,   label: 'ডিসক্লেইমার' },
              { to: '/terms',      icon: FileText, label: 'শর্তাবলী' },
              { to: '/privacy',    icon: Lock,     label: 'প্রাইভেসি পলিসি' },
            ].map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setMob(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-gray-50 transition-colors">
                <l.icon className="w-4 h-4 shrink-0" /> {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
