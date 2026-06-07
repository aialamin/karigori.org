import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/* ── Register ─────────────────────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, area,
            category, categories, experience, hourlyRate, bio, areas, languages, subcategories } = req.body;

    if (!['worker', 'client'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'This email is already registered. Please sign in.' });

    if (phone?.trim()) {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone)
        return res.status(400).json({ message: 'This phone number is already registered. Please sign in or use a different number.' });
    }

    const user = await User.create({ name, email, password, role, phone: phone?.trim() || '', area: area || '' });

    let workerProfile = null;
    if (role === 'worker') {
      workerProfile = await Worker.create({
        userId: user._id, name, phone, email,
        category: (Array.isArray(categories) ? categories[0] : category) || 'plumber',
        categories: Array.isArray(categories) ? categories.slice(0, 3) : (category ? [category] : []),
        experience: parseInt(experience) || 1,
        hourlyRate: parseInt(hourlyRate) || undefined,
        bio: bio || '',
        areas: areas || [],
        subcategories: subcategories || [],
        languages: languages || ['Bengali'],
        status: 'pending',
        verified: false,
        verificationLevel: 0,
      });
    }

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, area: user.area },
      workerProfile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Login (email OR phone) ───────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier?.trim() || !password)
      return res.status(400).json({ message: 'Please enter your email/phone and password.' });

    const isEmail = identifier.includes('@');
    const user = isEmail
      ? await User.findOne({ email: identifier.trim().toLowerCase() })
      : await User.findOne({ phone: identifier.trim() });

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Incorrect email/phone or password.' });

    let workerProfile = null;
    if (user.role === 'worker') workerProfile = await Worker.findOne({ userId: user._id });

    const token = signToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, area: user.area },
      workerProfile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── Me ───────────────────────────────────────────────────────────── */
router.get('/me', requireAuth, async (req, res) => {
  try {
    let workerProfile = null;
    if (req.user.role === 'worker') workerProfile = await Worker.findOne({ userId: req.user._id });
    res.json({
      user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, phone: req.user.phone, area: req.user.area },
      workerProfile,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── OTP: send ────────────────────────────────────────────────────── */
router.post('/send-otp', requireAuth, async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
    if (worker.otpVerified) return res.json({ message: 'Phone already verified', alreadyVerified: true });

    const otp = genOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await Worker.findByIdAndUpdate(worker._id, { otp, otpExpiry: expiry });

    // ── Production: replace this with Twilio / Firebase SMS ──
    // await twilio.messages.create({ body: `Karigori OTP: ${otp}`, from: ..., to: worker.phone });
    if (process.env.NODE_ENV !== 'production') console.log(`[DEV] OTP for ${worker.phone}: ${otp}`);

    res.json({
      message: 'OTP sent to ' + worker.phone,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined, // remove in prod
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── OTP: verify ──────────────────────────────────────────────────── */
router.post('/verify-otp', requireAuth, async (req, res) => {
  try {
    const { otp } = req.body;
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    if (worker.otpVerified) return res.json({ message: 'Already verified', worker });

    if (!worker.otp || worker.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > worker.otpExpiry)
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });

    const newLevel = Math.max(worker.verificationLevel, 1);
    const updated = await Worker.findByIdAndUpdate(worker._id, {
      otpVerified: true,
      otp: null,
      otpExpiry: null,
      verificationLevel: newLevel,
      status: newLevel >= 1 ? 'pending' : worker.status, // stays pending until admin approves
    }, { new: true });

    res.json({ message: 'Phone verified! ✓', worker: updated });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Forgot password: send OTP ───────────────────────────────────── */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ message: 'ইমেইল দিন' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    // Always return success (don't reveal if email exists)
    if (!user) return res.json({ message: 'OTP পাঠানো হয়েছে (যদি অ্যাকাউন্ট থাকে)' });

    const otp = genOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.resetOtp = otp;
    user.resetOtpExpiry = expiry;
    await user.save();

    // Production: send email here via nodemailer / SendGrid
    if (process.env.NODE_ENV !== 'production') console.log(`[DEV] Password reset OTP for ${email}: ${otp}`);

    res.json({
      message: 'OTP পাঠানো হয়েছে',
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Forgot password: verify OTP ─────────────────────────────────── */
router.post('/verify-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'ইমেইল ও OTP দিন' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.resetOtp)
      return res.status(400).json({ message: 'OTP পাওয়া যায়নি। আবার OTP পাঠান।' });
    if (user.resetOtp !== String(otp))
      return res.status(400).json({ message: 'OTP সঠিক নয়' });
    if (new Date() > user.resetOtpExpiry)
      return res.status(400).json({ message: 'OTP মেয়াদ শেষ। আবার OTP নিন।' });

    // Mark OTP as verified (extend expiry by 10 min for reset step; don't clear yet)
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    res.json({ message: 'OTP সঠিক' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Forgot password: reset ──────────────────────────────────────── */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'সব তথ্য দিন' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.resetOtp)
      return res.status(400).json({ message: 'OTP পাওয়া যায়নি। আবার চেষ্টা করুন।' });
    if (user.resetOtp !== String(otp))
      return res.status(400).json({ message: 'OTP সঠিক নয়' });
    if (new Date() > user.resetOtpExpiry)
      return res.status(400).json({ message: 'OTP মেয়াদ শেষ। আবার OTP নিন।' });

    user.password = newPassword; // User model should hash on save
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;

