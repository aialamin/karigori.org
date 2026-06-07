/**
 * AdminBlogManager.jsx
 * Full CRUD blog management panel for admin dashboard.
 * Props: token (JWT string)
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Save, X, ArrowLeft,
  BookOpen, Globe, Search, Clock, ChevronDown, ChevronUp,
  CheckCircle2, AlertCircle, Loader2, Tag, Type, List,
  AlignLeft, Lightbulb, FileText, RefreshCw,
} from 'lucide-react';

const G = '#006A4E';

const BLOG_CATEGORIES = [
  { key: 'plumbing',    label: 'প্লাম্বিং' },
  { key: 'electrical',  label: 'ইলেকট্রিশিয়ান' },
  { key: 'ac',          label: 'AC সার্ভিস' },
  { key: 'cleaning',    label: 'ক্লিনিং' },
  { key: 'pest',        label: 'পেস্ট কন্ট্রোল' },
  { key: 'painting',    label: 'পেইন্টিং' },
  { key: 'cctv',        label: 'CCTV' },
  { key: 'water-tank',  label: 'ওয়াটার ট্যাংক' },
  { key: 'maintenance', label: 'হোম মেইনটেন্যান্স' },
  { key: 'interior',    label: 'ইন্টেরিয়র ডিজাইন' },
];

const GRADIENTS = [
  'linear-gradient(135deg, #006A4E 0%, #004d38 100%)',
  'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
  'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
  'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
  'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
  'linear-gradient(135deg, #374151 0%, #111827 100%)',
  'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
];

const BLOCK_TYPES = [
  { type: 'intro',  label: 'ভূমিকা',       icon: AlignLeft,   hint: 'হাইলাইটেড প্যারাগ্রাফ' },
  { type: 'h2',     label: 'শিরোনাম H2',   icon: Type,        hint: 'বড় সেকশন হেডিং' },
  { type: 'h3',     label: 'শিরোনাম H3',   icon: Type,        hint: 'ছোট সাব-হেডিং' },
  { type: 'p',      label: 'প্যারাগ্রাফ',  icon: AlignLeft,   hint: 'সাধারণ টেক্সট' },
  { type: 'list',   label: 'তালিকা',        icon: List,        hint: 'নম্বরযুক্ত তালিকা' },
  { type: 'tip',    label: 'টিপস বক্স',    icon: Lightbulb,   hint: 'হাইলাইটেড টিপ' },
  { type: 'faq',    label: 'FAQ',           icon: FileText,    hint: 'প্রশ্ন-উত্তর' },
];

/* ── Empty form template ── */
const EMPTY_FORM = {
  title: '', slug: '', excerpt: '',
  category: 'maintenance',
  author: { name: 'কারিগরি টিম', role: 'সার্ভিস বিশেষজ্ঞ', avatar: 'ক', bio: '' },
  gradient: GRADIENTS[0],
  featuredImage: '',
  metaTitle: '', metaDesc: '', focusKeyword: '',
  keywords: '', tags: '',
  readTime: '৫ মিনিট',
  featured: false,
  isPublished: false,
  content: [],
};

