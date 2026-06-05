import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  workerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true, index: true },
  reviewerName:  { type: String, required: true, trim: true },
  reviewerEmail: { type: String, default: '', lowercase: true, trim: true },
  rating:        { type: Number, required: true, min: 1, max: 5 },
  comment:       { type: String, required: true, trim: true, maxlength: 500 },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
