import express from 'express';
import Blog from '../models/Blog.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
// All routes require admin
router.use(requireAuth, requireRole('admin'));

/* ── GET /api/admin/blogs — all blogs incl. drafts ── */
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .select('-content -__v')
      .lean({ virtuals: true });
    res.json(blogs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── GET /api/admin/blogs/:id — full blog with content (for editing drafts) ── */
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean({ virtuals: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── POST /api/admin/blogs — create new blog ── */
router.post('/', async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, author,
            gradient, featuredImage, metaTitle, metaDesc,
            focusKeyword, keywords, tags, readTime, featured, isPublished } = req.body;

    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });

    // Auto-generate slug if not provided
    let finalSlug = slug?.trim()
      || title.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .slice(0, 80);

    // Ensure slug uniqueness
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) finalSlug = `${finalSlug}-${Date.now()}`;

    const blog = await Blog.create({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt || '',
      content: Array.isArray(content) ? content : [],
      category: category || 'maintenance',
      author: author || {},
      gradient: gradient || 'linear-gradient(135deg, #006A4E 0%, #004d38 100%)',
      featuredImage: featuredImage || '',
      metaTitle: metaTitle || title.trim(),
      metaDesc: metaDesc || excerpt || '',
      focusKeyword: focusKeyword || '',
      keywords: Array.isArray(keywords) ? keywords : [],
      tags: Array.isArray(tags) ? tags : [],
      readTime: readTime || '৫ মিনিট',
      featured: !!featured,
      isPublished: !!isPublished,
    });
    res.status(201).json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── PUT /api/admin/blogs/:id — update blog ── */
router.put('/:id', async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, author,
            gradient, featuredImage, metaTitle, metaDesc,
            focusKeyword, keywords, tags, readTime, featured, isPublished } = req.body;

    const update = {};
    if (title       !== undefined) update.title       = title;
    if (slug        !== undefined) update.slug        = slug;
    if (excerpt     !== undefined) update.excerpt     = excerpt;
    if (content     !== undefined) update.content     = content;
    if (category    !== undefined) update.category    = category;
    if (author      !== undefined) update.author      = author;
    if (gradient    !== undefined) update.gradient    = gradient;
    if (featuredImage !== undefined) update.featuredImage = featuredImage;
    if (metaTitle   !== undefined) update.metaTitle   = metaTitle;
    if (metaDesc    !== undefined) update.metaDesc    = metaDesc;
    if (focusKeyword !== undefined) update.focusKeyword = focusKeyword;
    if (keywords    !== undefined) update.keywords    = keywords;
    if (tags        !== undefined) update.tags        = tags;
    if (readTime    !== undefined) update.readTime    = readTime;
    if (featured    !== undefined) update.featured    = featured;
    if (isPublished !== undefined) update.isPublished = isPublished;

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true }).lean({ virtuals: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── DELETE /api/admin/blogs/:id — delete blog ── */
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── PATCH /api/admin/blogs/:id/publish — toggle publish ── */
router.patch('/:id/publish', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ isPublished: blog.isPublished });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
