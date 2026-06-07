import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, Search, ChevronDown, CheckCircle2, LocateFixed, Loader2, MapPin, Navigation } from 'lucide-react';
import { getCategoryInfo, BANGLADESH_LOCATIONS } from '../constants.js';
import { expandLocation, getLocationGroups } from '../data/bangladesh.js';
import { trackPageView, trackSearch } from '../hooks/useAnalytics.js';
import { getSubcategoriesForCategory } from '../data/categories.js';
import { useConfig } from '../context/ConfigContext.jsx';
import SEOHead, { getCategorySEO } from '../components/SEOHead.jsx';
import { CategoryIcon } from '../components/CategoryIcon.jsx';
import WorkerCard from '../components/WorkerCard.jsx';
import { Toggle } from '../components/ui.jsx';
import { useUserLocation } from '../hooks/useUserLocation.js';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Best Match' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'reviews',    label: 'Most Reviews' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'exp',        label: 'Most Experienced' },
];

export default function Browse() {
  const { allCategories, allAreas } = useConfig();
  const { category: catParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userLoc = useUserLocation();

  const [allWorkers, setAllWorkers]    = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedCat, setSelectedCat] = useState(catParam || '');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyVerified, setOnlyVerified]   = useState(false);
  const [sort, setSort]               = useState('default');
  const [localQ, setLocalQ]           = useState(searchParams.get('q') || '');
  const [searchQ, setSearchQ]         = useState(searchParams.get('q') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => { if (catParam) setSelectedCat(catParam); }, [catParam]);

  const fetchWorkers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const p = new URLSearchParams();
      if (selectedCat)   p.set('category', selectedCat);
      if (onlyAvailable) p.set('available', 'true');
      if (sort)          p.set('sort', sort);
      p.set('limit', '60');
      const effectiveQ = searchQ || selectedArea;
      if (effectiveQ) {
        const expanded = expandLocation(effectiveQ);
        p.set('q', expanded.length > 1 ? expanded.slice(0, 20).join('|') : effectiveQ);
      }
      const res = await fetch(`/api/workers?${p}`);
      if (!res.ok) throw new Error('Failed to load workers');
      const data = await res.json();
      setAllWorkers(Array.isArray(data.workers) ? data.workers : []);
      if (searchQ) trackSearch();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [selectedCat, selectedArea, onlyAvailable, sort, searchQ]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  // Auto-apply detected location → area filter
  useEffect(() => {
    if (userLoc.area && !selectedArea) {
      setSelectedArea(userLoc.area);
    }
  }, [userLoc.area]);

  function clearFilters() {
    setSelectedCat(''); setSelectedArea('');
    setOnlyAvailable(false); setOnlyVerified(false);
    setSort('default'); setSearchQ(''); setLocalQ('');
  }

  function submitSearch(e) {
    e.preventDefault();
    setSearchQ(localQ);
  }

  const workers = useMemo(
    () => onlyVerified ? allWorkers.filter((w) => w.verified) : allWorkers,
    [allWorkers, onlyVerified]
  );
  const activeFilters = [selectedCat, selectedArea, onlyAvailable, onlyVerified, searchQ].filter(Boolean).length;
  const catInfo = selectedCat ? getCategoryInfo(selectedCat) : null;
  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;
  const subcategories = selectedCat ? getSubcategoriesForCategory(selectedCat) : [];

  // ── Filter chips ──
  const chips = [
    selectedCat  && { label: catInfo?.label, onRemove: () => setSelectedCat('') },
    selectedArea && { label: selectedArea, onRemove: () => setSelectedArea('') },
    onlyAvailable && { label: 'Available Now', onRemove: () => setOnlyAvailable(false) },
    onlyVerified  && { label: 'Verified Only', onRemove: () => setOnlyVerified(false) },
    searchQ && { label: `"${searchQ}"`, onRemove: () => { setSearchQ(''); setLocalQ(''); } },
  ].filter(Boolean);

  const Sidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
          <SlidersHorizontal className="w-4 h-4 text-trust-500" /> Filters
        </span>
        {activeFilters > 0 && (
          <button onClick={clearFilters} className="text-xs text-trust-500 font-semibold hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</p>
        <div className="space-y-0.5">
          <button
            onClick={() => setSelectedCat('')}
            className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${selectedCat === '' ? 'bg-trust-500 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {selectedCat === '' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
            All Categories
          </button>
          {allCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCat(selectedCat === c.key ? '' : c.key)}
              className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${selectedCat === c.key ? 'font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
              style={selectedCat === c.key ? { background: c.bg, color: c.color } : {}}
            >
              <span className="shrink-0"><CategoryIcon category={c.key} size={13} /></span>
              {c.label}
              {selectedCat === c.key && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Area in Dhaka</p>
        <div className="relative">
          <select
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-100 transition-all appearance-none pr-8 cursor-pointer"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">All Bangladesh</option>
            {getLocationGroups().map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((o) => (
                  <option key={o.value} value={o.value}
                    style={o.isDistrict ? { fontWeight: 700 } : {}}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Toggles */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Filters</p>
        <div className="space-y-2">
          <Toggle checked={onlyAvailable} onChange={setOnlyAvailable} label="Available now" />
          <Toggle checked={onlyVerified}  onChange={setOnlyVerified} label="Verified only" />
        </div>
      </div>
    </div>
  );

  const seo = selectedCat
    ? getCategorySEO(selectedCat, selectedArea)
    : { title: `${selectedArea ? selectedArea + ' এ ' : ''}সব কারিগর — প্লাম্বার, ইলেক্ট্রিশিয়ান ও আরও`, canonical: '/browse' };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead {...seo} />

      {/* ── Location banner ── */}
      {userLoc.area && (
        <div className="bg-trust-500 text-white py-2.5 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="w-4 h-4 shrink-0 text-amber-300" />
              <span>
                {userLoc.method === 'gps' ? 'GPS থেকে সনাক্ত:' : 'আপনার এলাকা:'}{' '}
                <strong className="text-amber-200">{userLoc.area}</strong> এর কারিগর দেখাচ্ছে
              </span>
            </div>
            <button onClick={() => { userLoc.clear(); setSelectedArea(''); }}
              className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors shrink-0">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-3">
          {/* Row 1: title + sort + Near Me */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {catInfo
                  ? <span style={{ color: catInfo.color }}><CategoryIcon category={selectedCat} size={18} /></span>
                  : null
                }
                {catInfo ? `${catInfo.label}${selectedArea ? ` — ${selectedArea}` : ''}` : 'সব কারিগর — বাংলাদেশ'}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading ? 'খোঁজা হচ্ছে…' : `${workers.length} জন কারিগর পাওয়া গেছে${selectedArea ? ` — ${selectedArea}` : ' — বাংলাদেশ'}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative hidden sm:block">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-gray-200 rounded-xl pl-3 pr-8 py-2 bg-white text-gray-700 focus:outline-none focus:border-trust-500 focus:ring-2 focus:ring-trust-100 appearance-none cursor-pointer transition-all font-medium"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Near Me button */}
              <button
                onClick={userLoc.area ? () => { userLoc.clear(); setSelectedArea(''); } : userLoc.detect}
                disabled={userLoc.loading}
                title={userLoc.area ? `Showing: ${userLoc.area} — Click to clear` : 'Find workers near me'}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-all
                  ${userLoc.area
                    ? 'bg-trust-500 text-white hover:bg-trust-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-trust-50 hover:text-trust-600 hover:border hover:border-trust-300'
                  } disabled:opacity-60`}
              >
                {userLoc.loading
                  ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  : userLoc.area
                    ? <><Navigation className="w-4 h-4 shrink-0" /><span className="hidden sm:inline truncate max-w-[80px]">{userLoc.area}</span><X className="w-3.5 h-3.5 shrink-0" /></>
                    : <><LocateFixed className="w-4 h-4 shrink-0" /><span className="hidden sm:inline">Near Me</span></>
                }
              </button>

              {/* Mobile filter btn */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="sm:hidden flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilters > 0 && (
                  <span className="bg-trust-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center" style={{ width: 18, height: 18 }}>
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: search bar */}
          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 gap-2 focus-within:border-trust-400 focus-within:ring-2 focus-within:ring-trust-100 transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                placeholder="Search by name, skill or area…"
                className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
              {localQ && (
                <button type="button" onClick={() => { setLocalQ(''); setSearchQ(''); searchRef.current?.focus(); }}>
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button type="submit" className="bg-trust-500 hover:bg-trust-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all">
              Search
            </button>
          </form>

          {/* Row 3: active chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((chip, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-trust-50 text-trust-600 border border-trust-200 px-2.5 py-1 rounded-full">
                  {chip.label}
                  <button onClick={chip.onRemove} className="hover:text-navy-900 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Subcategory service chips — shown when a category is selected */}
      {subcategories.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 flex-nowrap">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">সার্ভিস:</span>
            {subcategories.map((sub) => (
              sub.services.slice(0, 4).map((svc) => (
                <button key={svc}
                  onClick={() => { setSearchQ(svc); setLocalQ(svc); }}
                  className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap
                    ${searchQ === svc
                      ? 'bg-trust-500 text-white border-trust-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-trust-300 hover:text-trust-500'}`}>
                  {svc}
                </button>
              ))
            ))}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex gap-6">

        {/* Desktop Sidebar */}
        <aside className="hidden sm:block w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <span className="font-bold text-gray-900">Filters</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-5 flex-1">
                <Sidebar />
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full bg-trust-500 text-white font-semibold py-3 rounded-xl"
                >
                  Show {workers.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workers */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border border-gray-100" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                <X className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-gray-600 font-medium">{error}</p>
              <button onClick={fetchWorkers} className="bg-trust-500 text-white text-sm font-semibold px-5 py-2 rounded-full">Retry</button>
            </div>
          )}

          {!loading && !error && workers.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <div className="text-5xl mb-2">🔍</div>
              <p className="text-gray-700 font-semibold">No workers found</p>
              <p className="text-gray-400 text-sm">Try changing your filters or search term</p>
              <button onClick={clearFilters} className="mt-2 border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2 rounded-full hover:border-trust-500 hover:text-trust-500 transition-colors">
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && workers.length > 0 && (
            <>
              {/* Mobile sort */}
              <div className="sm:hidden mb-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">Sort:</span>
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 bg-white text-gray-700 appearance-none focus:outline-none font-medium">
                    {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workers.map((w) => <WorkerCard key={w._id} worker={w} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
