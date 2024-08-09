import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { coverageConfigDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    coverage: {
      exclude: ['db/**', 'routes/**', '**/entry-client.tsx', '**/entry-server.tsx', '**/appTypes.ts', '**/api.ts', '**/server.js', '**/mocks/**', ...coverageConfigDefaults.exclude],
    }
  }
});
