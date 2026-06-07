import express from 'express';
import mongoose from 'mongoose';
import Worker from '../models/Worker.js';
import Review from '../models/Review.js';

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const router = express.Router();

// GET /api/workers — public list (level ≥ 1 + approved)
router.get('/', async (req, res) => {
  try {
    const { category, area, available, q, sort = 'default', page = 1, limit = 20 } = req.query;

    const filter = { status: 'approved', verificationLevel: { $gte: 1 } };
    if (category)  filter.$or = [{ category }, { categories: category }];
    if (area)      filter.areas = { $in: [new RegExp(area, 'i')] };
    if (available !== undefined) filter.available = available === 'true';
    if (q) {
      // Support pipe-separated OR (from hierarchy expansion: "Upazila1|Upazila2|...")
      const terms = q.split('|').map((t) => t.trim()).filter(Boolean);
      if (terms.length === 1) {
        filter.$or = [
          { name:          new RegExp(terms[0], 'i') },
          { bio:           new RegExp(terms[0], 'i') },
          { areas:         { $in: [new RegExp(terms[0], 'i')] } },
          { subcategories: { $in: [new RegExp(terms[0], 'i')] } },
        ];
      } else {
        // Match any of the expanded areas
        const areaRegexes = terms.map((t) => new RegExp(`^${t}$`, 'i'));
        filter.areas = { $in: areaRegexes };
      }
    }

    const sortMap = {
      rating:     { verificationLevel: -1, rating: -1 },
      price_asc:  { hourlyRate: 1 },
      price_desc: { hourlyRate: -1 },
      exp:        { experience: -1 },
      reviews:    { reviewCount: -1 },
      default:    { verificationLevel: -1, rating: -1 },
    };

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const selectFields = 'name photo category categories areas rating reviewCount experience hourlyRate verified available verificationLevel status subcategories userId';

    // Run count + find in parallel; use lean() for plain JS objects (no Mongoose overhead)
    const [total, workers] = await Promise.all([
      Worker.countDocuments(filter),
      Worker.find(filter)
        .sort(sortMap[sort] || sortMap.default)
        .skip(skip)
        .limit(parseInt(limit))
        .select(selectFields)
        .lean(),
    ]);

    // ── Fallback: if a keyword search within a category returns 0 results,
    //    retry with category-only so users always see relevant workers ──
    if (workers.length === 0 && q && category) {
      const fallbackFilter = { status: 'approved', verificationLevel: { $gte: 1 } };
      fallbackFilter.$or = [{ category }, { categories: category }];
      if (available !== undefined) fallbackFilter.available = available === 'true';

      const [fbTotal, fbWorkers] = await Promise.all([
        Worker.countDocuments(fallbackFilter),
        Worker.find(fallbackFilter)
          .sort(sortMap[sort] || sortMap.default)
          .skip(skip)
          .limit(parseInt(limit))
          .select(selectFields)
          .lean(),
      ]);

      return res.json({
        workers: fbWorkers,
        total: fbTotal,
        page: parseInt(page),
        totalPages: Math.ceil(fbTotal / parseInt(limit)),
        fallback: true,        // client uses this to show the "no exact match" banner
        fallbackQuery: q,      // original search term for the banner message
      });
    }

    res.json({ workers, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), fallback: false });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/:identifier  — accepts MongoDB ObjectId OR phone number (01XXXXXXXXX)
router.get('/:identifier', async (req, res) => {
  const { identifier } = req.params;
  try {
    let worker;
    if (isValidObjectId(identifier)) {
      worker = await Worker.findById(identifier);
    } else {
      // Phone number lookup (e.g. 01712345678)
      worker = await Worker.findOne({ phone: identifier });
    }
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/workers/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: 'Invalid worker ID' });
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ workerId: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ workerId: req.params.id }),
    ]);

    // Rating distribution (count per star)
    const dist = await Review.aggregate([
      { $match: { workerId: new mongoose.Types.ObjectId(req.params.id) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    dist.forEach(({ _id, count }) => { distribution[_id] = count; });

    res.json({ reviews, total, distribution, page: parseInt(page) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/workers/:id/reviews
router.post('/:id/reviews', async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ message: 'Invalid worker ID' });
  try {
    const { reviewerName, reviewerEmail, rating, comment } = req.body;

    if (!reviewerName?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating 1–5 required' });
    if (!comment?.trim()) return res.status(400).json({ message: 'Comment is required' });

    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    const review = await Review.create({
      workerId: req.params.id,
      reviewerName: reviewerName.trim(),
      reviewerEmail: reviewerEmail?.trim() || '',
      rating: parseInt(rating),
      comment: comment.trim(),
    });

    // Recalculate worker's average rating
    const agg = await Review.aggregate([
      { $match: { workerId: worker._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (agg.length) {
      await Worker.findByIdAndUpdate(req.params.id, {
        rating: Math.round(agg[0].avg * 10) / 10,
        reviewCount: agg[0].count,
      });
    }

    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/workers/:id/report
router.post('/:id/report', async (req, res) => {
  try {
    const { reason, details, reporterEmail } = req.body;
    if (!reason) return res.status(400).json({ message: 'Reason is required' });

    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    worker.reports.push({ reason, details: details || '', reporterEmail: reporterEmail || 'anonymous', createdAt: new Date() });
    worker.reportCount = worker.reports.length;
    if (worker.reportCount >= 3 && !worker.flagged) {
      worker.flagged  = true;
      worker.flagReason = `Auto-flagged: ${worker.reportCount} user reports`;
    }
    await worker.save();
    res.json({ message: 'Report submitted. Thank you.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
