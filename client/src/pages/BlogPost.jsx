import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Clock, Calendar, Eye, ArrowLeft, ArrowRight, Share2,
  Link2, CheckCircle2, ChevronRight,
  BookOpen, Tag, User, MessageCircle, ExternalLink, Loader2,
} from 'lucide-react';
import { BLOGS as STATIC_BLOGS, BLOG_CATEGORIES, BLOG_AUTHORS } from '../data/blogData.js';

const G = '#006A4E';
const GD = '#004d38';
const BASE_URL = 'https://karigori.com';

function getCat(key) { return BLOG_CATEGORIES.find((c) => c.key === key) || BLOG_CATEGORIES[0]; }

/* Gradient icon block for blog header */
function BlogHero({ blog }) {
  const cat = getCat(blog.category);
  return (
    <div style={{ background: blog.gradient, borderRadius: 24, overflow: 'hidden', position: 'relative' }}
      className="w-full aspect-[2/1] sm:aspect-[3/1] flex items-center justify-center">
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)' }} />
      <div className="text-center relative z-10 px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl"
          style={{ background: 'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)' }}>
          <BookOpen style={{ width:32, height:32, color:'#fff' }} />
        </div>
        <span className="text-sm font-bold px-3 py-1.5 rounded-full"
          style={{ background:'rgba(255,255,255,0.2)', color:'#fff', backdropFilter:'blur(4px)' }}>
          {cat.label}
        </span>
      </div>
    </div>
  );
}

