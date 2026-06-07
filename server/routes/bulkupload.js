import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import Worker from '../models/Worker.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Memory storage — parse Excel in-memory, no temp files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const ok = ['.xlsx', '.xls', '.csv'].some((ext) => file.originalname.toLowerCase().endsWith(ext));
    ok ? cb(null, true) : cb(new Error('Excel/CSV files only (.xlsx, .xls, .csv)'));
  },
});

const VALID_CATEGORIES = ['plumber','electrician','cleaner','bua','painter','ac_repair','carpenter','gas_fitter','isp','rajmistri','contractor'];

// POST /api/bulk/workers  — parse Excel, preview or insert workers
router.post('/workers', requireAuth, requireRole('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // CSV files must be decoded as UTF-8 string first; .xlsx can use buffer directly
    const isCsv = req.file.originalname.toLowerCase().endsWith('.csv');
    const wb = isCsv
      ? XLSX.read(req.file.buffer.toString('utf8'), { type: 'string' })
      : XLSX.read(req.file.buffer, { type: 'buffer', codepage: 65001 });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    if (!rows.length) return res.status(400).json({ message: 'Excel file is empty' });

    const preview = req.body.preview === 'true';
    const results = { inserted: 0, errors: [], rows: [] };

    const workers = rows.map((row, i) => {
      const name     = String(row['Name'] || row['name'] || '').trim();
      const phone    = String(row['Phone'] || row['phone'] || '').trim();
      const category = String(row['Category'] || row['category'] || '').trim().toLowerCase().replace(/\s+/g, '_');
      const areas    = String(row['Areas'] || row['areas'] || '').split(',').map((a) => a.trim()).filter(Boolean);
      const exp      = parseInt(row['Experience'] || row['experience'] || 1);
      const rate     = parseInt(row['HourlyRate'] || row['hourly_rate'] || 0) || undefined;
      const bio      = String(row['Bio'] || row['bio'] || '').trim();
      const langs    = String(row['Languages'] || row['languages'] || 'Bengali').split(',').map((l) => l.trim()).filter(Boolean);
      const email    = String(row['Email'] || row['email'] || '').trim().toLowerCase();

      const errs = [];
      if (!name)  errs.push('Name missing');
      if (!phone) errs.push('Phone missing');
      if (!category) errs.push('Category missing');
      if (!areas.length) errs.push('At least one area required');

      if (errs.length) { results.errors.push(`Row ${i + 2}: ${errs.join(', ')}`); return null; }

      return { name, phone, email, category, areas, experience: exp, hourlyRate: rate, bio, languages: langs, status: 'pending', verified: false, verificationLevel: 0 };
    }).filter(Boolean);

    if (preview) {
      return res.json({ total: rows.length, valid: workers.length, errors: results.errors, sample: workers.slice(0, 5) });
    }

    // Insert
    if (workers.length > 0) {
      const inserted = await Worker.insertMany(workers, { ordered: false });
      results.inserted = inserted.length;
    }

    res.json({ inserted: results.inserted, errors: results.errors, total: rows.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bulk/template  — download Excel template
router.get('/template', requireAuth, requireRole('admin'), (req, res) => {
  const headers = [['Name','Phone','Email','Category','Areas','Experience','HourlyRate','Bio','Languages']];
  const sample  = [['Rahim Ahmed','01711-123456','rahim@example.com','electrician','Gazipur Sadar, Tongi','5','400','Licensed electrician, DB board, AC installation','Bengali, English']];
  const note    = [['CATEGORIES: plumber | electrician | cleaner | bua | painter | ac_repair | carpenter | gas_fitter | isp | rajmistri | contractor']];

  const ws = XLSX.utils.aoa_to_sheet([...headers, ...sample, [], ...note]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Workers');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename=karigori_workers_template.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
});

export default router;
