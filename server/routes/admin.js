import express from 'express';
import Worker from '../models/Worker.js';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

/* ── Stats ── */
router.get('/stats', async (req, res) => {
  try {
    const [totalWorkers, pendingWorkers, approvedWorkers, rejectedWorkers, totalClients, flaggedWorkers,
           level0, level1, level2, level3, level4] = await Promise.all([
      Worker.countDocuments(),
      Worker.countDocuments({ status: 'pending' }),
      Worker.countDocuments({ status: 'approved' }),
      Worker.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'client' }),
      Worker.countDocuments({ flagged: true }),
      Worker.countDocuments({ verificationLevel: 0 }),
      Worker.countDocuments({ verificationLevel: 1 }),
      Worker.countDocuments({ verificationLevel: 2 }),
      Worker.countDocuments({ verificationLevel: 3 }),
      Worker.countDocuments({ verificationLevel: 4 }),
    ]);
    res.json({ totalWorkers, pendingWorkers, approvedWorkers, rejectedWorkers, totalClients, flaggedWorkers,
               levelCounts: [level0, level1, level2, level3, level4] });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Workers list ── */
router.get('/workers', async (req, res) => {
  try {
    const { status, level, flagged } = req.query;
    const filter = {};
    if (status)  filter.status = status;
    if (level !== undefined) filter.verificationLevel = parseInt(level);
    if (flagged === 'true') filter.flagged = true;
    const workers = await Worker.find(filter).sort({ createdAt: -1 });
    res.json(workers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Single worker detail ── */
router.get('/workers/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Not found' });
    let user = null;
    if (worker.userId) user = await User.findById(worker.userId).select('-password');
    res.json({ worker, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Bulk status change (pending / rejected) ── */
router.put('/workers/bulk-status', async (req, res) => {
  try {
    const { ids, status, note } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ message: 'No IDs provided' });
    if (!['pending', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Status must be pending or rejected' });

    const update = { status, reviewedAt: new Date() };
    if (status === 'rejected') {
      update.verified = false;
      update.rejectionNote = note || '';
    }
    if (status === 'pending') {
      update.rejectionNote = '';
      update.reuploadRequested = false;
    }

    const result = await Worker.updateMany({ _id: { $in: ids } }, update);
    res.json({ updated: result.modifiedCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Bulk approve ── */
router.put('/workers/bulk-approve', async (req, res) => {
  try {
    const { ids, targetLevel = 1 } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ message: 'No IDs provided' });
    const lvl = Math.min(4, Math.max(0, parseInt(targetLevel)));
    const result = await Worker.updateMany(
      { _id: { $in: ids } },
      {
        status: 'approved',
        verified: lvl >= 2,
        verificationLevel: lvl,
        reviewedAt: new Date(),
        reuploadRequested: false,
        reuploadNote: '',
        rejectionNote: '',
      }
    );
    res.json({ updated: result.modifiedCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Approve (with optional level jump) ── */
router.put('/workers/:id/approve', async (req, res) => {
  try {
    const { note, targetLevel } = req.body;
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Not found' });

    const newLevel = targetLevel !== undefined
      ? Math.min(4, Math.max(worker.verificationLevel, parseInt(targetLevel)))
      : Math.min(4, worker.verificationLevel + 1);

    const updated = await Worker.findByIdAndUpdate(req.params.id, {
      status: 'approved',
      verified: newLevel >= 2,
      verificationLevel: newLevel,
      rejectionNote: '',
      reuploadRequested: false,
      reuploadNote: '',
      reviewedAt: new Date(),
      adminNote: note || worker.adminNote,
    }, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Reject ── */
router.put('/workers/:id/reject', async (req, res) => {
  try {
    const { note, adminNote } = req.body;
    const updated = await Worker.findByIdAndUpdate(req.params.id, {
      status: 'rejected', verified: false,
      rejectionNote: note || '',
      reviewedAt: new Date(),
      adminNote: adminNote || '',
    }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Request re-upload ── */
router.put('/workers/:id/request-reupload', async (req, res) => {
  try {
    const { note } = req.body;
    const updated = await Worker.findByIdAndUpdate(req.params.id, {
      reuploadRequested: true,
      reuploadNote: note || 'Please re-upload your documents.',
      status: 'pending',
    }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Set verification level directly ── */
router.put('/workers/:id/set-level', async (req, res) => {
  try {
    const { level, note } = req.body;
    if (level < 0 || level > 4) return res.status(400).json({ message: 'Level must be 0–4' });
    const updated = await Worker.findByIdAndUpdate(req.params.id, {
      verificationLevel: level,
      verified: level >= 2,
      status: level >= 1 ? 'approved' : 'pending',
      reviewedAt: new Date(),
      adminNote: note || '',
    }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Flag / unflag ── */
router.put('/workers/:id/flag', async (req, res) => {
  try {
    const { flag, reason } = req.body;
    const updated = await Worker.findByIdAndUpdate(req.params.id, {
      flagged: !!flag,
      flagReason: flag ? (reason || 'Flagged by admin') : '',
    }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Save admin note ── */
router.put('/workers/:id/note', async (req, res) => {
  try {
    const updated = await Worker.findByIdAndUpdate(req.params.id, { adminNote: req.body.note }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Clients ── */
router.get('/clients', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/clients/:id', async (req, res) => {
  try {
    const client = await User.findById(req.params.id).select('-password');
    if (!client || client.role !== 'client') return res.status(404).json({ message: 'Not found' });
    res.json(client);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── All users (workers + clients, searchable) ── */
router.get('/users', async (req, res) => {
  try {
    const { q, role } = req.query;
    const filter = { role: { $in: ['worker', 'client'] } };
    if (role && ['worker', 'client'].includes(role)) filter.role = role;
    if (q?.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      filter.$or = [
        { name: rx },
        { email: rx },
        { phone: rx },
        { area: rx },
      ];
    }
    const users = await User.find(filter).select('-password -resetOtp -resetOtpExpiry').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Update any user (name, email, phone, area, role) ── */
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, phone, area, role } = req.body;
    const update = {};
    if (name  !== undefined) update.name  = name.trim();
    if (email !== undefined) update.email = email.trim().toLowerCase();
    if (phone !== undefined) update.phone = phone.trim();
    if (area  !== undefined) update.area  = area.trim();
    if (role  !== undefined && ['worker', 'client', 'admin'].includes(role)) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password -resetOtp -resetOtpExpiry');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'এই ইমেইল বা ফোন নম্বর ইতিমধ্যে ব্যবহৃত' });
    res.status(500).json({ message: err.message });
  }
});

/* ── Delete user ── */
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    // Also clean up worker profile if applicable
    if (user.role === 'worker') {
      await Worker.deleteOne({ userId: req.params.id });
    }
    res.json({ message: 'ব্যবহারকারী মুছে ফেলা হয়েছে' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;

