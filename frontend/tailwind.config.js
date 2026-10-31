/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        porcelain: {
          50: '#FCFCFA',
          100: '#F8F8F5',
          200: '#F1F1EB',
          300: '#E7E7DF',
        },
        charcoal: {
          800: '#232529',
          900: '#141618',
          950: '#0C0D0E',
        },
        accent: {
          orange: '#EA580C',
          orangeHover: '#C2410C',
          orangeLight: '#FFF7ED',
          lime: '#65A30D',
          limeLight: '#F7FEE7',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}

