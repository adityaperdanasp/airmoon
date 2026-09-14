import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Separate from vite.config.js (2026-09-14) — kept apart rather than
// merging a `test` key into the production build config, so nothing
// about the actual app bundle risks changing just from adding tests.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
