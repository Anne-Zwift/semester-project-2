import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/',
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/tests/**'],
  },
});
