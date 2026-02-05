import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './vitest.setup.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.{js,vue}'],
        exclude: ['src/main.js', 'src/**/*.spec.js'],
        thresholds: {
          statements: 70,
          branches: 65,
          functions: 70,
          lines: 70,
        },
      },
    },
  }),
);
