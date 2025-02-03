/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",               // For the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // For files in the `src` folder
  ],
  theme: {
    extend: {
      colors: {
        yellowAccent: '#E4BC34',
        blueAccent: '#012169',
        greyAccent: '#909590',
        redAccent: "#C8102E",
        orangeAccent: "#E1AB5280",
        greenAccent: "#007A33"
      }
    },
  },
  plugins: [],
}

