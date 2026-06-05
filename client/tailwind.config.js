/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs:  '375px',
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          50:  '#edfdf6',
          100: '#d2f9e8',
          200: '#a8f1d3',
          300: '#6fe4b8',
          400: '#35ce98',
          500: '#12b37e',
          600: '#006A4E',
          700: '#005a42',
          800: '#004836',
          900: '#003d2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bn:   ['"Noto Sans Bengali"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
