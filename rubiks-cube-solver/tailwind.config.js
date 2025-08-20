/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        'cube': {
          'white': '#FFFFFF',
          'yellow': '#FFD500',
          'red': '#B71234',
          'orange': '#FF5800',
          'green': '#009E60',
          'blue': '#0046AD',
          'black': '#000000',
          'gray': '#404040'
        }
      },
      screens: {
        'xs': '375px',
        'ios': '390px', // iPhone 12/13/14 Pro
      }
    },
  },
  plugins: [],
}