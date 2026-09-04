/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        paperDark: '#F2EFE9',
        // Nocturnal Academic Theme Tokens
        night: '#0F141C',
        nightCard: '#161D28',
        nightBorder: '#263244',
        nightInput: '#10151E',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        newsreader: ['"Newsreader"', 'serif'],
      }
    },
  },
  plugins: [],
}
