import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench, User, Eye, EyeOff, CheckCircle2, ChevronRight, ChevronLeft,
  Camera, Clock, Banknote, BookOpen, Upload, Languages as LangIcon,
  Phone, Mail, Lock, FileText, CreditCard, X, Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { CATEGORIES, DHAKA_AREAS } from '../constants.js';
import { CategoryIcon } from '../components/CategoryIcon.jsx';
import { FloatInput, FloatTextarea, Alert, Spinner, FieldError } from '../components/ui.jsx';

/* ── File upload card (single) ── */
function DocUpload({ label, sublabel, file, preview, onSelect, required, accept = 'image/*' }) {
  const ref = useRef(null);
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400"> *</span>}
      </p>
      <button type="button" onClick={() => ref.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl transition-all group
          ${file ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-brand-300 bg-gray-50'}`}>
        {preview ? (
          <div className="relative">
            <img src={preview} alt={label} className="w-full h-36 object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity">
              <span className="text-white text-xs font-bold">Change</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 px-3">
            <div className="w-10 h-10 bg-gray-200 group-hover:bg-brand-100 rounded-xl flex items-center justify-center transition-colors">
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-600 group-hover:text-brand-600 transition-colors">
                {file ? file.name : 'Click to upload'}
              </p>
              {sublabel && <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>}
            </div>
          </div>
        )}
      </button>
      <input ref={ref} type="file" accept={accept} onChange={onSelect} className="hidden" />
    </div>
  );
}

/* ── Multi-file upload (certificates) ── */
function MultiDocUpload({ files, onAdd, onRemove }) {
  const ref = useRef(null);
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        Trade / Skills Certificates <span className="font-normal text-gray-400">(optional, up to 5)</span>
      </p>

      {/* File chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg max-w-[180px]">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{f.name}</span>
              <button type="button" onClick={() => onRemove(i)} className="shrink-0 hover:text-red-500 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < 5 && (
        <button type="button" onClick={() => ref.current?.click()}
          className="flex items-center gap-2 text-sm text-brand-600 font-semibold hover:text-brand-800 transition-colors border-2 border-dashed border-brand-200 hover:border-brand-400 rounded-xl px-4 py-2.5 w-full justify-center">
          <Upload className="w-4 h-4" /> Add certificate
        </button>
      )}
      <input ref={ref} type="file" accept="image/*,.pdf" multiple
        onChange={(e) => { Array.from(e.target.files).forEach(onAdd); e.target.value = ''; }}
        className="hidden" />
    </div>
  );
}

/* ────── Worker 4-step wizard ────── */
function WorkerRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const fileRef   = useRef(null);

  const [step, setStep]         = useState(1);
  const [showPass, setShow]     = useState(false);
  const [submitting, setSub]    = useState(false);
  const [errors, setErrors]     = useState({});
  const [selectedAreas, setAreas] = useState([]);

  // Step 1
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  // Step 2
  const [prof, setProf] = useState({
    category: '', experience: '', hourlyRate: '', bio: '', languages: 'Bengali',
  });

  // Step 3: docs
  const [nidFront, setNidFront]   = useState({ file: null, preview: null });
  const [nidBack, setNidBack]     = useState({ file: null, preview: null });
  const [nidNumber, setNidNumber] = useState('');
  const [certs, setCerts]         = useState([]);

  // Step 4: photo
  const [photoFile, setPhotoFile]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const setF  = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };
  const setP  = (k) => (e) => { setProf((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };
  const toggleArea = (a) => { setAreas((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]); setErrors((e) => ({ ...e, areas: '' })); };

  function readPreview(file, setFn) {
    if (!file) return;
    const r = new FileReader();
    r.onload = (e) => setFn({ file, preview: e.target.result });
    r.readAsDataURL(file);
  }

  const v1 = () => {
    const e = {};
    if (!form.name.trim())        e.name     = 'Required';
    if (!form.email.trim())       e.email    = 'Required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (!form.phone.trim())       e.phone    = 'Required';
    return e;
  };
  const v2 = () => {
    const e = {};
    if (!prof.category)            e.category   = 'Select a category';
    if (selectedAreas.length === 0) e.areas     = 'Select at least one area';
    if (!prof.experience)          e.experience = 'Required';
    return e;
  };
  const v3 = () => {
    const e = {};
    if (!nidFront.file) e.nidFront = 'NID front photo is required';
    if (!nidBack.file)  e.nidBack  = 'NID back photo is required';
    if (!nidNumber.trim()) e.nidNumber = 'NID number is required';
    return e;
  };

  async function handleSubmit() {
    setSub(true); setErrors({});
    try {
      // 1. Create account + worker profile
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, role: 'worker',
          ...prof,
          areas: selectedAreas,
          languages: prof.languages.split(',').map((l) => l.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ submit: data.message || 'Registration failed' }); return; }

      const authToken = data.token;

      // 2. Upload profile photo
      if (photoFile) {
        const fd = new FormData(); fd.append('photo', photoFile);
        await fetch('/api/profile/worker/photo', {
          method: 'POST', headers: { Authorization: `Bearer ${authToken}` }, body: fd,
        });
      }

      // 3. Upload documents
      const docs = new FormData();
      if (nidFront.file)  docs.append('nidFront', nidFront.file);
      if (nidBack.file)   docs.append('nidBack', nidBack.file);
      certs.forEach((f)  => docs.append('certificates', f));
      docs.append('nidNumber', nidNumber);
      if (nidFront.file || nidBack.file || certs.length > 0) {
        await fetch('/api/profile/worker/documents', {
          method: 'POST', headers: { Authorization: `Bearer ${authToken}` }, body: docs,
        });
      }

      login(data);
      navigate('/dashboard');
    } catch { setErrors({ submit: 'Network error. Please try again.' }); }
    finally { setSub(false); }
  }

  const STEPS = ['Account', 'Details', 'Documents', 'Photo'];
  const pct   = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i+1 < step  ? 'bg-brand-600 text-white'
                : i+1 === step ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                : 'bg-gray-100 text-gray-400'}`}>
                {i+1 < step ? <CheckCircle2 className="w-4 h-4" /> : i+1}
              </div>
              <span className={`text-[10px] font-semibold hidden sm:block ${i+1 === step ? 'text-brand-600' : 'text-gray-400'}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ── Step 1: Account ── */}
      {step === 1 && (
        <div className="space-y-3">
          <FloatInput id="w_name"  label="Full Name"             value={form.name}     onChange={setF('name')}     icon={User}  required error={errors.name} />
          <FloatInput id="w_email" label="Email Address"         value={form.email}    onChange={setF('email')}    icon={Mail}  required error={errors.email} type="email" />
          <FloatInput id="w_phone" label="Phone (01xxx-xxxxxx)"  value={form.phone}    onChange={setF('phone')}    icon={Phone} required error={errors.phone} />
          <FloatInput id="w_pass"  label="Password (min 6 chars)" value={form.password} onChange={setF('password')} icon={Lock}  required error={errors.password}
            type={showPass ? 'text' : 'password'}
            right={<button type="button" onClick={() => setShow(!showPass)} className="p-1 text-gray-400 hover:text-gray-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
          />
          <button type="button" onClick={() => { const e = v1(); Object.keys(e).length ? setErrors(e) : setStep(2); }}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-1">
            <span>Continue</span><ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}

      {/* ── Step 2: Professional details ── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Category */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Trade *</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.key} type="button"
                  onClick={() => { setProf((f) => ({ ...f, category: c.key })); setErrors((e) => ({ ...e, category: '' })); }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all
                    ${prof.category === c.key ? 'shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                  style={prof.category === c.key ? { borderColor: c.color, background: c.bg, color: c.color } : {}}>
                  <CategoryIcon category={c.key} size={20} />
                  <span className="text-[10px] font-semibold leading-tight line-clamp-1">{c.label}</span>
                </button>
              ))}
            </div>
            {errors.category && <FieldError>{errors.category}</FieldError>}
          </div>

          {/* Areas */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Service Areas * <span className="font-normal text-gray-400">({selectedAreas.length} selected)</span>
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 border-2 border-gray-200 rounded-xl bg-gray-50 scrollbar-hide">
              {DHAKA_AREAS.map((a) => (
                <button key={a} type="button" onClick={() => toggleArea(a)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all
                    ${selectedAreas.includes(a) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}>
                  {selectedAreas.includes(a) ? '✓ ' : ''}{a}
                </button>
              ))}
            </div>
            {errors.areas && <FieldError>{errors.areas}</FieldError>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FloatInput id="w_exp"  label="Experience (yrs)" value={prof.experience} onChange={setP('experience')} icon={Clock}    type="number" min="0" error={errors.experience} required />
            <FloatInput id="w_rate" label="Rate (৳/hr)"      value={prof.hourlyRate} onChange={setP('hourlyRate')} icon={Banknote} type="number" min="0" />
          </div>
          <FloatTextarea id="w_bio"  label="About yourself" value={prof.bio}       onChange={setP('bio')}       rows={3} maxLen={300} />
          <FloatInput   id="w_lang" label="Languages (comma-separated)" value={prof.languages} onChange={setP('languages')} icon={LangIcon} />

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <ChevronLeft className="w-4 h-4 shrink-0" /><span>Back</span>
            </button>
            <button type="button" onClick={() => { const e = v2(); Object.keys(e).length ? setErrors(e) : setStep(3); }}
              className="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              <span>Continue</span><ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Documents (NID + certificates) ── */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <CreditCard className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>পরিচয় যাচাই:</strong> আপনার NID কার্ডের উভয় পাশের ছবি আপলোড করুন। এটি শুধুমাত্র
              প্রশাসক দেখতে পাবেন এবং নিরাপদভাবে সংরক্ষিত থাকবে।
            </p>
          </div>

          <FloatInput id="w_nid" label="NID Card Number" value={nidNumber}
            onChange={(e) => { setNidNumber(e.target.value); setErrors((er) => ({ ...er, nidNumber: '' })); }}
            icon={CreditCard} required error={errors.nidNumber} />

          <div className="grid grid-cols-2 gap-3">
            <DocUpload
              label="NID Front Side" sublabel="JPG / PNG, max 10MB" required
              file={nidFront.file} preview={nidFront.preview}
              onSelect={(e) => readPreview(e.target.files[0], setNidFront)}
            />
            <DocUpload
              label="NID Back Side" sublabel="JPG / PNG, max 10MB" required
              file={nidBack.file} preview={nidBack.preview}
              onSelect={(e) => readPreview(e.target.files[0], setNidBack)}
            />
          </div>
          {errors.nidFront && <FieldError>{errors.nidFront}</FieldError>}
          {errors.nidBack  && <FieldError>{errors.nidBack}</FieldError>}

          <MultiDocUpload
            files={certs}
            onAdd={(f) => setCerts((p) => p.length < 5 ? [...p, f] : p)}
            onRemove={(i) => setCerts((p) => p.filter((_, idx) => idx !== i))}
          />

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <ChevronLeft className="w-4 h-4 shrink-0" /><span>Back</span>
            </button>
            <button type="button" onClick={() => { const e = v3(); Object.keys(e).length ? setErrors(e) : setStep(4); }}
              className="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              <span>Continue</span><ChevronRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Profile photo + submit ── */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-semibold text-gray-700">
              Profile Photo <span className="text-gray-400 font-normal">(optional)</span>
            </p>
            <div className="relative">
              {photoPreview ? (
                <img src={photoPreview} alt="preview" className="w-32 h-32 rounded-2xl object-cover border-4 border-brand-100 shadow-md" />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Camera className="w-8 h-8" />
                  <span className="text-xs font-medium">No photo</span>
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-brand-600 hover:bg-brand-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                <Upload className="w-4 h-4 text-white" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*"
              onChange={(e) => { const f = e.target.files[0]; if (!f) return; setPhotoFile(f); const r = new FileReader(); r.onload = (ev) => setPhotoPreview(ev.target.result); r.readAsDataURL(f); }}
              className="hidden" />
            {photoPreview
              ? <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-brand-600 font-semibold hover:underline">Change photo</button>
              : <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-brand-600 font-semibold hover:underline">Choose a photo</button>
            }
          </div>

          <Alert type="warning">
            <strong>Pending Approval</strong> — your account will be reviewed and your NID verified by our team before going live. Usually within 24 hours.
          </Alert>

          {errors.submit && <Alert type="error">{errors.submit}</Alert>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(3)}
              className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <ChevronLeft className="w-4 h-4 shrink-0" /><span>Back</span>
            </button>
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex-1 bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              {submitting ? <Spinner label="Creating…" /> : <><CheckCircle2 className="w-4 h-4 shrink-0" /><span>Create Account</span></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────── Client registration ────── */
function ClientRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShow] = useState(false);
  const [submitting, setSub] = useState(false);
  const [errors, setErrors]  = useState({});
  const [form, setForm]      = useState({ name: '', email: '', password: '', phone: '', area: '' });
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: '' })); };

  function validate() {
    const e = {};
    if (!form.name.trim())        e.name     = 'Required';
    if (!form.email.trim())       e.email    = 'Required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (!form.phone.trim())       e.phone    = 'Required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const ev = validate(); if (Object.keys(ev).length) { setErrors(ev); return; }
    setSub(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'client' }),
      });
      const data = await res.json();
      if (!res.ok) { setErrors({ submit: data.message || 'Registration failed' }); return; }
      login(data); navigate('/');
    } catch { setErrors({ submit: 'Network error.' }); }
    finally { setSub(false); }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <FloatInput id="c_name"  label="Full Name"       value={form.name}     onChange={set('name')}     icon={User}  required error={errors.name} />
      <FloatInput id="c_email" label="Email Address"   value={form.email}    onChange={set('email')}    icon={Mail}  required error={errors.email} type="email" />
      <FloatInput id="c_phone" label="Phone Number"    value={form.phone}    onChange={set('phone')}    icon={Phone} required error={errors.phone} />
      <FloatInput id="c_pass"  label="Password (min 6)" value={form.password} onChange={set('password')} icon={Lock}  required error={errors.password}
        type={showPass ? 'text' : 'password'}
        right={<button type="button" onClick={() => setShow(!showPass)} className="p-1 text-gray-400 hover:text-gray-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
      />
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Your Area in Dhaka</p>
        <select value={form.area} onChange={set('area')}
          className="w-full px-3 py-3 text-sm border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:border-brand-500 transition-colors appearance-none">
          <option value="">Any area (optional)</option>
          {DHAKA_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      {errors.submit && <Alert type="error">{errors.submit}</Alert>}
      <button type="submit" disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-1">
        {submitting ? <Spinner label="Creating…" /> : <><span>Create Account</span><ChevronRight className="w-4 h-4 shrink-0" /></>}
      </button>
    </form>
  );
}

