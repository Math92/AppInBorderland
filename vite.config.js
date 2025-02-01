// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // Esto permite que Firebase sea incluido en el bundle
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/database'] // Incluye los módulos de Firebase
  }
});