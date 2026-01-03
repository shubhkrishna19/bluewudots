import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-charts': ['recharts'],
          // Feature chunks
          'feature-commercial': [
            './src/components/Commercial/FinancialCenter.jsx',
            './src/components/Commercial/GlobalLedger.jsx',
            './src/components/Commercial/MarginGuard.jsx'
          ],
          'feature-logistics': [
            './src/components/Logistics/CarrierSelection.jsx',
            './src/components/Logistics/InternationalShipping.jsx'
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Enable minification
    minify: 'esbuild',
    // Source maps for production debugging (optional)
    sourcemap: false,
    // Target modern browsers
    target: 'es2020'
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts']
  }
})
