/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        carbon: {
          50:  '#f4f4f4',
          100: '#e0e0e0',
          200: '#c6c6c6',
          300: '#a8a8a8',
          400: '#8d8d8d',
          500: '#6f6f6f',
          600: '#525252',
          700: '#393939',
          800: '#262626',
          900: '#161616',
          950: '#0a0a0a',
        },
        blue: {
          40:  '#78a9ff',
          60:  '#0f62fe',
          70:  '#0043ce',
        },
        cyan: {
          40:  '#33b1ff',
        },
        green: {
          40:  '#42be65',
        },
        yellow: {
          30:  '#f1c21b',
        },
        red: {
          40:  '#ff8389',
          60:  '#da1e28',
        },
      },
    },
  },
  plugins: [],
}
