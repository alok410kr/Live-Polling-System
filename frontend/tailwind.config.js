/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Will be updated with exact Figma values later
        primary: {
          DEFAULT: '#6366F1',
          light: '#8B5CF6',
        },
      },
    },
  },
  plugins: [],
}

