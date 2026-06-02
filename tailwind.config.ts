import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['Menlo', 'Consolas', 'Monaco', 'monospace']
      }
    }
  },
  plugins: [daisyui, typography]
}

export default config
