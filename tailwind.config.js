/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit',
  // purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    height: {
      home: '800px',
    },
    extend: {},
  },
  plugins: [],
}
