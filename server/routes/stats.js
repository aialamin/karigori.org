/**
 * GET /api/stats  — public, cached 60s
 * Returns live counts: workers, categories, areas, jobs
 */
import express from 'express';
import Worker from '../models/Worker.js';
import Config from '../models/Config.js';

// 11 built-in categories (must stay in sync with client/src/constants.js)
const BUILT_IN_CATEGORIES = ['plumber','electrician','cleaner','bua','painter','ac_repair','carpenter','gas_fitter','isp','rajmistri','contractor'];

const router = express.Router();

let cache = null;
let cacheAt = 0;
const TTL = 60_000; // 60 seconds

router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (cache && now - cacheAt < TTL) return res.json(cache);

    const [workerCount, configDoc, areaAgg, jobAgg] = await Promise.all([
      // Total approved + verified workers
      Worker.countDocuments({ status: 'approved', verificationLevel: { $gte: 1 } }),

      // Extra admin-added categories
      Config.findOne().select('extraCategories').lean(),

      // Distinct areas count
      Worker.aggregate([
        { $match: { status: 'approved', verificationLevel: { $gte: 1 } } },
        { $unwind: '$areas' },
        { $group: { _id: null, unique: { $addToSet: '$areas' } } },
        { $project: { count: { $size: '$unique' } } },
      ]),

      // Total completed jobs
      Worker.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, total: { $sum: '$jobCount' } } },
      ]),
    ]);

    const extraCatCount = (configDoc?.extraCategories || []).length;
    cache = {
      workers:    workerCount,
      categories: BUILT_IN_CATEGORIES.length + extraCatCount,
      areas:      areaAgg[0]?.count ?? 0,
      jobs:       jobAgg[0]?.total  ?? 0,
    };
    cacheAt = now;

    res.json(cache);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
