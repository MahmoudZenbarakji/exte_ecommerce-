import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    })
  ],
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep ALL React-related packages together to prevent multiple React instances
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/@tanstack/react-query') || 
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/react-error-boundary') ||
              id.includes('node_modules/lucide-react')) {
            return 'vendor-react'
          }
          // Separate UI libraries
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui'
          }
          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor-misc'
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'lucide-react',
      'react/jsx-runtime'
    ],
    exclude: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})
