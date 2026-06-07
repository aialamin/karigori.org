import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import workerRoutes  from './routes/workers.js';
import authRoutes    from './routes/auth.js';
import adminRoutes   from './routes/admin.js';
import profileRoutes   from './routes/profile.js';
import configRoutes    from './routes/config.js';
import analyticsRoutes from './routes/analytics.js';
import bulkRoutes      from './routes/bulkupload.js';
import statsRoutes     from './routes/stats.js';
import blogRoutes      from './routes/blog.js';
import adminBlogRoutes from './routes/adminBlog.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = parseInt(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname === 'karigori-org.vercel.app' || hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
const corsOptions = {
  origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Security headers ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options',    'nosniff');
  res.setHeader('X-Frame-Options',           'DENY');
  res.setHeader('X-XSS-Protection',          '1; mode=block');
  res.setHeader('Referrer-Policy',           'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy',        'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
});

// ── Gzip all responses (20-70% size reduction on JSON/HTML) ──
app.use(compression({ level: 6, threshold: 1024 }));

app.use(express.json({ limit: '10mb' }));

// ── Static uploads with long-term browser cache ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '30d',
  immutable: false,
  etag: true,
  lastModified: true,
}));

app.use('/api/workers',  workerRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/profile',  profileRoutes);
app.use('/api/config',     configRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bulk',      bulkRoutes);
app.use('/api/stats',      statsRoutes);
app.use('/api/blogs',      blogRoutes);
app.use('/api/admin/blogs', adminBlogRoutes);
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ── API cache hints (CDN / browser) ──
app.use('/api/workers', (req, res, next) => {
  if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');
  next();
});
app.use('/api/config', (req, res, next) => {
  if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=300');
  next();
});

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/karigori')
  .then(() => {
    console.log('✅ MongoDB connected');
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
    server.keepAliveTimeout = 65000;  // keep TCP alive longer than ALB's 60s
    server.headersTimeout   = 66000;
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌  Port ${PORT} is already in use.`);
        console.error(`   Fix: close the other server, or run:\n`);
        console.error(`       npx kill-port ${PORT}\n`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });
