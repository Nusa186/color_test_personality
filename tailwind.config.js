/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mining: {
          yellow: '#E9F40B',
          white: '#FFFFFF',
          brown: '#403836',
          black: '#000000',
          gray: '#C7BDBA'
        }
      }
    },
  },
  plugins: [],
};