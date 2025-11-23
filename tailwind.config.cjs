/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'laser-blue-dark': '#041733',
        'laser-blue': '#0c2340',
        'laser-blue-light': '#1b3b6f',
        'laser-accent': '#2f8fff',
        'laser-accent-soft': '#e3f1ff',
        'laser-border': '#d7e0ef',
      },
      boxShadow: {
        card: '0 10px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}


