/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-shift': 'gradientShift 15s ease infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.yellow.400"), 0 0 20px theme("colors.yellow.400")',
      },
    },
  },
  plugins: [],
};