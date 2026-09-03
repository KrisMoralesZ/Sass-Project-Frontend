/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const coverageExclude = [
  // Story/spec files are not source under test. Running them still
  // counts coverage on the components they render (e.g. Button/index.tsx).
  'src/**/*.stories.tsx',
  'src/**/*.test.{ts,tsx}',
  'src/**/*.spec.{ts,tsx}',
  'src/**/*.d.ts',
  'src/**/*.sc.tsx',
  'src/main.tsx',
  'src/types/**',
] as const

function coverageProject(): 'unit' | 'storybook' | undefined {
  const eq = process.argv.find((arg) => arg.startsWith('--project='))
  if (eq) {
    const name = eq.slice('--project='.length)
    if (name === 'unit' || name === 'storybook') {
      return name
    }
  }

  const flagIndex = process.argv.indexOf('--project')
  if (flagIndex !== -1) {
    const name = process.argv[flagIndex + 1]
    if (name === 'unit' || name === 'storybook') {
      return name
    }
  }

  return undefined
}

const UNIT_COVERAGE_THRESHOLD = 70
const STORYBOOK_COVERAGE_THRESHOLD = 80

const coverageProjectName = coverageProject()

const coverage =
  coverageProjectName === 'storybook'
    ? {
        provider: 'v8' as const,
        reporter: ['text', 'json-summary', 'html'] as const,
        reportsDirectory: './coverage/storybook',
        include: ['src/components/**/*.{ts,tsx}', 'src/styles/**/*.{ts,tsx}'],
        exclude: [...coverageExclude],
        thresholds: {
          statements: STORYBOOK_COVERAGE_THRESHOLD,
          branches: STORYBOOK_COVERAGE_THRESHOLD,
          functions: STORYBOOK_COVERAGE_THRESHOLD,
          lines: STORYBOOK_COVERAGE_THRESHOLD,
        },
      }
    : {
        provider: 'v8' as const,
        reporter: ['text', 'json-summary', 'html'] as const,
        reportsDirectory:
          coverageProjectName === 'unit' ? './coverage/unit' : './coverage',
        include: [
          'src/lib/**/*.{ts,tsx}',
          'src/features/**/*.{ts,tsx}',
          'src/routes/**/*.{ts,tsx}',
          'src/App.tsx',
        ],
        exclude: [...coverageExclude],
        thresholds: {
          statements: UNIT_COVERAGE_THRESHOLD,
          branches: UNIT_COVERAGE_THRESHOLD,
          functions: UNIT_COVERAGE_THRESHOLD,
          lines: UNIT_COVERAGE_THRESHOLD,
        },
      }

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
    passWithNoTests: true,
    coverage,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          environment: 'node',
          passWithNoTests: true,
        },
      },
      {
        extends: true,
        plugins: [
          // https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
            // Starts Storybook in the background during watch mode for debugging.
            storybookScript: 'npm run storybook -- --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          setupFiles: [path.join(__dirname, '.storybook/vitest.setup.ts')],
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
