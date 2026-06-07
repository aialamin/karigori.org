# কারিগরি — Karigori

**Bangladesh's local service marketplace** — Find verified plumbers, electricians, cleaners, masons, ISP technicians, contractors, and more across Bangladesh. Fully bilingual (বাংলা + English), mobile-first PWA.

🌐 **Live:** [karigori.org](https://karigori.org) &nbsp;|&nbsp; **Repo:** [github.com/aialamin/karigori.org](https://github.com/aialamin/karigori.org)

---

## Features

### For Customers
- **Browse & Search** — Filter workers by category, area, availability, verification status, rating, price
- **11 Service Categories** — Plumber, Electrician, Cleaner, Bua, Painter, AC Mechanic, Carpenter, Gas Fitter, ISP/Internet, Mason (রাজমিস্ত্রি), Contractor
- **City Pages** — `/dhaka`, `/gazipur`, `/narayanganj`, `/chittagong`, `/sylhet`, `/rajshahi` — auto-shows only workers in that city
- **Worker Profiles** — Ratings, reviews, verified badge, contact button, report option
- **Price Guide** — Estimated price ranges per service category
- **Blog** — Service tips and guides
- **PWA** — Installable on Android/iOS, works offline

### For Service Providers (Workers)
- **Registration** — Select up to **3 trade categories** (primary + secondary)
- **Division → Zila → Upazila area picker** — Hierarchical checkbox tree with bulk select, search, and popular city quick-pills
- **Profile Dashboard** — Update bio, rates, availability, areas, upload photo
- **Document Upload** — NID front/back, selfie with NID (Level 2 verification)
- **Phone OTP Verification** — Level 1 badge after phone verify
- **Password Reset** — OTP-based forgot password flow

### Admin Panel (`/admin`)
- Worker approval / rejection with notes
- Flag / unflag workers
- Client list management
- Bulk CSV upload of workers
- Dynamic site config (extra categories, notice modal)
- Live stats dashboard

### Platform
- **Dynamic Stats** — Homepage stats (worker count, categories, areas, jobs) fetched live from DB with 60s cache
- **SEO** — Structured data, city-specific meta, sitemap, canonical URLs
- **JWT Auth** — 30-day tokens, role-based (worker / client / admin)
- **Image optimization** — Auto-converts uploads to WebP via Sharp

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, Vite 5, Tailwind CSS 3, PWA |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (jsonwebtoken) |
| File Uploads | Multer + Sharp (→ WebP) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
karigori/
├── client/                  React + Vite PWA frontend
│   ├── src/
│   │   ├── pages/           All route pages
│   │   │   ├── Home.jsx          Homepage with live stats
│   │   │   ├── Browse.jsx        Search/filter all workers
│   │   │   ├── CityPage.jsx      City-scoped worker pages
│   │   │   ├── WorkerProfile.jsx Worker detail page
│   │   │   ├── Register.jsx      Worker/client registration
│   │   │   ├── WorkerDashboard.jsx  Worker profile editor
│   │   │   ├── ClientDashboard.jsx  Client account
│   │   │   ├── AdminDashboard.jsx   Admin panel
│   │   │   ├── AllPages.jsx      Static info pages
│   │   │   ├── PriceGuide.jsx    Service pricing page
│   │   │   └── Blog.jsx / BlogPost.jsx
│   │   ├── components/      Reusable components
│   │   │   ├── ServiceAreaPicker.jsx  Division→Zila→Upazila picker
│   │   │   ├── CategoryIcon.jsx       Category icon mapping
│   │   │   ├── WorkerCard.jsx         Worker listing card
│   │   │   └── ...
│   │   ├── data/
│   │   │   ├── bangladesh.js     All 8 divisions, 64 districts, ~490 upazilas
│   │   │   ├── siteData.js       Service category data
│   │   │   └── categories.js     Category → subcategory tree
│   │   └── constants.js          CATEGORIES, BANGLADESH_LOCATIONS
│   └── public/
├── server/                  Express + Mongoose API
│   ├── models/
│   │   ├── Worker.js        Worker schema (categories[], areas[], verification)
│   │   ├── User.js          User schema (worker / client / admin)
│   │   └── Review.js        Review schema
│   ├── routes/
│   │   ├── auth.js          Register, login, OTP, password reset
│   │   ├── workers.js       Public worker listing + reviews
│   │   ├── profile.js       Worker/client profile update + file uploads
│   │   ├── admin.js         Admin moderation endpoints
│   │   ├── stats.js         Live platform stats (60s cache)
│   │   ├── config.js        Dynamic site config
│   │   ├── bulkupload.js    CSV bulk worker import
│   │   └── analytics.js     Usage analytics
│   ├── middleware/auth.js   JWT verify + role guard
│   ├── seed.js              Demo data seed
│   └── seed-new-services.js ISP / Rajmistri / Contractor sample data
├── render.yaml              Render backend deployment config
├── vercel.json              Vercel frontend build config
└── package.json             Root dev scripts
```

---

## Local Setup

### 1. Install dependencies

```bash
# Root (concurrent dev runner)
npm install

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Create `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/karigori
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Create `client/.env`

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run dev servers

```bash
npm run dev
```

- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000/api/health`

---

## Seed Data

```bash
cd server

# Core demo workers (all 8 original categories)
npm run seed

# New service workers (ISP, Rajmistri, Contractor)
node seed-new-services.js
```

**Admin login after seed:**
```
Email:    admin@karigori.com
Password: admin123
```

> ⚠️ Seed scripts clear existing workers/reviews. Use only on test/demo databases.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Health check |
| GET | `/api/stats` | — | Live platform stats (60s cache) |
| GET | `/api/workers` | — | List approved workers (filter: category, area, q, available, sort, page) |
| GET | `/api/workers/:id` | — | Worker profile |
| GET | `/api/workers/:id/reviews` | — | Worker reviews |
| POST | `/api/workers/:id/reviews` | — | Submit review |
| POST | `/api/workers/:id/report` | — | Report worker |
| POST | `/api/auth/register` | — | Register (worker or client) |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | JWT | Current user |
| POST | `/api/auth/send-otp` | JWT | Send phone OTP |
| POST | `/api/auth/verify-otp` | JWT | Verify phone OTP |
| POST | `/api/auth/forgot-password` | — | Send reset OTP |
| POST | `/api/auth/reset-password` | — | Reset password |
| GET | `/api/profile/worker` | JWT worker | Get own profile |
| PUT | `/api/profile/worker` | JWT worker | Update profile (bio, areas, categories, rate) |
| POST | `/api/profile/worker/photo` | JWT worker | Upload profile photo |
| POST | `/api/profile/worker/selfie` | JWT worker | Upload NID selfie |
| POST | `/api/profile/worker/documents` | JWT worker | Upload NID + certificates |
| PUT | `/api/profile/client` | JWT client | Update client profile |
| GET | `/api/admin/stats` | JWT admin | Admin dashboard stats |
| GET | `/api/admin/workers` | JWT admin | Worker moderation list |
| PUT | `/api/admin/workers/:id` | JWT admin | Approve/reject/flag worker |
| GET | `/api/admin/clients` | JWT admin | Client list |
| GET | `/api/config` | — | Dynamic site config |
| PUT | `/api/config` | JWT admin | Update site config |
| POST | `/api/bulkupload` | JWT admin | Bulk CSV worker import |

---

## Service Categories (11)

| Key | English | বাংলা | Icon |
|---|---|---|---|
| `plumber` | Plumber | প্লাম্বার | 🔧 |
| `electrician` | Electrician | ইলেক্ট্রিশিয়ান | ⚡ |
| `cleaner` | Cleaner | ক্লিনার | ✨ |
| `bua` | Bua / House Help | বুয়া | 🏠 |
| `painter` | Painter | পেইন্টার | 🖌️ |
| `ac_repair` | AC Mechanic | এসি মেকানিক | 🌬️ |
| `carpenter` | Carpenter | কাঠমিস্ত্রি | 🔨 |
| `gas_fitter` | Gas Fitter | গ্যাস ফিটার | 🔥 |
| `isp` | ISP / Internet | ইন্টারনেট সেবা | 📶 |
| `rajmistri` | Mason | রাজমিস্ত্রি | 👷 |
| `contractor` | Contractor | কন্ট্রাক্টর | 🏢 |

---

## City Pages

Each city page auto-fetches workers whose service areas include that city's upazilas. All category filters and search on city pages carry the city tag through to Browse.

| Route | City |
|---|---|
| `/dhaka` | ঢাকা |
| `/gazipur` | গাজীপুর |
| `/narayanganj` | নারায়ণগঞ্জ |
| `/chittagong` | চট্টগ্রাম |
| `/sylhet` | সিলেট |
| `/rajshahi` | রাজশাহী |

---

## Deployment

### Backend → Render

Set environment variables in Render dashboard:

```env
NODE_ENV=production
MONGO_URI=your-atlas-connection-string
JWT_SECRET=your-long-random-secret
CLIENT_URL=https://your-app.vercel.app
```

Build command: `npm install`
Start command: `npm start`

Health check: `https://your-service.onrender.com/api/health`

### Frontend → Vercel

Set environment variable in Vercel dashboard:

```env
VITE_API_URL=https://your-service.onrender.com
```

After deploying frontend, update Render's `CLIENT_URL` to your Vercel URL and redeploy backend.

---

## Security

- Never commit `server/.env`, `client/.env`, or any credentials
- `server/uploads/` is git-ignored — never commit user documents
- Rotate any DB password that has been shared or exposed
- `JWT_SECRET` and `MONGO_URI` must only live in Render environment variables in production

---

## Worker Verification Levels

| Level | Badge | Requirement |
|---|---|---|
| 0 | Pending | Registered, awaiting admin review |
| 1 | ✓ Verified | Phone OTP verified + admin approved |
| 2 | ✓✓ ID Verified | Selfie with NID uploaded + admin approved |

---

*Built with ❤️ for Bangladesh — কারিগরিকে বিশ্বাস করুন*
