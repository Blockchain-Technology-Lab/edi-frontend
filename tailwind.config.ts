import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
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
      slate: {
        200: "#dee2e6",
        300: "#ced4da",
        800: "#212529"
      },
      transparent: "transparent",
      white: "#fff"
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
    }
  },
  plugins: []
}
export default config
