import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wrench, LogOut, User, ShieldCheck, LayoutDashboard,
  ChevronDown, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { pathname }              = useLocation();
  const navigate                  = useNavigate();
  const { user, logout }          = useAuth();
  const [userMenu, setUserMenu]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);

  function handleLogout() { logout(); navigate('/'); setUserMenu(false); setMobile(false); }

  const active = (path) => path === '/' ? pathname === '/' : pathname.startsWith(path);
  const linkCls = (path) => `text-sm font-semibold transition-colors ${active(path) ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`;

  const dashPath = user?.role === 'admin' ? '/admin' : user?.role === 'worker' ? '/dashboard' : '/account';
  const RoleIcon = { worker: Wrench, client: User, admin: ShieldCheck }[user?.role] || User;

  const NAV_LINKS = [
    { to: '/',       label: 'হোম' },
    { to: '/browse', label: 'কারিগর খুঁজুন' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobile(false)}>
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight hidden xs:block">
              <span className="block text-base font-bold text-gray-900 font-bn">কারিগরি</span>
              <span className="block text-[10px] font-semibold text-brand-600 tracking-widest uppercase -mt-0.5">Karigori</span>
            </div>
            <span className="text-base font-bold text-gray-900 font-bn xs:hidden">কারিগরি</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={`${linkCls(l.to)} font-bn`}>{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-brand-600 transition-colors px-3 py-2">
                  সাইন ইন
                </Link>
                <Link to="/register"
                  className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors shadow-sm font-bn">
                  রেজিস্টার
                </Link>
              </>
            ) : (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors">
                  <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center shrink-0">
                    <RoleIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[5rem] truncate hidden sm:block">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                </button>

                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 capitalize
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'worker' ? 'bg-brand-100 text-brand-700' : 'bg-blue-100 text-blue-700'}`}>
                          <RoleIcon className="w-2.5 h-2.5" /> {user.role}
                        </span>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { navigate(dashPath); setUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-bn">
                          <LayoutDashboard className="w-4 h-4 text-gray-400 shrink-0" />
                          {user.role === 'admin' ? 'অ্যাডমিন প্যানেল' : user.role === 'worker' ? 'আমার প্রোফাইল' : 'আমার অ্যাকাউন্ট'}
                        </button>
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-bn">
                          <LogOut className="w-4 h-4 shrink-0" /> সাইন আউট
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobile(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
              {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobile(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors font-bn
                  ${active(l.to) ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setMobile(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors font-bn">
                সাইন ইন
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
