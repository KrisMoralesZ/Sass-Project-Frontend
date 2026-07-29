import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
})
