import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Worker from '../models/Worker.js';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const safe = file.fieldname.replace(/[^a-z0-9_]/gi, '_');
    cb(null, `${safe}_${req.user._id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB
  fileFilter: (req, file, cb) => {
    const ok = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
    ok ? cb(null, true) : cb(new Error('Images and PDFs only'));
  },
});

/* ── Worker own profile ──────────────────────────────────────────── */

// GET /api/profile/worker
router.get('/worker', requireAuth, requireRole('worker'), async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Profile not found' });
    res.json(worker);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/profile/worker — update text fields
router.put('/worker', requireAuth, requireRole('worker'), async (req, res) => {
  try {
    const { bio, areas, hourlyRate, experience, languages, available, phone, nidNumber, subcategories, categories } = req.body;
    const cats = Array.isArray(categories) ? categories.slice(0, 3) : undefined;
    const update = { bio, areas, hourlyRate: parseInt(hourlyRate) || undefined, experience: parseInt(experience) || 1, languages, available, phone, nidNumber: nidNumber || '', subcategories: subcategories || [] };
    if (cats?.length) { update.categories = cats; update.category = cats[0]; }
    const worker = await Worker.findOneAndUpdate(
      { userId: req.user._id },
      update,
      { new: true }
    );
    if (!worker) return res.status(404).json({ message: 'Profile not found' });
    res.json(worker);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* Convert any uploaded image to WebP for smaller size & faster load */
async function toWebP(filePath) {
  try {
    const webpPath = filePath.replace(/\.[^.]+$/, '.webp');
    await sharp(filePath).resize(800, 800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(webpPath);
    // Remove original if different file
    if (webpPath !== filePath) fs.unlink(filePath, () => {});
    return webpPath;
  } catch { return filePath; }
}

// POST /api/profile/worker/photo — profile photo (→ WebP)
router.post('/worker/photo', requireAuth, requireRole('worker'), upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const originalPath = req.file.path;
    const webpPath     = await toWebP(originalPath);
    const photoUrl     = `/uploads/${path.basename(webpPath)}`;
    const worker       = await Worker.findOneAndUpdate({ userId: req.user._id }, { photo: photoUrl }, { new: true });
    res.json({ photo: photoUrl, worker });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/profile/worker/selfie — selfie holding NID card (Level 2)
router.post('/worker/selfie', requireAuth, requireRole('worker'), upload.single('selfie'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const worker = await Worker.findOneAndUpdate(
      { userId: req.user._id },
      { selfieWithId: `/uploads/${req.file.filename}` },
      { new: true }
    );
    res.json({ selfie: `/uploads/${req.file.filename}`, worker });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/profile/worker/documents — NID + certificates
router.post(
  '/worker/documents',
  requireAuth, requireRole('worker'),
  upload.fields([
    { name: 'nidFront',      maxCount: 1 },
    { name: 'nidBack',       maxCount: 1 },
    { name: 'certificates',  maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const updates = {};
      if (req.files?.nidFront?.[0])  {
        const p = await toWebP(req.files.nidFront[0].path);
        updates.nidFront = `/uploads/${path.basename(p)}`;
      }
      if (req.files?.nidBack?.[0]) {
        const p = await toWebP(req.files.nidBack[0].path);
        updates.nidBack = `/uploads/${path.basename(p)}`;
      }
      if (req.files?.certificates?.length) {
        const converted = await Promise.all(req.files.certificates.map((f) => toWebP(f.path)));
        updates.certificates = converted.map((p) => `/uploads/${path.basename(p)}`);
      }
      if (req.body.nidNumber) updates.nidNumber = req.body.nidNumber;

      const worker = await Worker.findOneAndUpdate({ userId: req.user._id }, updates, { new: true });
      if (!worker) return res.status(404).json({ message: 'Profile not found' });
      res.json(worker);
    } catch (err) { res.status(500).json({ message: err.message }); }
  }
);

/* ── Client profile ──────────────────────────────────────────────── */

// PUT /api/profile/client
router.put('/client', requireAuth, requireRole('client'), async (req, res) => {
  try {
    const { area, phone, name } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { area, phone, name }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
