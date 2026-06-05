import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/* ── helpers ── */
function readCache(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function writeCache(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function clearCache() {
  ['kg_token', 'kg_user', 'kg_worker'].forEach((k) => localStorage.removeItem(k));
}

export function AuthProvider({ children }) {
  // Initialise instantly from localStorage — zero flash on reload
  const [user,          setUser]          = useState(() => readCache('kg_user'));
  const [workerProfile, setWorkerProfile] = useState(() => readCache('kg_worker'));
  // Only show global loading spinner when we have a token but not yet verified
  const [loading, setLoading] = useState(() => !!localStorage.getItem('kg_token') && !readCache('kg_user'));

  useEffect(() => {
    const tk = localStorage.getItem('kg_token');
    if (!tk) { setLoading(false); return; }

    // Background re-verify — refresh cached data silently
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${tk}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setUser(data.user);
          setWorkerProfile(data.workerProfile || null);
          writeCache('kg_user',   data.user);
          writeCache('kg_worker', data.workerProfile || null);
        } else {
          // Token expired / invalid — clean up
          clearCache();
          setUser(null);
          setWorkerProfile(null);
        }
      })
      .catch(() => {
        // Network error — keep cached state, don't log out
      })
      .finally(() => setLoading(false));
  }, []);

  function login(data) {
    localStorage.setItem('kg_token', data.token);
    writeCache('kg_user',   data.user);
    writeCache('kg_worker', data.workerProfile || null);
    setUser(data.user);
    setWorkerProfile(data.workerProfile || null);
  }

  function logout() {
    clearCache();
    setUser(null);
    setWorkerProfile(null);
  }

  function updateWorkerProfile(wp) {
    setWorkerProfile(wp);
    writeCache('kg_worker', wp);
  }

  function updateUser(patch) {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      writeCache('kg_user', next);
      return next;
    });
  }

  const token = () => localStorage.getItem('kg_token');

  return (
    <AuthContext.Provider value={{
      user, workerProfile, loading,
      login, logout, token,
      updateWorkerProfile, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
