import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    workerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true, index: true },
    workerName:  { type: String },
    workerPhone: { type: String },
    customerName:  { type: String, required: true, trim: true, maxlength: 100 },
    customerPhone: { type: String, required: true, trim: true, maxlength: 20  },
    preferredDate: { type: String, trim: true, maxlength: 30 },
    problem:       { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ServiceRequest', serviceRequestSchema);