/* Render individual content blocks */
function ContentBlock({ block }) {
  switch (block.type) {
    case 'intro':
      return <p className="text-base sm:text-lg leading-relaxed font-medium text-gray-700 mb-5 p-5 rounded-2xl" style={{ background:'#f0fdf4', borderLeft:`4px solid ${G}` }}>{block.text}</p>;
    case 'h2':
      return <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-8 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-6 rounded-full shrink-0" style={{ background: G }} />
        {block.text}
      </h2>;
    case 'h3':
      return <h3 className="text-lg font-bold text-gray-800 mt-5 mb-2">{block.text}</h3>;
    case 'p':
      return <p className="text-gray-600 leading-relaxed mb-4">{block.text}</p>;
    case 'list':
      return (
        <ul className="space-y-2.5 mb-5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold"
                style={{ background: G }}>{i + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="overflow-x-auto mb-5 rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: G }}>
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-white font-bold text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-gray-700 font-medium border-b border-gray-50">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'tip':
      return (
        <div className="my-5 p-4 rounded-2xl border-2 text-sm font-medium" style={{ background:'#fffbeb', borderColor:'#fde68a', color:'#78350f' }}>
          {block.text}
        </div>
      );
    default:
      return null;
  }
}

/* Small related blog card */
function RelatedCard({ blog }) {
  const cat = getCat(blog.category);
  return (
    <Link to={`/blog/${blog.slug}`}
      className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
      <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: blog.gradient }}>
        <BookOpen style={{ width:20, height:20, color:'rgba(255,255,255,0.9)' }} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
        <p className="text-xs font-bold text-gray-800 mt-1 line-clamp-2 group-hover:text-green-700 transition-colors">{blog.title}</p>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock style={{ width:10, height:10 }} /> {blog.readTime}
        </p>
      </div>
    </Link>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied,    setCopied]   = useState(false);
  const [blog,      setBlog]     = useState(null);
  const [allBlogs,  setAllBlogs] = useState(STATIC_BLOGS);
  const [loading,   setLoading]  = useState(true);
  const [notFound,  setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true); setNotFound(false);
    // Fetch full blog post from API first
    fetch(`/api/blogs/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) { setBlog(data); }
        else if (!notFound) {
          // Fallback to static
          const s = STATIC_BLOGS.find((b) => b.slug === slug);
          if (s) setBlog(s); else setNotFound(true);
        }
      })
      .catch(() => {
        const s = STATIC_BLOGS.find((b) => b.slug === slug);
        if (s) setBlog(s); else setNotFound(true);
      })
      .finally(() => setLoading(false));

    // Also fetch all blogs for sidebar / prev-next
    fetch('/api/blogs?limit=50')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.blogs?.length) setAllBlogs(d.blogs); })
      .catch(() => {});
  }, [slug]);

  /* Related blogs (same category, different slug) */
  const related = blog
    ? allBlogs.filter((b) => b.category === blog.category && b.slug !== slug).slice(0, 3)
    : [];
  const moreBlogs = blog
    ? allBlogs.filter((b) => b.slug !== slug && !related.find((r) => r.slug === b.slug)).slice(0, 6)
    : [];

  const currentIndex = blog ? allBlogs.findIndex((b) => b.slug === slug) : -1;
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  function copyLink() {
    navigator.clipboard.writeText(`${BASE_URL}/blog/${slug}`).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  }

  /* Loading */
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
    </div>
  );

  /* 404 page */
  if (!blog || notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Helmet><title>আর্টিকেল পাওয়া যায়নি | কারিগরি ব্লগ</title></Helmet>
        <div className="text-center">
          <div className="text-7xl font-black text-gray-100 mb-4">404</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">আর্টিকেল পাওয়া যায়নি</h1>
          <p className="text-gray-500 mb-6">এই লিংকের কোনো আর্টিকেল নেই অথবা সরানো হয়েছে।</p>
          <Link to="/blog" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-2xl text-white"
            style={{ background: G }}>
            <ArrowLeft style={{ width:16, height:16 }} /> সব আর্টিকেল দেখুন
          </Link>
        </div>
      </div>
    );
  }

  const cat = getCat(blog.category);
  const pageUrl = `${BASE_URL}/blog/${blog.slug}`;

  /* JSON-LD article schema */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.metaDesc,
    url: pageUrl,
    datePublished: '2025-05-01',
    dateModified: '2025-06-02',
    author: { '@type': 'Person', name: blog.author.name, jobTitle: blog.author.role },
    publisher: { '@type': 'Organization', name: 'কারিগরি', logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` } },
    keywords: blog.tags.join(', '),
    articleSection: cat.label,
    inLanguage: 'bn-BD',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'হোম', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'ব্লগ', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: pageUrl },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | কারিগরি ব্লগ</title>
        <meta name="description" content={blog.metaDesc} />
        <meta name="keywords" content={blog.tags.join(', ')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type"        content="article" />
        <meta property="og:title"       content={blog.title} />
        <meta property="og:description" content={blog.metaDesc} />
        <meta property="og:url"         content={pageUrl} />
        <meta property="og:site_name"   content="কারিগরি" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={blog.title} />
        <meta name="twitter:description" content={blog.metaDesc} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="bg-gray-50 min-h-screen pb-20">

        {/* ── Breadcrumb bar ── */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
              <Link to="/" className="hover:text-green-700 font-medium transition-colors">হোম</Link>
              <ChevronRight style={{ width:12, height:12 }} />
              <Link to="/blog" className="hover:text-green-700 font-medium transition-colors">ব্লগ</Link>
              <ChevronRight style={{ width:12, height:12 }} />
              <span className="font-bold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ══ MAIN ARTICLE ══ */}
            <article className="flex-1 min-w-0">
              {/* Back button */}
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-green-700 transition-colors mb-5">
                <ArrowLeft style={{ width:16, height:16 }} /> ফিরে যান
              </button>

              {/* Hero image */}
              <BlogHero blog={blog} />

              {/* Article header */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-5">

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>
                    {cat.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock style={{ width:11, height:11 }} /> {blog.readTime}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar style={{ width:11, height:11 }} /> {blog.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                    <Eye style={{ width:11, height:11 }} /> {blog.views} পাঠক
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-black text-gray-900 leading-tight mb-5"
                  style={{ fontSize: 'clamp(1.3rem, 3.5vw, 2rem)' }}>
                  {blog.title}
                </h1>

                {/* Author */}
                <div className="flex items-center gap-3 pb-5 border-b border-gray-100 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                    style={{ background: G }}>
                    {blog.author.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{blog.author.name}</p>
                    <p className="text-xs text-gray-400">{blog.author.role}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-blue-50"
                      title="Facebook-এ শেয়ার করুন"
                      style={{ background:'#f3f4f6' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(blog.title)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-sky-50"
                      title="Twitter/X-এ শেয়ার করুন"
                      style={{ background:'#f3f4f6' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#1d9bf0"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <button onClick={copyLink}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: copied ? '#dcfce7' : '#f3f4f6' }}>
                      {copied
                        ? <CheckCircle2 style={{ width:14, height:14, color: G }} />
                        : <Link2 style={{ width:14, height:14, color:'#6b7280' }} />}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  {blog.content.map((block, i) => (
                    <ContentBlock key={i} block={block} />
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-2">
                    <Tag style={{ width:12, height:12 }} /> ট্যাগ:
                  </span>
                  {blog.tags.map((tag) => (
                    <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author bio */}
                <div className="mt-6 p-4 rounded-2xl flex items-start gap-4" style={{ background:'#f9fafb' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black text-white shrink-0"
                    style={{ background: G }}>
                    {blog.author.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{blog.author.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{blog.author.role}</p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{blog.author.bio}</p>
                  </div>
                </div>
              </div>

              {/* Prev / Next navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {prevBlog ? (
                  <Link to={`/blog/${prevBlog.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <ArrowLeft style={{ width:18, height:18, color: G, flexShrink:0 }} />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">আগের আর্টিকেল</p>
                      <p className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-green-700 transition-colors">{prevBlog.title}</p>
                    </div>
                  </Link>
                ) : <div />}
                {nextBlog ? (
                  <Link to={`/blog/${nextBlog.slug}`}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group text-right justify-end">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">পরের আর্টিকেল</p>
                      <p className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-green-700 transition-colors">{nextBlog.title}</p>
                    </div>
                    <ArrowRight style={{ width:18, height:18, color: G, flexShrink:0 }} />
                  </Link>
                ) : <div />}
              </div>

              {/* More blogs grid */}
              {moreBlogs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full" style={{ background: G }} />
                    আরও পড়ুন
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {moreBlogs.map((b) => {
                      const bc = getCat(b.category);
                      return (
                        <Link key={b.id} to={`/blog/${b.slug}`}
                          className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: b.gradient }}>
                            <BookOpen style={{ width:20, height:20, color:'rgba(255,255,255,0.9)' }} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: bc.bg, color: bc.color }}>{bc.label}</span>
                            <p className="text-xs font-bold text-gray-800 mt-1 line-clamp-2 group-hover:text-green-700 transition-colors">{b.title}</p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Clock style={{ width:9, height:9 }} /> {b.readTime}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>

            {/* ══ SIDEBAR ══ */}
            <aside className="w-full lg:w-72 shrink-0 space-y-5">

              {/* Related posts */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
                    <BookOpen style={{ width:15, height:15, color: G }} />
                    <h3 className="font-black text-sm text-gray-900">একই বিষয়ের আর্টিকেল</h3>
                  </div>
                  <div className="divide-y divide-gray-50 p-2">
                    {related.map((b) => <RelatedCard key={b.id} blog={b} />)}
                  </div>
                </div>
              )}

              {/* Table of contents */}
              {blog.content.filter((b) => b.type === 'h2').length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
                    <MessageCircle style={{ width:15, height:15, color:'#8b5cf6' }} />
                    <h3 className="font-black text-sm text-gray-900">বিষয়সূচি</h3>
                  </div>
                  <div className="p-3 space-y-1">
                    {blog.content.filter((b) => b.type === 'h2').map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <span className="text-xs font-black mt-0.5" style={{ color: G }}>{i + 1}.</span>
                        <span className="text-xs font-medium text-gray-700 leading-snug">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA box */}
              <div className="rounded-2xl p-5 text-center" style={{ background:`linear-gradient(135deg, ${G} 0%, ${GD} 100%)` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background:'rgba(255,255,255,0.15)' }}>
                  <User style={{ width:22, height:22, color:'#fff' }} />
                </div>
                <h3 className="font-black text-white text-sm mb-1">কারিগর খুঁজছেন?</h3>
                <p className="text-xs mb-4" style={{ color:'rgba(255,255,255,0.75)' }}>
                  NID যাচাইকৃত, রিভিউ দেখা, সরাসরি যোগাযোগ
                </p>
                <Link to="/browse"
                  className="block w-full text-xs font-black py-3 rounded-xl transition-all hover:opacity-90"
                  style={{ background:'#fff', color: G }}>
                  কারিগর খুঁজুন →
                </Link>
              </div>

              {/* All articles */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-3 space-y-1">
                  {allBlogs.filter((b) => b.slug !== slug).slice(0, 5).map((b) => {
                    const bc = getCat(b.category);
                    return (
                      <Link key={b.id} to={`/blog/${b.slug}`}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: b.gradient }}>
                          <BookOpen style={{ width:14, height:14, color:'#fff' }} />
                        </div>
                        <p className="text-xs font-bold text-gray-700 line-clamp-2 group-hover:text-green-700 transition-colors">{b.title}</p>
                      </Link>
                    );
                  })}
                  <Link to="/blog" className="flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-xl mt-1 transition-colors hover:bg-green-50"
                    style={{ color: G }}>
                    সব আর্টিকেল দেখুন <ArrowRight style={{ width:12, height:12 }} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
