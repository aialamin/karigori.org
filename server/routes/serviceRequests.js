import express from 'express';
import Worker from '../models/Worker.js';
import ServiceRequest from '../models/ServiceRequest.js';

const router = express.Router();

// POST /api/service-requests
// Creates a real service request record linked to the worker
router.post('/', async (req, res) => {
  try {
    const { workerId, customerName, customerPhone, preferredDate, problem } = req.body;

    // Validate required fields
    if (!workerId)       return res.status(400).json({ message: 'workerId is required' });
    if (!customerName?.trim())  return res.status(400).json({ message: 'Your name is required' });
    if (!customerPhone?.trim()) return res.status(400).json({ message: 'Phone number is required' });
    if (!problem?.trim())       return res.status(400).json({ message: 'Problem description is required' });

    // Validate BD phone number format
    const phone = customerPhone.trim().replace(/-/g, '');
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      return res.status(400).json({ message: 'Enter a valid Bangladesh mobile number (01XXXXXXXXX)' });
    }

    // Verify worker exists and is approved
    const worker = await Worker.findOne({
      _id: workerId,
      status: 'approved',
      verificationLevel: { $gte: 1 },
    }).select('name phone').lean();

    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    const request = await ServiceRequest.create({
      workerId:      worker._id,
      workerName:    worker.name,
      workerPhone:   worker.phone,
      customerName:  customerName.trim(),
      customerPhone: phone,
      preferredDate: preferredDate?.trim() || '',
      problem:       problem.trim(),
    });

    res.status(201).json({
      message: 'Request submitted successfully',
      requestId: request._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/service-requests/worker/:workerId — for worker dashboard
// (Protected: only the authenticated worker should see their own requests)
router.get('/worker/:workerId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      ServiceRequest.find({ workerId: req.params.workerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ServiceRequest.countDocuments({ workerId: req.params.workerId }),
    ]);

    res.json({ requests, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
