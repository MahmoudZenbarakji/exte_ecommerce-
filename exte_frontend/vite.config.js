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
    minify: false, // Disable minification to test if it's causing the issue
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep React and React-DOM together to prevent Children error
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          // Keep React Router with React
          if (id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          // Separate UI libraries
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui'
          }
          // Keep other React-related packages with main React chunk
          if (id.includes('node_modules/@tanstack/react-query') || 
              id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/react-error-boundary')) {
            return 'vendor-react'
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
    include: ['react', 'react-dom', 'react-router-dom','lucide-react'],
    exclude: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
  }
})
