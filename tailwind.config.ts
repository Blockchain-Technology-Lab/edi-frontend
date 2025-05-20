import type { Config } from "tailwindcss"

const { heroui } = require("@heroui/react")

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    colors: {
      aqua: {
        400: "#31d2f2",
        500: "#0dcaf0"
      },
      black: "#000",
      blue: {
        400: "#8bb9fe",
        500: "#6ea8fe",
        700: "#0d6efd",
        800: "#0a58ca"
      },
      current: "currentColor",
      danger: {
        100: "#f8d7da",
        200: "#f5c6cb",
        800: "#721c24"
      },
      slate: {
        200: "#dee2e6",
        300: "#ced4da",
        800: "#212529"
      },
      transparent: "transparent",
      white: "#fff",
      gray: {
        50: "#f9fafb", // Very Light Gray
        100: "#f3f4f6", // Light Gray
        200: "#e5e7eb", // Lighter Gray
        300: "#d1d5db", // Light Medium Gray
        400: "#9ca3af", // Medium Gray
        500: "#6b7280", // Neutral Gray
        600: "#4b5563", // Darker Gray
        700: "#374151", // Very Dark Gray
        800: "#1f2937", // Almost Black
        900: "#111827" // Near Black
      }
    },
    // Same as bootstrap system fonts
    fontFamily: {
      sans: [
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "Liberation Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji"
      ],
      mono: [
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace"
      ]
    },
    screens: {
      phablet: "640px", // => @media (min-width: 640px) { ... }
      tablet: "768px", // => @media (min-width: 768px) { ... }
      laptop: "1024px", // => @media (min-width: 1024px) { ... }
      desktop: "1280px" // => @media (min-width: 1280px) { ... }
    },
    extend: {}
  },
  plugins: [heroui(), require("flowbite/plugin")]
  //plugins: []
}
export default config
