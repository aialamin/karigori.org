/**
 * ServiceAreaPicker.jsx  — Division → District → Upazila
 * Clean, accessible multi-select for worker service areas.
 *
 * Props:
 *   selected  {string[]}  currently selected upazila / district names
 *   onChange  {fn}        called with new string[]
 */
import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronUp, MapPin, CheckSquare, Square, Minus } from 'lucide-react';
import { BD } from '../data/bangladesh.js';

/* ── helpers ─────────────────────────────────────────────────────── */
const BN_DIV = { Dhaka:'ঢাকা', Chittagong:'চট্টগ্রাম', Rajshahi:'রাজশাহী',
  Khulna:'খুলনা', Barishal:'বরিশাল', Sylhet:'সিলেট',
  Rangpur:'রংপুর', Mymensingh:'ময়মনসিংহ' };

function divUpazilas(div) { return div.districts.flatMap((d) => d.upazilas); }
function distUpazilas(dist) { return dist.upazilas; }

/* ── tri-state for checkbox ── */
function selState(items, selected) {
  const cnt = items.filter((u) => selected.includes(u)).length;
  if (cnt === 0) return 'none';
  if (cnt === items.length) return 'all';
  return 'some';
}

/* ── Checkbox icon ── */
function Checkbox({ state, accent }) {
  if (state === 'all')  return <CheckSquare className="w-4 h-4 shrink-0" style={{ color: accent }} />;
  if (state === 'some') return <Minus       className="w-4 h-4 shrink-0" style={{ color: accent }} />;
  return <Square className="w-4 h-4 shrink-0 text-gray-300" />;
}

/* ── Quick-select popular cities ── */
const QUICK = [
  { label: 'ঢাকা সিটি',   upazilas: ['Dhanmondi','Gulshan','Banani','Mirpur','Mohammadpur','Uttara','Bashundhara','Badda','Rampura','Khilgaon','Motijheel','Tejgaon'] },
  { label: 'গাজীপুর',      upazilas: ['Gazipur Sadar','Joydebpur','Tongi','Kaliakoir','Kapasia','Sreepur'] },
  { label: 'নারায়ণগঞ্জ',  upazilas: ['Narayanganj Sadar','Fatullah','Siddhirganj','Rupganj','Sonargaon'] },
  { label: 'চট্টগ্রাম',   upazilas: ['Agrabad','Halishahar','Nasirabad','Pahartali','Panchlaish','Bayazid','Chandgaon'] },
  { label: 'সিলেট',        upazilas: ['Sylhet Sadar','Zindabazar','Amberkhana'] },
  { label: 'রাজশাহী',     upazilas: ['Rajshahi Sadar','Boalia','Motihar'] },
];

const ACCENT = '#006A4E';

