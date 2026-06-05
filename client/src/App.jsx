import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

/* Code-split every page — only the active page's JS is loaded */
const Home            = lazy(() => import('./pages/Home.jsx'));
const Browse          = lazy(() => import('./pages/Browse.jsx'));
const WorkerProfile   = lazy(() => import('./pages/WorkerProfile.jsx'));
const Login           = lazy(() => import('./pages/Login.jsx'));
const Register        = lazy(() => import('./pages/Register.jsx'));
const WorkerDashboard = lazy(() => import('./pages/WorkerDashboard.jsx'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard.jsx'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard.jsx'));
const Disclaimer      = lazy(() => import('./pages/Disclaimer.jsx'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 min-w-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/browse"    element={<Browse />} />
              <Route path="/browse/:category" element={<Browse />} />
              <Route path="/worker/:id"       element={<WorkerProfile />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/register"  element={<Register />} />
              <Route path="/disclaimer" element={<Disclaimer />} />

              <Route path="/dashboard" element={
                <ProtectedRoute role="worker"><WorkerDashboard /></ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/account" element={
                <ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