/* Auto-generate slug from title */
function toSlug(title) {
  return title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/* ── Single content block editor ── */
function BlockEditor({ block, idx, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const meta = BLOCK_TYPES.find((t) => t.type === block.type) || BLOCK_TYPES[0];
  const Icon = meta.icon;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-3">
      {/* Block header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: G }}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs font-bold text-gray-700">{meta.label}</span>
        <span className="text-[10px] text-gray-400">— {meta.hint}</span>
        <div className="ml-auto flex items-center gap-1">
          {!isFirst && (
            <button type="button" onClick={onMoveUp} className="p-1 text-gray-400 hover:text-gray-700 rounded">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
          {!isLast && (
            <button type="button" onClick={onMoveDown} className="p-1 text-gray-400 hover:text-gray-700 rounded">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
          <button type="button" onClick={onDelete} className="p-1 text-red-400 hover:text-red-600 rounded ml-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Block body */}
      <div className="p-3">
        {block.type === 'list' ? (
          <div className="space-y-2">
            {(block.items || []).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}.</span>
                <input
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
                  value={item}
                  onChange={(e) => {
                    const items = [...(block.items || [])];
                    items[i] = e.target.value;
                    onChange({ ...block, items });
                  }}
                  placeholder={`আইটেম ${i + 1}`}
                />
                <button type="button"
                  onClick={() => {
                    const items = (block.items || []).filter((_, j) => j !== i);
                    onChange({ ...block, items });
                  }}
                  className="text-red-400 hover:text-red-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button type="button"
              onClick={() => onChange({ ...block, items: [...(block.items || []), ''] })}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-dashed border-green-300 text-green-600 hover:bg-green-50 transition-colors">
              + আইটেম যোগ করুন
            </button>
          </div>
        ) : block.type === 'faq' ? (
          <div className="space-y-2">
            <input
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100"
              value={block.question || ''}
              onChange={(e) => onChange({ ...block, question: e.target.value })}
              placeholder="প্রশ্ন লিখুন..."
            />
            <textarea
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100 resize-none"
              value={block.answer || ''}
              onChange={(e) => onChange({ ...block, answer: e.target.value })}
              placeholder="উত্তর লিখুন..."
            />
          </div>
        ) : (
          <textarea
            rows={block.type === 'intro' || block.type === 'p' ? 3 : 2}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-100 resize-none"
            value={block.text || ''}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder={`${meta.label} লিখুন...`}
          />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* MAIN COMPONENT                             */
/* ═══════════════════════════════════════════ */
export default function AdminBlogManager({ token }) {
  const [blogs,   setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [view,    setView]    = useState('list');   // 'list' | 'edit'
  const [editing, setEditing] = useState(null);     // blog._id or 'new'
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [deleting, setDeleting] = useState(null);

  const authFetch = useCallback((url, opts = {}) => {
    return fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
    });
  }, [token]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await authFetch('/api/admin/blogs');
      const data = await r.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch { setBlogs([]); }
    finally { setLoading(false); }
  }, [authFetch]);

  useEffect(() => { loadBlogs(); }, [loadBlogs]);

  /* ── Open edit form ── */
  function openNew() {
    setForm({ ...EMPTY_FORM, content: [] });
    setEditing('new');
    setView('edit');
  }

  async function openEdit(id) {
    try {
      // Use admin route so drafts (unpublished) are also editable
      const r = await authFetch(`/api/admin/blogs/${id}`);
      const full = await r.json();
      if (!r.ok) { showToast(full.message || 'লোড করতে সমস্যা', 'error'); return; }
      setForm({
        title:        full.title || '',
        slug:         full.slug || '',
        excerpt:      full.excerpt || '',
        category:     full.category || 'maintenance',
        author:       full.author || EMPTY_FORM.author,
        gradient:     full.gradient || GRADIENTS[0],
        featuredImage:full.featuredImage || '',
        metaTitle:    full.metaTitle || '',
        metaDesc:     full.metaDesc || '',
        focusKeyword: full.focusKeyword || '',
        keywords:     (full.keywords || []).join(', '),
        tags:         (full.tags || []).join(', '),
        readTime:     full.readTime || '৫ মিনিট',
        featured:     !!full.featured,
        isPublished:  !!full.isPublished,
        content:      Array.isArray(full.content) ? full.content : [],
      });
      setEditing(id);
      setView('edit');
    } catch (e) {
      showToast('ব্লগ লোড করতে সমস্যা', 'error');
    }
  }

  /* ── Save (create or update) ── */
  async function handleSave(publish = null) {
    if (!form.title.trim()) { showToast('টাইটেল দিন', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(',').map((s) => s.trim()).filter(Boolean),
        tags:     form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        isPublished: publish !== null ? publish : form.isPublished,
      };

      const isNew = editing === 'new';
      const url   = isNew ? '/api/admin/blogs' : `/api/admin/blogs/${editing}`;
      const method = isNew ? 'POST' : 'PUT';

      const r = await authFetch(url, { method, body: JSON.stringify(payload) });
      const data = await r.json();

      if (!r.ok) throw new Error(data.message || 'Error');

      showToast(isNew ? 'ব্লগ তৈরি হয়েছে ✓' : 'আপডেট হয়েছে ✓');
      await loadBlogs();
      setView('list');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  /* ── Toggle publish ── */
  async function togglePublish(id, e) {
    e.stopPropagation();
    try {
      const r = await authFetch(`/api/admin/blogs/${id}/publish`, { method: 'PATCH' });
      const data = await r.json();
      setBlogs((prev) => prev.map((b) => b._id === id ? { ...b, isPublished: data.isPublished } : b));
      showToast(data.isPublished ? 'পাবলিশ হয়েছে ✓' : 'আনপাবলিশ হয়েছে');
    } catch { showToast('সমস্যা হয়েছে', 'error'); }
  }

  /* ── Delete ── */
  async function handleDelete(id) {
    setDeleting(id);
    try {
      await authFetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      showToast('ব্লগ মুছে গেছে');
    } catch { showToast('মুছতে সমস্যা', 'error'); }
    finally { setDeleting(null); }
  }

  /* ── Content block helpers ── */
  function addBlock(type) {
    const newBlock = type === 'list'
      ? { type, items: [''] }
      : type === 'faq'
        ? { type, question: '', answer: '' }
        : { type, text: '' };
    setForm((f) => ({ ...f, content: [...f.content, newBlock] }));
  }

  function updateBlock(idx, block) {
    setForm((f) => { const c = [...f.content]; c[idx] = block; return { ...f, content: c }; });
  }

  function deleteBlock(idx) {
    setForm((f) => ({ ...f, content: f.content.filter((_, i) => i !== idx) }));
  }

  function moveBlock(idx, dir) {
    setForm((f) => {
      const c = [...f.content];
      const swp = idx + dir;
      if (swp < 0 || swp >= c.length) return f;
      [c[idx], c[swp]] = [c[swp], c[idx]];
      return { ...f, content: c };
    });
  }

  const filtered = blogs.filter((b) =>
    !search.trim() ||
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  /* ════════════ LIST VIEW ════════════ */
  if (view === 'list') return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-bold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" style={{ color: G }} />
            ব্লগ ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{blogs.length}টি ব্লগ · {blogs.filter((b) => b.isPublished).length}টি পাবলিশড</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadBlogs} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm"
            style={{ background: G }}>
            <Plus className="w-4 h-4" /> নতুন ব্লগ
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white"
          placeholder="ব্লগ খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Blog list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-semibold text-sm">
            {search ? 'কোনো ব্লগ পাওয়া যায়নি' : 'এখনো কোনো ব্লগ নেই'}
          </p>
          {!search && (
            <button onClick={openNew}
              className="mt-4 text-sm font-bold px-4 py-2 rounded-xl text-white transition-all"
              style={{ background: G }}>
              প্রথম ব্লগ তৈরি করুন
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((blog) => (
            <div key={blog._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
              {/* Gradient preview */}
              <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: blog.gradient }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-gray-900 truncate">{blog.title}</p>
                  {blog.featured && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">ফিচার্ড</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{BLOG_CATEGORIES.find((c) => c.key === blog.category)?.label || blog.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
                  {blog.createdAt && (
                    <>
                      <span>·</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString('bn-BD')}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => togglePublish(blog._id, e)}
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    blog.isPublished
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  {blog.isPublished ? <><Globe className="w-3 h-3" /> লাইভ</> : <><EyeOff className="w-3 h-3" /> ড্রাফট</>}
                </button>
                <button onClick={() => openEdit(blog._id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('এই ব্লগ মুছে ফেলবেন?')) handleDelete(blog._id);
                  }}
                  disabled={deleting === blog._id}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                  {deleting === blog._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ════════════ EDIT / CREATE VIEW ════════════ */
  const F = form;
  const setF = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-4 pb-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-bold text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Edit header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setView('list')}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-black text-gray-900 text-lg">
            {editing === 'new' ? 'নতুন ব্লগ লিখুন' : 'ব্লগ সম্পাদনা'}
          </h2>
          <p className="text-xs text-gray-400">{F.content.length}টি কন্টেন্ট ব্লক</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> ড্রাফট সেভ
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 shadow-sm"
            style={{ background: G }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            পাবলিশ করুন
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">

        {/* ── LEFT: Main content ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Basic info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">মূল তথ্য</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">ব্লগ টাইটেল *</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 font-medium"
                placeholder="SEO-বান্ধব টাইটেল লিখুন..."
                value={F.title}
                onChange={(e) => {
                  setF('title', e.target.value);
                  if (!F.slug || F.slug === toSlug(F.title)) setF('slug', toSlug(e.target.value));
                  if (!F.metaTitle) setF('metaTitle', e.target.value);
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Slug (URL)</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 font-mono text-gray-600"
                placeholder="blog-slug-here"
                value={F.slug}
                onChange={(e) => setF('slug', e.target.value)}
              />
              <p className="text-[11px] text-gray-400 mt-1">karigori.org/blog/<strong>{F.slug || 'slug'}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">সারসংক্ষেপ (Excerpt)</label>
              <textarea rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
                placeholder="ব্লগের সংক্ষিপ্ত বিবরণ..."
                value={F.excerpt}
                onChange={(e) => { setF('excerpt', e.target.value); if (!F.metaDesc) setF('metaDesc', e.target.value); }}
              />
            </div>
          </div>

          {/* Content Builder */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">কন্টেন্ট বিল্ডার</h3>
              <span className="text-xs text-gray-400">{F.content.length}টি ব্লক</span>
            </div>

            {/* Add block buttons */}
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide w-full mb-1">ব্লক যোগ করুন:</span>
              {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                <button key={type} type="button" onClick={() => addBlock(type)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600 transition-all">
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>

            {/* Blocks */}
            {F.content.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                উপরের বাটন থেকে কন্টেন্ট ব্লক যোগ করুন
              </div>
            ) : (
              F.content.map((block, idx) => (
                <BlockEditor
                  key={idx}
                  block={block}
                  idx={idx}
                  onChange={(b) => updateBlock(idx, b)}
                  onDelete={() => deleteBlock(idx)}
                  onMoveUp={() => moveBlock(idx, -1)}
                  onMoveDown={() => moveBlock(idx, 1)}
                  isFirst={idx === 0}
                  isLast={idx === F.content.length - 1}
                />
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT: Settings sidebar ── */}
        <div className="space-y-4">

          {/* Publish settings */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">পাবলিশ সেটিংস</h3>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${F.isPublished ? 'bg-green-500' : 'bg-gray-200'}`}
                onClick={() => setF('isPublished', !F.isPublished)}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${F.isPublished ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{F.isPublished ? 'পাবলিশড' : 'ড্রাফট'}</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${F.featured ? 'bg-amber-500' : 'bg-gray-200'}`}
                onClick={() => setF('featured', !F.featured)}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${F.featured ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">ফিচার্ড পোস্ট</span>
            </label>
          </div>

          {/* Category & meta */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">ক্যাটাগরি ও তথ্য</h3>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">ক্যাটাগরি</label>
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400 bg-white"
                value={F.category} onChange={(e) => setF('category', e.target.value)}>
                {BLOG_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">পড়ার সময়</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="৫ মিনিট" value={F.readTime} onChange={(e) => setF('readTime', e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">ট্যাগ (কমা দিয়ে)</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="প্লাম্বার, ঢাকা, পাইপ"
                value={F.tags} onChange={(e) => setF('tags', e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">গ্রেডিয়েন্ট রঙ</label>
              <div className="grid grid-cols-4 gap-1.5">
                {GRADIENTS.map((g, i) => (
                  <button key={i} type="button" onClick={() => setF('gradient', g)}
                    className={`h-8 rounded-lg border-2 transition-all ${F.gradient === g ? 'border-gray-900 scale-105' : 'border-transparent'}`}
                    style={{ background: g }} />
                ))}
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">লেখক তথ্য</h3>
            {[
              { key: 'name',   label: 'নাম',       placeholder: 'কারিগরি টিম' },
              { key: 'role',   label: 'পদ',        placeholder: 'সার্ভিস বিশেষজ্ঞ' },
              { key: 'avatar', label: 'অ্যাভাটার', placeholder: 'ক' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-bold text-gray-500 block mb-1">{label}</label>
                <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                  placeholder={placeholder}
                  value={F.author[key] || ''}
                  onChange={(e) => setF('author', { ...F.author, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">বায়ো</label>
              <textarea rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400 resize-none"
                placeholder="লেখকের সংক্ষিপ্ত পরিচয়..."
                value={F.author.bio || ''}
                onChange={(e) => setF('author', { ...F.author, bio: e.target.value })} />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" /> SEO সেটিংস
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Meta Title</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="SEO টাইটেল..."
                value={F.metaTitle} onChange={(e) => setF('metaTitle', e.target.value)} />
              <p className="text-[10px] text-gray-400 mt-0.5">{F.metaTitle.length}/60 অক্ষর</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Meta Description</label>
              <textarea rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400 resize-none"
                placeholder="155 অক্ষরের মধ্যে বিবরণ..."
                value={F.metaDesc} onChange={(e) => setF('metaDesc', e.target.value)} />
              <p className={`text-[10px] mt-0.5 ${F.metaDesc.length > 155 ? 'text-red-500' : 'text-gray-400'}`}>{F.metaDesc.length}/155 অক্ষর</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Focus Keyword</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="মূল কীওয়ার্ড..."
                value={F.focusKeyword} onChange={(e) => setF('focusKeyword', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Keywords (কমা দিয়ে)</label>
              <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                placeholder="kw1, kw2, kw3"
                value={F.keywords} onChange={(e) => setF('keywords', e.target.value)} />
            </div>
          </div>

          {/* Save buttons */}
          <div className="flex gap-2">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" /> ড্রাফট
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: G }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
              পাবলিশ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
