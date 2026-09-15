/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FFFBF0',
        ink: '#0F172B',
        navy: {
          700: '#1C2E4A',
          800: '#12203A',
        },
        ochre: '#C2A878',
        stone: '#E8E2D9',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '5xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '6xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },
      maxWidth: {
        'prose': '68ch',
      }
    },
  },
  plugins: [],
}