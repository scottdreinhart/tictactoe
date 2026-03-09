import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  // Use relative paths so Electron can load dist/ via file:// protocol
  base: './',
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/domain': path.resolve(__dirname, 'src/domain'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/ui': path.resolve(__dirname, 'src/ui'),
    },
  },

  // ── Build optimizations ──────────────────────────────────────────────────
  build: {
    // Target modern browsers — skip legacy polyfills
    target: 'es2020',
    cssTarget: 'es2020',

    // Modern browsers handle module preload natively — skip the polyfill (~1 KB)
    modulePreload: { polyfill: false },

    // esbuild minification tweaks
    minify: 'esbuild',
    cssMinify: true,

    // Split React/ReactDOM into a vendor chunk for long-term caching
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      // WSL2: the dev server binds inside WSL but the browser
      // connects from Windows via localhost, so point HMR there.
      host: 'localhost',
      port: 5173,
    },
  },
})
