import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { compression } from 'vite-plugin-compression2';

export default defineConfig(({ mode }) => ({
  // Drop console.* and debugger in production builds only
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },

  plugins: [
    react({
      // Babel fast-refresh only in dev; no overhead in prod
      babel: { plugins: [] },
    }),

    // ── Brotli + Gzip pre-compressed assets ──
    // Nginx/Caddy/Vercel will serve .br / .gz automatically
    compression({ algorithm: 'brotliCompress', exclude: [/\.(png|jpg|webp|ico|woff2)$/] }),
    compression({ algorithm: 'gzip',           exclude: [/\.(png|jpg|webp|ico|woff2)$/] }),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Skip waiting so new SW activates instantly
        skipWaiting: true,
        clientsClaim: true,
        // Purge old precache on SW update — prevents stale chunk 404s after redeploy
        cleanupOutdatedCaches: true,
        // Inline small assets into the SW precache list
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/api\/workers(\?.*)?$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-workers',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 6 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/api\/config.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-config',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/api\/workers\/[a-z0-9]+$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-worker-profiles',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 2 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/uploads\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'worker-images',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'avatars',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'কারিগরি — বাংলাদেশের #১ সার্ভিস প্ল্যাটফর্ম',
        short_name: 'কারিগরি',
        description: 'যাচাইকৃত প্লাম্বার, ইলেক্ট্রিশিয়ান, ক্লিনার — সরাসরি যোগাযোগ',
        theme_color: '#006A4E',
        background_color: '#F8FAFC',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],

  server: {
    port: 3000,
    proxy: {
      '/api':     { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },

  build: {
    // Modern targets — smaller output, no legacy polyfills
    target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
    // Don't report compressed sizes (faster build output)
    reportCompressedSize: false,
    // Raise chunk warning threshold — we split manually below
    chunkSizeWarningLimit: 600,
    cssMinify: true,
    minify: 'esbuild', // esbuild is 20-40x faster than terser with near-identical output

    rollupOptions: {
      output: {
        // Fine-grained manual chunks — each loads/caches independently
        manualChunks(id) {
          // React core — tiny, changes rarely → long cache
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'react-core';
          }
          // Router — changes rarely
          if (id.includes('node_modules/react-router')) return 'react-router';
          // Helmet (SEO) — changes rarely
          if (id.includes('node_modules/react-helmet-async')) return 'helmet';
          // Lucide icons — large but stable
          if (id.includes('node_modules/lucide-react')) return 'lucide';
          // xlsx — only used in admin, lazy-load separately
          if (id.includes('node_modules/xlsx')) return 'xlsx';
          // Workbox (SW) — already in its own chunk by PWA plugin
        },
        // Deterministic file names for long-term caching
        entryFileNames:  'assets/[name]-[hash].js',
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      },
    },
  },
}));