/* ════════════════════════════════════════════════════════════════════ */
export default function ServiceAreaPicker({ selected = [], onChange }) {
  const [search,    setSearch]    = useState('');
  const [openDivs,  setOpenDivs]  = useState({ Dhaka: true }); // Dhaka open by default
  const [openDists, setOpenDists] = useState({});
  const searchRef = useRef(null);

  /* toggle helpers */
  const add    = (items) => onChange([...new Set([...selected, ...items])]);
  const remove = (items) => onChange(selected.filter((v) => !items.includes(v)));
  const toggle = (u)     => selected.includes(u) ? remove([u]) : add([u]);

  const toggleDist = (dist) => {
    const s = selState(distUpazilas(dist), selected);
    s === 'all' ? remove(distUpazilas(dist)) : add(distUpazilas(dist));
  };
  const toggleDiv = (div) => {
    const s = selState(divUpazilas(div), selected);
    s === 'all' ? remove(divUpazilas(div)) : add(divUpazilas(div));
  };

  /* search filter */
  const q = search.toLowerCase().trim();
  const filtered = useMemo(() => {
    if (!q) return BD;
    return BD.map((div) => ({
      ...div,
      districts: div.districts
        .map((dist) => ({
          ...dist,
          upazilas: dist.upazilas.filter((u) => u.toLowerCase().includes(q)),
          distMatch: dist.district.toLowerCase().includes(q) || dist.districtBn.includes(search),
        }))
        .filter((d) => d.distMatch || d.upazilas.length > 0),
    })).filter((d) => d.districts.length > 0);
  }, [q, search]);

  /* auto-expand on search */
  useEffect(() => {
    if (!q) return;
    const divs = {}, dists = {};
    filtered.forEach((div) => {
      divs[div.division] = true;
      div.districts.forEach((d) => { dists[`${div.division}-${d.district}`] = true; });
    });
    setOpenDivs(divs);
    setOpenDists(dists);
  }, [q]);

  const totalSelected = selected.length;

  return (
    <div className="space-y-3">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          সেবা এলাকা নির্বাচন
        </span>
        {totalSelected > 0 && (
          <button type="button" onClick={() => onChange([])}
            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors flex items-center gap-1">
            <X className="w-3 h-3" /> সব বাদ দিন
          </button>
        )}
      </div>

      {/* ── Quick-select pills ── */}
      <div>
        <p className="text-[11px] text-gray-400 mb-1.5 font-medium">জনপ্রিয় এলাকা</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK.map(({ label, upazilas }) => {
            const s = selState(upazilas, selected);
            const on = s === 'all';
            return (
              <button key={label} type="button"
                onClick={() => on ? remove(upazilas) : add(upazilas)}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border
                  transition-all active:scale-95
                  ${on
                    ? 'bg-brand-600 text-white border-brand-600'
                    : s === 'some'
                      ? 'bg-brand-50 text-brand-700 border-brand-300'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'}`}>
                <MapPin className="w-3 h-3" />
                {label}
                {s === 'some' && <span className="text-[10px] opacity-70">({upazilas.filter(u => selected.includes(u)).length})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input ref={searchRef} type="text" value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="জেলা বা উপজেলা খুঁজুন…  (e.g. গাজীপুর, Tongi)"
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl outline-none
            focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all
            placeholder-gray-400 bg-white" />
        {search && (
          <button type="button" onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Selected chips ── */}
      {totalSelected > 0 && (
        <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl">
          <p className="text-[11px] font-bold text-brand-700 mb-2">
            ✔ {totalSelected}টি এলাকা নির্বাচিত
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {selected.map((v) => (
              <span key={v}
                className="inline-flex items-center gap-1 text-xs bg-white text-brand-700
                  border border-brand-200 font-medium px-2.5 py-1 rounded-full">
                {v}
                <button type="button" onClick={() => toggle(v)}
                  className="text-brand-400 hover:text-red-500 transition-colors ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Division tree ── */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        {filtered.map((div, di) => {
          const divOpen = !!openDivs[div.division];
          const divItems = divUpazilas(div);
          const divSel = selState(divItems, selected);
          const divCnt = divItems.filter((u) => selected.includes(u)).length;

          return (
            <div key={div.division}
              className={di > 0 ? 'border-t border-gray-100' : ''}>

              {/* Division header */}
              <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none
                transition-colors ${divOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>

                {/* Checkbox */}
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); toggleDiv(div); }}
                  className="shrink-0 transition-transform hover:scale-110">
                  <Checkbox state={divSel} accent={ACCENT} />
                </button>

                {/* Name */}
                <div className="flex-1 flex items-center gap-2 min-w-0"
                  onClick={() => setOpenDivs((p) => ({ ...p, [div.division]: !p[div.division] }))}>
                  <span className="text-sm font-bold text-gray-900">
                    {div.divisionBn}
                  </span>
                  <span className="text-xs text-gray-400 font-normal hidden sm:inline">
                    {div.division} Division
                  </span>
                  {divCnt > 0 && (
                    <span className="ml-auto mr-2 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#dcfce7', color: ACCENT }}>
                      {divCnt}টি
                    </span>
                  )}
                </div>

                {/* Toggle arrow */}
                <button type="button"
                  onClick={() => setOpenDivs((p) => ({ ...p, [div.division]: !p[div.division] }))}
                  className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                  {divOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Districts */}
              {divOpen && (
                <div className="border-t border-gray-100">
                  {div.districts.map((dist, disti) => {
                    const distKey  = `${div.division}-${dist.district}`;
                    const distOpen = !!openDists[distKey];
                    const distSel  = selState(distUpazilas(dist), selected);
                    const distCnt  = distUpazilas(dist).filter((u) => selected.includes(u)).length;

                    return (
                      <div key={dist.district}
                        className={disti > 0 ? 'border-t border-gray-50' : ''}>

                        {/* District row */}
                        <div className={`flex items-center gap-3 pl-8 pr-4 py-2.5 cursor-pointer select-none
                          transition-colors ${distOpen ? 'bg-gray-50/80' : 'hover:bg-gray-50/60'}`}>

                          <button type="button"
                            onClick={(e) => { e.stopPropagation(); toggleDist(dist); }}
                            className="shrink-0 transition-transform hover:scale-110">
                            <Checkbox state={distSel} accent="#3b82f6" />
                          </button>

                          <div className="flex-1 flex items-center gap-2 min-w-0"
                            onClick={() => setOpenDists((p) => ({ ...p, [distKey]: !p[distKey] }))}>
                            <span className="text-sm font-semibold text-gray-700">
                              {dist.districtBn}
                            </span>
                            <span className="text-xs text-gray-400 hidden sm:inline">
                              {dist.district}
                            </span>
                            {distCnt > 0 && (
                              <span className="ml-auto mr-2 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                {distCnt}/{dist.upazilas.length}
                              </span>
                            )}
                          </div>

                          <button type="button"
                            onClick={() => setOpenDists((p) => ({ ...p, [distKey]: !p[distKey] }))}
                            className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors">
                            {distOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Upazilas grid */}
                        {distOpen && (
                          <div className="pl-12 pr-4 pb-3 pt-1 grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-gray-50/40">
                            {dist.upazilas.map((u) => {
                              const on = selected.includes(u);
                              return (
                                <button key={u} type="button" onClick={() => toggle(u)}
                                  className={`px-2.5 py-2 rounded-lg border text-left
                                    transition-all text-xs font-medium active:scale-95 leading-tight truncate
                                    ${on
                                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50'}`}>
                                  {u}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
            কোনো এলাকা পাওয়া যায়নি
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        বিভাগ বা জেলার নামে ক্লিক করে সব উপজেলা একসাথে নির্বাচন করুন
      </p>
    </div>
  );
}
