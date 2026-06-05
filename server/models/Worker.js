import mongoose from 'mongoose';

/*
 * Verification Levels:
 *   0 — Unverified      (hidden from search)
 *   1 — Phone Verified  (OTP confirmed)
 *   2 — ID Verified     (NID + selfie + admin approved)
 *   3 — Skilled         (certificates + skills + admin approved)
 *   4 — Trusted Pro     (20+ jobs, 4.5+ rating, admin audit)
 */

const workerSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name:          { type: String, required: true },
  phone:         { type: String, required: true },
  email:         { type: String, default: '' },
  category:      { type: String, required: true, enum: ['plumber','electrician','cleaner','bua','painter','ac_repair','carpenter','gas_fitter'] },
  areas:         [{ type: String }],
  rating:        { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:   { type: Number, default: 0 },
  jobCount:      { type: Number, default: 0 },
  experience:    { type: Number, default: 1 },
  bio:           { type: String, default: '' },
  photo:         { type: String, default: '' },
  verified:      { type: Boolean, default: false },
  available:     { type: Boolean, default: true },
  languages:     [{ type: String }],
  hourlyRate:    { type: Number },

  // Account status
  status:        { type: String, enum: ['pending','approved','rejected'], default: 'approved' },
  rejectionNote: { type: String, default: '' },
  adminNote:     { type: String, default: '' },
  reviewedAt:    { type: Date },

  // Verification level (0-4)
  verificationLevel: { type: Number, default: 0, min: 0, max: 4 },

  // OTP (phone verification → Level 1)
  otp:           { type: String, default: null },
  otpExpiry:     { type: Date,   default: null },
  otpVerified:   { type: Boolean, default: false },

  // Documents (Level 2 — Identity)
  nidFront:      { type: String, default: '' },
  nidBack:       { type: String, default: '' },
  nidNumber:     { type: String, default: '' },
  selfieWithId:  { type: String, default: '' },   // selfie holding ID card

  // Skills (Level 3)
  certificates:        [{ type: String }],
  workSamples:         [{ type: String }],
  referenceContact:    { type: String, default: '' },

  // Re-upload request
  reuploadRequested:   { type: Boolean, default: false },
  reuploadNote:        { type: String, default: '' },

  // Anti-fraud
  flagged:       { type: Boolean, default: false },
  flagReason:    { type: String, default: '' },

  // Reports from users
  reportCount:   { type: Number, default: 0 },
  reports:       [{
    reason:      { type: String },
    details:     { type: String },
    reporterEmail:{ type: String },
    createdAt:   { type: Date, default: Date.now },
  }],
}, { timestamps: true });

workerSchema.index({ category: 1, areas: 1, status: 1, verificationLevel: 1 });
workerSchema.index({ nidNumber: 1 });

export default mongoose.model('Worker', workerSchema);