/* ────── Main page ────── */
export default function Register() {
  const [role, setRole] = useState(null);

  if (!role) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Create an Account</h1>
          <p className="text-gray-400 text-sm mt-1">Who are you joining as?</p>
        </div>
        <div className="space-y-3">
          {[
            { role: 'worker', Icon: Wrench, title: 'Worker / Professional', desc: 'List your services and get hired', colorCls: 'brand' },
            { role: 'client', Icon: User,   title: 'Client / Customer',    desc: 'Find and hire local professionals', colorCls: 'blue' },
          ].map((opt) => (
            <button key={opt.role} onClick={() => setRole(opt.role)}
              className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 p-5 rounded-2xl transition-all group text-left hover:shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-${opt.colorCls}-100`}>
                <opt.Icon className={`w-6 h-6 text-${opt.colorCls}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900">{opt.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <button type="button" onClick={() => setRole(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${role === 'worker' ? 'bg-brand-100' : 'bg-blue-100'}`}>
              {role === 'worker' ? <Wrench className="w-5 h-5 text-brand-600" /> : <User className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">{role === 'worker' ? 'Worker Registration' : 'Client Registration'}</h2>
              <p className="text-xs text-gray-400">{role === 'worker' ? '4 steps — takes about 3 minutes' : 'Takes less than a minute'}</p>
            </div>
          </div>
          {role === 'worker' ? <WorkerRegister /> : <ClientRegister />}
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
