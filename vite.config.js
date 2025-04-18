import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  root: 'public', // ← use 'public' as the root
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {

  },
  server: {
    port: 5175, // or your desired port
  },
  build: {
    outDir: '../dist', // optional: put dist outside public
    emptyOutDir: true,
  },
})
