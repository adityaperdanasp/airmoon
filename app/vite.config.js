import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Firebase (auth+firestore+messaging) is most of the remaining
        // ~800KB main chunk after route-level code splitting (App.jsx) —
        // it barely changes between deploys, while app code changes on
        // every one. Splitting it into its own chunk means a returning
        // visitor's browser can keep serving Firebase from cache across
        // app updates instead of re-downloading it every time alongside
        // whatever page code actually changed.
        manualChunks(id) {
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase';
          }
        },
      },
    },
  },
})
