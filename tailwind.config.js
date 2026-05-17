/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nude-linen': '#EDE4DA',
        'sand-nude': '#DDD0C0',
        'warm-nude': '#C8B8A2',
        'mist-teal': '#A8D4CC',
        'sage-teal': '#5AADA0',
        'deep-teal': '#3D8C80',
        'forest-teal': '#2A6B62',
        'dark-teal': '#1E5048',
        'espresso': '#3D2A1E',
        'walnut': '#6B4A38',
        'mocha': '#8B6450',
        'blush': '#F0D4CC',
        'dusty-rose': '#D4907E',
        'terra-pink': '#B8685A',
        'dark-pink': '#8B4A3A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
