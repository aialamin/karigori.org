import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

/* ── GET /api/blogs — public list (published only, latest first) ── */
router.get('/', async (req, res) => {
  try {
    const { category, q, limit = 20, page = 1 } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'all') filter.category = category;
    if (q) {
      const rx = new RegExp(q, 'i');
      filter.$or = [{ title: rx }, { excerpt: rx }, { tags: { $in: [rx] } }];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-content -__v')
        .lean({ virtuals: true }),
      Blog.countDocuments(filter),
    ]);
    res.json({ blogs, total, page: parseInt(page) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── GET /api/blogs/:slug — single post by slug ── */
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).lean({ virtuals: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
