import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          // Use uma abordagem baseada em mode em vez de import.meta.env.PROD
          target: isProduction 
            ? 'https://yourdomain.com' 
            : 'http://localhost:8000',
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  }
})
