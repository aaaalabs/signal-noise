/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        signal: '#00ff88',
        noise: '#666',
        bg: '#000',
        surface: '#0a0a0a',
      },
    },
  },
  plugins: [],
}