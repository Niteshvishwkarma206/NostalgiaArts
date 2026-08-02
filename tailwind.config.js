/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbeb',
          100: '#fbf7c8',
          200: '#f7ee92',
          300: '#f1dd53',
          400: '#eac522',
          500: '#d4af37', // Custom Luxury Accent Gold
          600: '#b88d22',
          700: '#936a1c',
          800: '#75521c',
          900: '#61431c',
          950: '#38230c',
        },
        onyx: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#333333',
          900: '#1a1a1a',
          950: '#0a0a0a', // True premium black
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 4px 25px rgba(212, 175, 55, 0.15)',
        'dark-glow': '0 10px 40px rgba(0, 0, 0, 0.6)',
        'glass-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropFilter: {
        'glass': 'blur(12px)'
      }
    },
  },
  plugins: [],
}
