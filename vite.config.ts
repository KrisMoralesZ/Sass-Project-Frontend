/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  // Vite 8 / Oxc transform for styled-components (display names + CSS minify).
  // Replaces babel-plugin-styled-components for this toolchain.
  oxc: {
    plugins: {
      styledComponents: {
        displayName: true,
        fileName: true,
        minify: true,
        // SPA only — no SSR stylesheet extraction needed.
        ssr: false,
      },
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
