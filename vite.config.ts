import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

const base = ""

// For testing purpose, we can use a specific date as: "2024-01-15T10:30:00.000Z"
const buildDate = new Date().toISOString()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    // Inject build date at build time
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(buildDate)
  },
  base: base,
  build: {
    outDir: "upload/demo",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          chartjs: ["chart.js"],
          router: ["@tanstack/react-router"]
        }
      }
    }
  }
})
