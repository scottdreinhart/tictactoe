import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-transform-react-remove-prop-types',
            { removeImport: true },
          ],
        ],
      },
    }),
    visualizer({
      filename: 'dist/bundle-report.html',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],

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
