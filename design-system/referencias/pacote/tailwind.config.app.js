/** App — Expo + NativeWind v4. Tema: app (escuro). */
const ensign = require('./design-system/tailwind-preset.native.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset'), ensign],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './design-system/components/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // No RN, altura e largura também vêm da escala de espaçamento do preset.
      // Não adicione valores novos aqui: adicione em tokens.json e rode ds:build.
    },
  },
  plugins: [],
};
