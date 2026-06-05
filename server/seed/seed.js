import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import Worker from '../models/Worker.js';
import User   from '../models/User.js';
import Review from '../models/Review.js';

const dhakaAreas = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Mohammadpur',
  'Uttara', 'Bashundhara', 'Wari', 'Khilgaon', 'Rampura',
  'Badda', 'Motijheel', 'Tejgaon', 'Shyamoli', 'Azimpur',
];

const workers = [
  // Plumbers
  {
    name: 'Md. Rafiqul Islam',
    phone: '01711-234567',
    category: 'plumber',
    areas: ['Dhanmondi', 'Mohammadpur', 'Shyamoli'],
    rating: 4.8,
    reviewCount: 47,
    experience: 12,
    bio: 'Expert in pipe fitting, water line repair, bathroom installation. Available 24/7 for emergencies.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiq&backgroundColor=b6e3f4',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 400,
  },
  {
    name: 'Karim Mia',
    phone: '01812-345678',
    category: 'plumber',
    areas: ['Mirpur', 'Kafrul', 'Pallabi'],
    rating: 4.5,
    reviewCount: 31,
    experience: 8,
    bio: 'Specializes in overhead tank cleaning, pump installation, and drainage repair.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim&backgroundColor=ffdfbf',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 350,
  },
  {
    name: 'Jahangir Alam',
    phone: '01913-456789',
    category: 'plumber',
    areas: ['Gulshan', 'Banani', 'Baridhara'],
    rating: 4.6,
    reviewCount: 22,
    experience: 6,
    bio: 'Gas pipe fitting and water supply specialist. Works in premium areas.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jahangir&backgroundColor=c0aede',
    verified: false,
    languages: ['Bengali', 'English'],
    hourlyRate: 500,
  },
  // Electricians
  {
    name: 'Md. Sirajul Hoque',
    phone: '01711-987654',
    category: 'electrician',
    areas: ['Uttara', 'Turag', 'Nikunja'],
    rating: 4.9,
    reviewCount: 63,
    experience: 15,
    bio: 'Licensed electrician. Wiring, DB board, AC installation, generator setup.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sirajul&backgroundColor=d1d4f9',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 500,
  },
  {
    name: 'Emon Hossain',
    phone: '01612-111222',
    category: 'electrician',
    areas: ['Bashundhara', 'Badda', 'Rampura'],
    rating: 4.4,
    reviewCount: 19,
    experience: 5,
    bio: 'Home wiring, fan & light fitting, socket repair. Fast response time.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emon&backgroundColor=ffd5dc',
    verified: false,
    languages: ['Bengali'],
    hourlyRate: 380,
  },
  {
    name: 'Abdul Mannan',
    phone: '01917-223344',
    category: 'electrician',
    areas: ['Dhanmondi', 'Azimpur', 'Lalbagh'],
    rating: 4.7,
    reviewCount: 38,
    experience: 10,
    bio: 'Electrical safety audit, CCTV installation, UPS & IPS setup.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mannan&backgroundColor=b6e3f4',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 450,
  },
  // Cleaners
  {
    name: 'Rokeya Begum',
    phone: '01812-556677',
    category: 'cleaner',
    areas: ['Gulshan', 'Banani', 'Baridhara', 'Niketan'],
    rating: 4.9,
    reviewCount: 84,
    experience: 9,
    bio: 'Deep cleaning expert. Post-construction cleaning, move-in/move-out, sofa & carpet cleaning.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rokeya&backgroundColor=ffdfbf',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 300,
  },
  {
    name: 'Shapla Akter',
    phone: '01711-667788',
    category: 'cleaner',
    areas: ['Dhanmondi', 'Mohammadpur', 'Shyamoli'],
    rating: 4.6,
    reviewCount: 41,
    experience: 4,
    bio: 'Regular home cleaning, kitchen deep clean, bathroom sanitization.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shapla&backgroundColor=c0aede',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 250,
  },
  {
    name: 'Nasrin Khanam',
    phone: '01916-778899',
    category: 'cleaner',
    areas: ['Uttara', 'Sector 3', 'Sector 7', 'Sector 10'],
    rating: 4.3,
    reviewCount: 17,
    experience: 3,
    bio: 'Office cleaning, apartment cleaning. Available on weekdays.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin&backgroundColor=ffd5dc',
    verified: false,
    languages: ['Bengali'],
    hourlyRate: 220,
  },
  // Bua (Domestic helpers)
  {
    name: 'Fatema Khatun',
    phone: '01812-889900',
    category: 'bua',
    areas: ['Dhanmondi', 'Kalabagan', 'Elephant Road'],
    rating: 4.8,
    reviewCount: 56,
    experience: 11,
    bio: 'Cook, childcare, household chores. Experienced with babies and elderly care.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema&backgroundColor=b6e3f4',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 200,
  },
  {
    name: 'Rehana Parvin',
    phone: '01711-990011',
    category: 'bua',
    areas: ['Mirpur', 'Pallabi', 'Rupnagar'],
    rating: 4.5,
    reviewCount: 29,
    experience: 7,
    bio: 'Full-time or part-time domestic help. Cooking, cleaning, grocery management.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rehana&backgroundColor=d1d4f9',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 180,
  },
  {
    name: 'Saleha Begum',
    phone: '01617-001122',
    category: 'bua',
    areas: ['Gulshan', 'Banani', 'Mohakhali'],
    rating: 4.7,
    reviewCount: 43,
    experience: 13,
    bio: 'Experienced with expat families. Cooking, childcare, laundry. References available.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Saleha&backgroundColor=ffdfbf',
    verified: true,
    languages: ['Bengali', 'English'],
    hourlyRate: 250,
  },
  // Painters
  {
    name: 'Md. Shafiq Painter',
    phone: '01812-112233',
    category: 'painter',
    areas: ['Tejgaon', 'Farmgate', 'Karwan Bazar'],
    rating: 4.6,
    reviewCount: 35,
    experience: 14,
    bio: 'Interior & exterior painting, texture finish, waterproofing, putty work.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shafiq&backgroundColor=c0aede',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 600,
  },
  {
    name: 'Babul Mia',
    phone: '01711-223344',
    category: 'painter',
    areas: ['Wari', 'Sutrapur', 'Kotwali'],
    rating: 4.2,
    reviewCount: 14,
    experience: 6,
    bio: 'Apartment painting, quick turnaround, own tools and materials available.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Babul&backgroundColor=b6e3f4',
    verified: false,
    languages: ['Bengali'],
    hourlyRate: 500,
  },
  // AC Repair
  {
    name: 'Md. Nazmul AC Service',
    phone: '01916-334455',
    category: 'ac_repair',
    areas: ['Dhanmondi', 'Mohammadpur', 'Rayer Bazar'],
    rating: 4.9,
    reviewCount: 91,
    experience: 10,
    bio: 'All brands AC service — Samsung, Gree, General, Midea. Cleaning, gas refill, repair.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nazmul&backgroundColor=ffd5dc',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 800,
  },
  {
    name: 'Rubel AC Technician',
    phone: '01812-445566',
    category: 'ac_repair',
    areas: ['Uttara', 'Sector 4', 'Sector 6', 'Sector 11'],
    rating: 4.7,
    reviewCount: 52,
    experience: 8,
    bio: 'Split AC, window AC, cassette AC. Annual maintenance contract available.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rubel&backgroundColor=d1d4f9',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 750,
  },
  // Carpenter
  {
    name: 'Hasan Carpenter',
    phone: '01711-556677',
    category: 'carpenter',
    areas: ['Khilgaon', 'Rampura', 'Badda'],
    rating: 4.5,
    reviewCount: 28,
    experience: 16,
    bio: 'Furniture repair, custom cabinet, door & window fitting. Experienced in solid wood work.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hasan&backgroundColor=ffdfbf',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 600,
  },
  {
    name: 'Delwar Mistri',
    phone: '01617-667788',
    category: 'carpenter',
    areas: ['Mirpur', 'Senpara', 'Matikata'],
    rating: 4.3,
    reviewCount: 21,
    experience: 9,
    bio: 'Interior fit-out, modular kitchen, wardrobe design and installation.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Delwar&backgroundColor=c0aede',
    verified: false,
    languages: ['Bengali'],
    hourlyRate: 550,
  },
  // Gas fitter
  {
    name: 'Titas Gas Fitter — Rahim',
    phone: '01916-778900',
    category: 'gas_fitter',
    areas: ['Gulshan', 'Banani', 'Baridhara', 'Bashundhara'],
    rating: 4.8,
    reviewCount: 39,
    experience: 12,
    bio: 'Gas pipe fitting, stove connection, leak detection, Titas line compliance. Safety certified.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim&backgroundColor=b6e3f4',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 600,
  },
  {
    name: 'Faruk Gas Service',
    phone: '01812-789001',
    category: 'gas_fitter',
    areas: ['Dhanmondi', 'Hazaribagh', 'Jigatola'],
    rating: 4.4,
    reviewCount: 16,
    experience: 7,
    bio: 'Cylinder gas and line gas fitting. Stove repair and burner cleaning.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faruk&backgroundColor=ffdfbf',
    verified: false,
    languages: ['Bengali'],
    hourlyRate: 500,
  },
  // Extra variety
  {
    name: 'Md. Rakib Electrician',
    phone: '01711-890012',
    category: 'electrician',
    areas: ['Bashundhara', 'Aftabnagar', 'Baridhara DOHS'],
    rating: 4.6,
    reviewCount: 33,
    experience: 7,
    bio: 'Home automation, smart switch installation, solar panel wiring.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rakib&backgroundColor=d1d4f9',
    verified: true,
    languages: ['Bengali', 'English'],
    hourlyRate: 550,
  },
  {
    name: 'Momena Apa (Bua)',
    phone: '01617-901123',
    category: 'bua',
    areas: ['Bashundhara', 'Baridhara', 'Vatara'],
    rating: 4.9,
    reviewCount: 71,
    experience: 15,
    bio: 'Most trusted bua in Bashundhara area. Cooking, cleaning, elderly & baby care.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Momena&backgroundColor=ffd5dc',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 220,
  },
  {
    name: 'Sumon Plumber',
    phone: '01812-012234',
    category: 'plumber',
    areas: ['Tejgaon', 'Nakhalpara', 'Eskaton'],
    rating: 4.3,
    reviewCount: 18,
    experience: 5,
    bio: 'Water pump repair, pipe leakage fix, bathroom fitting. Fast same-day service.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sumon&backgroundColor=c0aede',
    verified: false,
    languages: ['Bengali'],
    hourlyRate: 320,
  },
  {
    name: 'Liton AC & Fridge Repair',
    phone: '01711-123445',
    category: 'ac_repair',
    areas: ['Mirpur', 'Kazipara', 'Shewrapara'],
    rating: 4.5,
    reviewCount: 44,
    experience: 11,
    bio: 'AC and refrigerator repair. Gas refilling, compressor replacement, PCB repair.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liton&backgroundColor=b6e3f4',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 700,
  },
  // Extra high-rated workers for demo richness
  {
    name: 'Arif Master Electrician',
    phone: '01812-543210',
    category: 'electrician',
    areas: ['Gulshan', 'Baridhara', 'Niketan', 'DOHS Mohakhali'],
    rating: 5.0,
    reviewCount: 112,
    experience: 20,
    bio: 'Master electrician with 20 years of experience. Specializes in commercial wiring, DB panel upgrade, generator installation and smart home automation.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arif&backgroundColor=a0c4ff',
    verified: true,
    languages: ['Bengali', 'English', 'Hindi'],
    hourlyRate: 700,
  },
  {
    name: 'Nargis Deep Cleaning',
    phone: '01917-654321',
    category: 'cleaner',
    areas: ['Uttara', 'Sector 1', 'Sector 3', 'Sector 7', 'Sector 10', 'Sector 13'],
    rating: 4.9,
    reviewCount: 98,
    experience: 7,
    bio: 'Professional deep cleaning team leader. Post-construction, move-in/move-out, sofa & mattress cleaning with industrial-grade equipment.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nargis&backgroundColor=ffc8dd',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 350,
  },
  {
    name: 'Shaheen Carpenter Works',
    phone: '01711-000111',
    category: 'carpenter',
    areas: ['Dhanmondi', 'Lalmatia', 'Mohammadpur', 'Shyamoli', 'Adabor'],
    rating: 4.8,
    reviewCount: 67,
    experience: 18,
    bio: 'Custom furniture design and fabrication. Bedroom sets, modular kitchens, office furniture, and renovation work. Uses quality hardwood and MDF.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shaheen&backgroundColor=caffbf',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 650,
  },
  {
    name: 'Razia Begum (Full-time Bua)',
    phone: '01617-111222',
    category: 'bua',
    areas: ['Uttara', 'Sector 4', 'Sector 6', 'Sector 9', 'Sector 12'],
    rating: 4.9,
    reviewCount: 88,
    experience: 14,
    bio: 'Highly recommended full-time domestic helper. Cooking Bangladeshi & continental dishes, childcare, laundry, and elderly care. Long-term placements preferred.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Razia&backgroundColor=fdffb6',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 230,
  },
  {
    name: 'Anwar Gas & Plumbing',
    phone: '01812-222333',
    category: 'gas_fitter',
    areas: ['Mirpur', 'Pallabi', 'Matikata', 'Kafrul', 'Senpara'],
    rating: 4.6,
    reviewCount: 35,
    experience: 9,
    bio: 'Combined gas fitting and plumbing service. Gas line installation, stove repair, water line fitting, and bathroom renovation.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anwar&backgroundColor=bde0fe',
    verified: true,
    languages: ['Bengali'],
    hourlyRate: 550,
  },
  {
    name: 'Korim Decor Painter',
    phone: '01916-333444',
    category: 'painter',
    areas: ['Bashundhara', 'Aftabnagar', 'Baridhara', 'Vatara', 'Khilkhet'],
    rating: 4.7,
    reviewCount: 49,
    experience: 11,
    bio: 'Premium interior decorator and painter. Texture painting, epoxy flooring, wallpaper installation, and false ceiling paint work.',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Korim&backgroundColor=e9c46a',
    verified: true,
    languages: ['Bengali', 'English'],
    hourlyRate: 700,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/karigori');
    console.log('✅ Connected to MongoDB');

    await Worker.deleteMany({});
    console.log('🗑️  Cleared existing workers');

    // Mark all demo workers as approved with realistic verification levels
    const approvedWorkers = workers.map((w, i) => ({
      ...w,
      status: 'approved',
      verified: w.verified ?? false,
      verificationLevel: w.verified ? (i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2) : 2,
      otpVerified: true,
    }));
    const inserted = await Worker.insertMany(approvedWorkers);
    console.log(`✅ Seeded ${inserted.length} workers`);

    // Seed reviews for first 10 workers
    await Review.deleteMany({});
    const reviewTemplates = [
      { rating: 5, comment: 'অসাধারণ কাজ করেছেন। সময়মতো এসেছেন এবং খুব পরিষ্কারভাবে কাজ শেষ করেছেন। আবার ডাকবো।' },
      { rating: 5, comment: 'Very professional and skilled. Fixed the issue quickly. Highly recommended!' },
      { rating: 4, comment: 'Good work overall. Came on time and finished the job. Will hire again.' },
      { rating: 5, comment: 'দারুণ সার্ভিস। দাম যুক্তিসঙ্গত এবং কাজ চমৎকার।' },
      { rating: 4, comment: 'Knowledgeable professional. Explained the problem clearly before fixing it.' },
      { rating: 3, comment: 'Decent work but took a bit longer than expected. Final result was good.' },
      { rating: 5, comment: 'Excellent! Very friendly and skilled. The best in our area.' },
      { rating: 4, comment: 'সততার সাথে কাজ করেছেন। কোনো বাড়তি টাকা নেননি।' },
      { rating: 5, comment: 'Superb service! Fixed the problem permanently. No issues since then.' },
      { rating: 4, comment: 'Good professional. Responsive on WhatsApp. Will hire again for sure.' },
      { rating: 5, comment: 'ভালো কাজ। পরিষ্কার পরিচ্ছন্ন থেকে কাজ করলেন। ধন্যবাদ।' },
      { rating: 3, comment: 'Average experience. Work was done but communication could be better.' },
    ];
    const reviewerNames = [
      'Rahim Ahmed', 'Fatema Khanom', 'Kamal Hossain', 'Sumaiya Islam',
      'Jahed Khan', 'Nusrat Jahan', 'Arman Hoque', 'Taslima Begum',
      'Mizanur Rahman', 'Shirin Akter', 'Abul Bashar', 'Roksana Parvin',
    ];
    const reviewDocs = [];
    for (let i = 0; i < Math.min(10, inserted.length); i++) {
      const numReviews = 3 + (i % 4); // 3-6 reviews per worker
      for (let j = 0; j < numReviews; j++) {
        const t = reviewTemplates[(i + j) % reviewTemplates.length];
        reviewDocs.push({
          workerId:      inserted[i]._id,
          reviewerName:  reviewerNames[(i + j) % reviewerNames.length],
          reviewerEmail: '',
          rating:        t.rating,
          comment:       t.comment,
          createdAt:     new Date(Date.now() - (j * 7 + i) * 24 * 60 * 60 * 1000),
        });
      }
    }
    await Review.insertMany(reviewDocs);
    console.log(`✅ Seeded ${reviewDocs.length} reviews`);

    // Create admin user (upsert)
    await User.deleteMany({ role: 'admin' });
    const admin = new User({ name: 'Karigori Admin', email: 'admin@karigori.com', password: 'admin123', role: 'admin', phone: '01700000000' });
    await admin.save();
    console.log('✅ Admin user created → admin@karigori.com / admin123');

    await mongoose.disconnect();
    console.log('👋 Disconnected. Done!');
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
