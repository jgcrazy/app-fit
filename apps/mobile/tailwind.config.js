/** @type {import('tailwindcss').Config} */

// Os tokens vivem em src/shared/theme/tokens.js para que o design system possa
// ser trocado num arquivo so, sem tocar em componente.
const tokens = require('./src/shared/theme/tokens');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      fontSize: tokens.fontSize,
    },
  },
  plugins: [],
};
