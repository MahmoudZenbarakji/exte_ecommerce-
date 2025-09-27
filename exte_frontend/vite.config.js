import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
    }
  },
  build: {
    // Bundle optimization
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query'
            }
            if (id.includes('axios')) {
              return 'vendor-http'
            }
            if (id.includes('@radix-ui') || id.includes('@headlessui')) {
              return 'vendor-ui'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            return 'vendor-misc'
          }
          
          // Feature chunks
          if (id.includes('src/dashboard')) {
            return 'dashboard'
          }
          if (id.includes('src/components') && id.includes('Product')) {
            return 'products'
          }
          if (id.includes('src/components') && id.includes('Cart')) {
            return 'cart'
          }
          if (id.includes('src/components') && id.includes('Checkout')) {
            return 'checkout'
          }
        },
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const name = facadeModuleId.split('/').pop().replace('.jsx', '').replace('.js', '')
            return `assets/${name}-[hash].js`
          }
          return 'assets/[name]-[hash].js'
        },
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Minify for production
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers
    target: 'esnext',
    // Enable tree shaking
    treeshake: true,
  },
  // Development server optimization
  server: {
    hmr: {
      overlay: false
    },
    // Enable compression
    middlewareMode: false,
  },
  // CSS optimization
  css: {
    devSourcemap: true,
    // Enable CSS modules if needed
    modules: {
      localsConvention: 'camelCase'
    }
  },
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@tanstack/react-query',
      'react-window',
      'react-window-infinite-loader'
    ],
    // Exclude from pre-bundling
    exclude: ['@tanstack/react-query-devtools']
  },
  // Define environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    // Make environment variables available to the app
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'import.meta.env.VITE_APP_NAME': JSON.stringify(process.env.VITE_APP_NAME),
    'import.meta.env.VITE_NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  // Enable experimental features
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    }
  }
})
