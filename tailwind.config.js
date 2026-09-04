/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cerulean: '#2A52BE',
        jasper: '#D73B3E',
        paper: '#FDFBF7',
        ink: '#1A1A1A',
        paperDark: '#F2EFE9'
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        newsreader: ['"Newsreader"', 'serif'],
      }
    },
  },
  plugins: [],
}
