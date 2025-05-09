/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        elderly: {
          bg: '#fffbf0',
          text: '#333333',
          primary: '#ff6b35',
          secondary: '#6a8d73',
          card: '#fff8e6',
        }
      },
      fontSize: {
        'elderly-base': '18px',
        'elderly-lg': '22px',
        'elderly-xl': '26px',
        'elderly-2xl': '32px',
      },
      spacing: {
        'elderly': '1.5rem',
      }
    },
  },
  plugins: [],
}