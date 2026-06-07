import { lazy, Suspense, useState, useEffect, Component } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext.jsx';
import { ConfigProvider, useConfig } from './context/ConfigContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BottomNav from './components/BottomNav.jsx';
import NoticeModal from './components/NoticeModal.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const Home            = lazy(() => import('./pages/Home.jsx'));
const Browse          = lazy(() => import('./pages/Browse.jsx'));
const WorkerProfile   = lazy(() => import('./pages/WorkerProfile.jsx'));
const Login           = lazy(() => import('./pages/Login.jsx'));
const Register        = lazy(() => import('./pages/Register.jsx'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard.jsx'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard.jsx'));
const Disclaimer      = lazy(() => import('./pages/Disclaimer.jsx'));
const Privacy         = lazy(() => import('./pages/Privacy.jsx'));
const Terms           = lazy(() => import('./pages/Terms.jsx'));
const Blog            = lazy(() => import('./pages/Blog.jsx'));
const BlogPost        = lazy(() => import('./pages/BlogPost.jsx'));
const AdminLogin      = lazy(() => import('./pages/AdminLogin.jsx'));
const AllPages        = lazy(() => import('./pages/AllPages.jsx'));
const CityPage        = lazy(() => import('./pages/CityPage.jsx'));
const PriceGuide      = lazy(() => import('./pages/PriceGuide.jsx'));
const Help            = lazy(() => import('./pages/Help.jsx'));
const About           = lazy(() => import('./pages/About.jsx'));

/* ── Error boundary — catches lazy-load/chunk failures + render errors ── *
 * If the error looks like a stale chunk (PWA cache mismatch), auto-reload once.
 * Uses localStorage flag to avoid reload loops.
 */
const RELOAD_KEY = 'kg_chunk_reload_v1';

class ErrorBoundary extends Component {
  state = { error: null, errMsg: '' };

  static getDerivedStateFromError(err) {
    return { error: err, errMsg: err?.message || '' };
  }

  componentDidCatch(err, info) {
    // Always log to console — open DevTools > Console to see the real error
    console.error('[Karigori ErrorBoundary]', err, info?.componentStack);
  }

  /* Reset when the resetKey prop changes (i.e. user navigated) */
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null, errMsg: '' });
    }
    /* Auto-reload for stale-chunk errors (PWA cache mismatch) */
    if (this.state.error && !prevProps.resetKey !== !this.props.resetKey) return;
    if (this.state.error && !sessionStorage.getItem(RELOAD_KEY)) {
      const isChunk = /loading chunk|failed to fetch|dynamically imported|load failed|unexpected token/i.test(this.state.errMsg);
      if (isChunk) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations()
            .then(regs => Promise.all(regs.map(r => r.unregister())))
            .then(() => window.location.reload());
        } else {
          window.location.reload();
        }
      }
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    const isChunk = /loading chunk|failed to fetch|dynamically imported|load failed|unexpected token/i.test(this.state.errMsg);
    if (isChunk && !sessionStorage.getItem(RELOAD_KEY)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
          <div className="w-8 h-8 border-4 border-green-100 border-t-green-700 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">আপডেট লোড হচ্ছে…</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-5xl">⚠️</p>
        <h2 className="text-xl font-black text-gray-800">পেজ লোড করা যায়নি</h2>
        <p className="text-sm text-gray-500 max-w-xs">একটু সমস্যা হয়েছে। পেজ রিফ্রেশ করুন অথবা হোমে যান।</p>
        {import.meta.env.DEV && (
          <pre className="text-xs text-red-500 text-left max-w-sm overflow-auto bg-red-50 p-2 rounded">{this.state.errMsg}</pre>
        )}
        <div className="flex gap-3">
          <button onClick={() => { sessionStorage.removeItem(RELOAD_KEY); window.location.reload(); }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: '#006A4E' }}>রিফ্রেশ করুন</button>
          <a href="/" className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-700">হোমে যান</a>
        </div>
      </div>
    );
  }
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-green-100 border-t-green-700 rounded-full animate-spin" />
    </div>
  );
}

/* Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/* Inner shell — has access to ConfigContext */
function Shell() {
  const { notice, loaded } = useConfig();
  const { pathname }       = useLocation();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    if (!notice?.active || !notice?.message) return;
    // Show only once per session
    const key = `kg_notice_seen_${notice.message.slice(0, 20)}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    setShowNotice(true);
  }, [loaded, notice]);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 min-w-0">
        {/* resetKey=pathname clears error state on navigation without unmounting children */}
        <ErrorBoundary resetKey={pathname}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Static / protected routes (must all come before dynamic /:city) ── */}
            <Route path="/"                     element={<Home />} />
            <Route path="/browse"               element={<Browse />} />
            <Route path="/browse/:category"     element={<Browse />} />
            <Route path="/worker/:id"           element={<WorkerProfile />} />
            <Route path="/login"                element={<Login />} />
            <Route path="/admin-login"          element={<AdminLogin />} />
            <Route path="/register"             element={<Register />} />
            <Route path="/pages"                element={<AllPages />} />
            <Route path="/blog"                 element={<Blog />} />
            <Route path="/blog/:slug"           element={<BlogPost />} />
            <Route path="/disclaimer"           element={<Disclaimer />} />
            <Route path="/privacy"              element={<Privacy />} />
            <Route path="/terms"                element={<Terms />} />
            <Route path="/help"                 element={<Help />} />
            <Route path="/about"                element={<About />} />
            <Route path="/price-guide/:service" element={<PriceGuide />} />
            <Route path="/dashboard" element={
              <ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>
            } />
            {/* ── City pages — homepage clone with local keyword ── */}
            <Route path="/:city"                element={<CityPage />} />
            {/* 404 fallback — must be last */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <p className="text-6xl">🔍</p>
                <h1 className="text-2xl font-black text-gray-900">পেজ পাওয়া যায়নি</h1>
                <p className="text-gray-500 text-sm">এই ঠিকানায় কোনো পেজ নেই।</p>
                <a href="/" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: '#006A4E' }}>হোমে ফিরুন</a>
              </div>
            } />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <BottomNav />

      {/* Admin notice modal */}
      {showNotice && notice?.active && (
        <NoticeModal notice={notice} onClose={() => setShowNotice(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ConfigProvider>
          <Shell />
        </ConfigProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
