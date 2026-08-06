import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { execSync } from 'child_process'

const base = ''

// For testing purpose, we can use a specific date as: "2024-01-15T10:30:00.000Z"
const buildDate = new Date().toISOString()

function getCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

const commitHash = getCommitHash()

// https://vite.dev/config/
export default defineConfig({
  plugins: [mdx(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    // Inject build date and commit hash at build time
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash)
  },
  base: base,
  build: {
    outDir: 'upload/demo',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) return 'react'
          if (id.includes('/node_modules/chart.js/')) return 'chartjs'
          if (id.includes('/node_modules/@tanstack/react-router/')) return 'router'
        }
      }
    }
  }
})
