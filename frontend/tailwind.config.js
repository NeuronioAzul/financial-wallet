/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Grupo Adriano Colors
        'ocean-blue': {
          DEFAULT: '#003161',
          light: '#3D58B6',
          dark: '#001F3D',
        },
        'royal-blue': {
          DEFAULT: '#3D58B6',
          light: '#5D78D6',
          dark: '#2D4896',
        },
        'forest-green': {
          DEFAULT: '#00610D',
          light: '#70E080',
          dark: '#004008',
        },
        'mint-green': {
          DEFAULT: '#70E080',
          light: '#90F0A0',
          dark: '#50C060',
        },
        'golden-sand': {
          DEFAULT: '#DAB655',
          light: '#F0D685',
          dark: '#B89640',
        },
        'burgundy-red': {
          DEFAULT: '#610019',
          light: '#8B0025',
          dark: '#3D000F',
        },
        'silver-gray': {
          DEFAULT: '#B3B6CA',
          light: '#D3D6EA',
          dark: '#9396AA',
        },
        'charcoal-gray': {
          DEFAULT: '#686A75',
          light: '#888A95',
          dark: '#484A55',
        },
        // Semantic colors using the palette
        primary: {
          DEFAULT: '#003161', // ocean-blue
          light: '#3D58B6',   // royal-blue
          dark: '#001F3D',
        },
        secondary: {
          DEFAULT: '#00610D', // forest-green
          light: '#70E080',   // mint-green
          dark: '#004008',
        },
        accent: {
          DEFAULT: '#DAB655', // golden-sand
          dark: '#B89640',
          light: '#F0D685',
        },
        success: {
          DEFAULT: '#00610D',
          light: '#70E080',
          dark: '#004008',
        },
        danger: {
          DEFAULT: '#610019',
          light: '#8B0025',
          dark: '#3D000F',
        },
        neutral: {
          DEFAULT: '#686A75',
          light: '#B3B6CA',
          dark: '#484A55',
        },
      },
      fontFamily: {
        sans: ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
        'modal': '16px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 42, 84, 0.3)',
        'button': '0 4px 12px rgba(230, 195, 95, 0.4)',
      },
      transitionTimingFunction: {
        'elastic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
