import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Bluewud OTS',
        short_name: 'BW-OTS',
        description: 'Bluewud Order Tracking System',
        theme_color: '#0f172a',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    visualizer({
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
      open: false, // Don't auto-open
    }),
  ],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core Vendor
          'vendor-core': ['react', 'react-dom'],
          'vendor-utils': ['crypto-js', 'papaparse', 'jspdf', 'html5-qrcode'],
          'vendor-ui': ['lucide-react', 'recharts'],

          // Feature Splits (Grouping related modules)
          'feature-commercial': [
            './src/components/Commercial/FinancialCenter.jsx',
            './src/components/Commercial/GlobalLedger.jsx',
            './src/components/Commercial/MarginGuard.jsx',
            './src/components/Commercial/InvoiceGenerator.jsx',
          ],
          'feature-logistics': [
            './src/components/Logistics/CarrierSelection.jsx',
            './src/components/Logistics/InternationalShipping.jsx',
            './src/components/Logistics/ZoneMap.jsx',
          ],
          'feature-inventory': [
            './src/components/Commercial/SKUMaster.jsx',
            './src/components/Inventory/StockOptix.jsx',
            './src/components/Warehouse/WarehouseManager.jsx',
          ],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: 'esbuild',
    // Source maps for production debugging (optional)
    sourcemap: false,
    // Target modern browsers
    target: 'es2020',
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'lucide-react'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
  },
})
