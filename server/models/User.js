import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['worker', 'client', 'admin'], required: true },
  phone:    { type: String, default: '', trim: true },
  area:     { type: String, default: '' },
}, { timestamps: true });

// Sparse unique index: applies only when phone is non-empty
userSchema.index({ phone: 1 }, { unique: true, sparse: true, partialFilterExpression: { phone: { $gt: '' } } });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
