/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002a54',
          light: '#003d7a',
          dark: '#001a34',
        },
        accent: {
          DEFAULT: '#e6c35f',
          dark: '#d4b050',
          light: '#f5d270',
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
