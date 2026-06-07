/**
 * seed-new-services.js
 * Adds sample workers for ISP, রাজমিস্ত্রি and Contractor categories
 *
 * Run once:  node server/seed-new-services.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from './models/Worker.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/karigori';

const WORKERS = [
  /* ── ISP / Internet Provider ── */
  {
    name: 'রাকিব হোসেন',
    phone: '01711-222333',
    category: 'isp',
    areas: ['Gazipur Sadar', 'Joydebpur', 'Tongi', 'Kaliakoir'],
    experience: 5,
    hourlyRate: 500,
    rating: 4.6,
    reviewCount: 34,
    bio: 'ব্রডব্যান্ড ইন্টারনেট সংযোগ, রাউটার কনফিগারেশন ও ওয়্যারিং বিশেষজ্ঞ। ৫ বছরের অভিজ্ঞতা।',
    subcategories: ['ব্রডব্যান্ড কানেকশন', 'ওয়াইফাই সেটআপ', 'রাউটার কনফিগ'],
    status: 'approved',
    verificationLevel: 2,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },
  {
    name: 'সাইফুল ইসলাম',
    phone: '01812-334455',
    category: 'isp',
    areas: ['Dhanmondi', 'Mohammadpur', 'Shyamoli', 'Mirpur'],
    experience: 7,
    hourlyRate: 600,
    rating: 4.8,
    reviewCount: 52,
    bio: 'ISP ইন্টারনেট সার্ভিস, নেটওয়ার্ক ট্রাবলশুটিং ও ক্যাবল ওয়্যারিং — ঢাকার সেরা প্রযুক্তিবিদ।',
    subcategories: ['ক্যাবল ওয়্যারিং', 'নেটওয়ার্ক ট্রাবলশুট', 'ওয়াইফাই এক্সটেন্ডার'],
    status: 'approved',
    verificationLevel: 2,
    verified: true,
    available: true,
    languages: ['Bengali', 'English'],
  },
  {
    name: 'আরিফ রহমান',
    phone: '01911-445566',
    category: 'isp',
    areas: ['Narayanganj Sadar', 'Fatullah', 'Siddhirganj', 'Rupganj'],
    experience: 4,
    hourlyRate: 450,
    rating: 4.5,
    reviewCount: 21,
    bio: 'নারায়ণগঞ্জে ব্রডব্যান্ড ও ওয়াইফাই সেটআপে অভিজ্ঞ।',
    subcategories: ['ব্রডব্যান্ড কানেকশন', 'ওয়াইফাই সেটআপ'],
    status: 'approved',
    verificationLevel: 2,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },

  /* ── রাজমিস্ত্রি (Mason) ── */
  {
    name: 'আবুল কালাম',
    phone: '01611-556677',
    category: 'rajmistri',
    areas: ['Dhaka', 'Dhanmondi', 'Mohammadpur', 'Savar', 'Keraniganj'],
    experience: 12,
    hourlyRate: 700,
    rating: 4.7,
    reviewCount: 89,
    bio: 'পাকা রাজমিস্ত্রি — ইটের গাঁথুনি, প্লাস্টারিং, টাইলস ফিটিং ও ফ্লোর কাজে ১২ বছরের অভিজ্ঞতা।',
    subcategories: ['ইটের গাঁথুনি', 'প্লাস্টারিং', 'টাইলস ফিটিং', 'ফ্লোর কাজ'],
    status: 'approved',
    verificationLevel: 3,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },
  {
    name: 'মজিবুর রহমান',
    phone: '01711-667788',
    category: 'rajmistri',
    areas: ['Gazipur Sadar', 'Joydebpur', 'Sreepur', 'Kaliakoir', 'Kapasia'],
    experience: 8,
    hourlyRate: 650,
    rating: 4.6,
    reviewCount: 64,
    bio: 'গাজীপুর ও আশেপাশে রাজমিস্ত্রি কাজে দক্ষ — দেয়াল নির্মাণ, ভিত্তি মেরামত ও টাইলস।',
    subcategories: ['দেয়াল নির্মাণ', 'ভিত্তি নির্মাণ', 'টাইলস ফিটিং'],
    status: 'approved',
    verificationLevel: 2,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },
  {
    name: 'রহিম মিয়া',
    phone: '01811-778899',
    category: 'rajmistri',
    areas: ['Narsingdi Sadar', 'Palash', 'Raipura', 'Monohardi'],
    experience: 15,
    hourlyRate: 700,
    rating: 4.9,
    reviewCount: 115,
    bio: 'নরসিংদীর সিনিয়র রাজমিস্ত্রি — বাড়ি তৈরি থেকে মেরামত সব কাজ করি।',
    subcategories: ['ইটের গাঁথুনি', 'প্লাস্টারিং', 'ফ্লোর কাজ', 'ভিত্তি নির্মাণ'],
    status: 'approved',
    verificationLevel: 3,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },
  {
    name: 'কামাল হোসেন',
    phone: '01511-889900',
    category: 'rajmistri',
    areas: ['Narayanganj Sadar', 'Araihazar', 'Sonargaon', 'Rupganj'],
    experience: 10,
    hourlyRate: 600,
    rating: 4.5,
    reviewCount: 73,
    bio: 'নারায়ণগঞ্জে টাইলস ফিটিং ও প্লাস্টারিং বিশেষজ্ঞ।',
    subcategories: ['টাইলস ফিটিং', 'প্লাস্টারিং', 'ইটের গাঁথুনি'],
    status: 'approved',
    verificationLevel: 2,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },

  /* ── Contractor ── */
  {
    name: 'ইঞ্জি. শফিউল আলম',
    phone: '01711-990011',
    category: 'contractor',
    areas: ['Dhaka', 'Gulshan', 'Banani', 'Uttara', 'Bashundhara', 'Mirpur'],
    experience: 18,
    hourlyRate: 0,
    rating: 4.9,
    reviewCount: 47,
    bio: 'সিভিল ইঞ্জিনিয়ার ও অভিজ্ঞ ঠিকাদার — বাড়ি নির্মাণ, রিনোভেশন ও ইন্টেরিয়র ডিজাইন প্রজেক্টে ১৮ বছর।',
    subcategories: ['বাড়ি নির্মাণ', 'ইন্টেরিয়র রিনোভেশন', 'নির্মাণ ব্যবস্থাপনা'],
    status: 'approved',
    verificationLevel: 4,
    verified: true,
    available: true,
    languages: ['Bengali', 'English'],
  },
  {
    name: 'মোঃ সালাউদ্দিন',
    phone: '01611-001122',
    category: 'contractor',
    areas: ['Gazipur Sadar', 'Tongi', 'Joydebpur', 'Sreepur', 'Kaliakoir'],
    experience: 14,
    hourlyRate: 0,
    rating: 4.7,
    reviewCount: 38,
    bio: 'গাজীপুরে শিল্প ভবন ও আবাসিক প্রজেক্টে অভিজ্ঞ ঠিকাদার।',
    subcategories: ['বাড়ি নির্মাণ', 'সাব-কন্ট্রাক্টিং', 'ছাদ ও ফ্লোর'],
    status: 'approved',
    verificationLevel: 3,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },
  {
    name: 'আনোয়ার হোসেন',
    phone: '01811-112233',
    category: 'contractor',
    areas: ['Narayanganj Sadar', 'Rupganj', 'Sonargaon', 'Fatullah'],
    experience: 10,
    hourlyRate: 0,
    rating: 4.6,
    reviewCount: 29,
    bio: 'নারায়ণগঞ্জে বাড়ি ও অফিস নির্মাণ প্রজেক্টে অভিজ্ঞ।',
    subcategories: ['বাড়ি নির্মাণ', 'ইন্টেরিয়র রিনোভেশন'],
    status: 'approved',
    verificationLevel: 3,
    verified: true,
    available: true,
    languages: ['Bengali'],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✔ Connected to MongoDB:', MONGO_URI);

  let added = 0, skipped = 0;
  for (const w of WORKERS) {
    const exists = await Worker.findOne({ phone: w.phone });
    if (exists) {
      console.log(`  skip  ${w.name} (${w.phone}) — already exists`);
      skipped++;
      continue;
    }
    await Worker.create(w);
    console.log(`  ✔ added ${w.name} [${w.category}]`);
    added++;
  }

  console.log(`\nDone! Added: ${added}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
