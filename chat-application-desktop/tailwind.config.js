/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
   theme: {
    extend: {
      colors: {
        'custom-gray': '#DAD3CC',
        'custom-green': '#E2F7CB',
        'grey-dark': ' #8795a1',
        'grey-lighter' : '#f1f5f8'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}