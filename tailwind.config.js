/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBF8F3',
        ink: '#20291F',
        pine: {
          50: '#EEF3EE',
          100: '#D6E3D6',
          400: '#4C7C57',
          600: '#2F6844',
          700: '#234E34',
          900: '#152F1F',
        },
        turmeric: {
          400: '#D89A3F',
          500: '#C77B2E',
          600: '#A9631F',
        },
        line: '#E4DECF',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
        chip: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(32,41,31,0.04), 0 8px 20px -10px rgba(32,41,31,0.15)',
        pop: '0 12px 30px -8px rgba(32,41,31,0.25)',
      },
    },
  },
  plugins: [],
}
