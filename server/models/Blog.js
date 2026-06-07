import mongoose from 'mongoose';

const ContentBlockSchema = new mongoose.Schema({
  type: { type: String, enum: ['intro','h2','h3','p','list','table','tip','faq','cta'] },
  text: String,
  items: [String],
  headers: [String],
  rows: [[String]],
  question: String,
  answer: String,
}, { _id: false });

const BlogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt:     { type: String, trim: true },
  content:     [ContentBlockSchema],
  category:    { type: String, default: 'maintenance' },
  author: {
    name:   { type: String, default: 'কারিগরি টিম' },
    role:   { type: String, default: 'সার্ভিস বিশেষজ্ঞ' },
    avatar: { type: String, default: 'ক' },
    bio:    { type: String, default: '' },
  },
  gradient:        { type: String, default: 'linear-gradient(135deg, #006A4E 0%, #004d38 100%)' },
  featuredImage:   { type: String, default: '' },
  metaTitle:       { type: String, default: '' },
  metaDesc:        { type: String, default: '' },
  focusKeyword:    { type: String, default: '' },
  keywords:        [String],
  tags:            [String],
  readTime:        { type: String, default: '৫ মিনিট' },
  views:           { type: Number, default: 0 },
  featured:        { type: Boolean, default: false },
  isPublished:     { type: Boolean, default: false },
}, { timestamps: true });

// Virtual "date" for backward compat with frontend display
BlogSchema.virtual('date').get(function () {
  return new Date(this.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
});
BlogSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Blog', BlogSchema);
