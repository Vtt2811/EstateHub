/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy/charcoal foundation
        navy: {
          50:  '#f0f3f9',
          100: '#dae1ef',
          200: '#b8c5df',
          300: '#8da3cb',
          400: '#6680b3',
          500: '#4a6199',
          600: '#3a4d7d',
          700: '#2d3b5e',
          800: '#1e2a45',
          900: '#141d31',
          950: '#0b1120',
        },
        // Warm terracotta/amber accent
        accent: {
          50:  '#fef7ee',
          100: '#fdedd6',
          200: '#fad6ac',
          300: '#f7b878',
          400: '#f29441',
          500: '#ef7a1e',
          600: '#e06114',
          700: '#ba4912',
          800: '#943a17',
          900: '#783216',
          950: '#411709',
        },
        // Warm gold secondary accent
        gold: {
          50:  '#fefbe8',
          100: '#fef6c3',
          200: '#feea8a',
          300: '#fdd847',
          400: '#fbc515',
          500: '#ebae09',
          600: '#cb8604',
          700: '#a26007',
          800: '#854c0e',
          900: '#713e12',
          950: '#422006',
        },
        // Warm surface tones
        surface: {
          50:  '#faf9f7',
          100: '#f5f3ef',
          200: '#eae5dd',
          300: '#ddd5c9',
          400: '#c9bba8',
          500: '#b59f87',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display':    ['3.5rem', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2.5rem', { lineHeight: '1.16', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading':    ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg':    ['1.125rem', { lineHeight: '1.6' }],
        'body':       ['1rem', { lineHeight: '1.6' }],
        'body-sm':    ['0.875rem', { lineHeight: '1.5' }],
        'caption':    ['0.75rem', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
        'pill': '9999px',
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)',
        'elevated':  '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06)',
        'nav':       '0 1px 0 rgba(0,0,0,0.05)',
        'input':     '0 1px 2px rgba(0,0,0,0.05)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      transitionDuration: {
        '250': '250ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
