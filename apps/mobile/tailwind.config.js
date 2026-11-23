/** App — Expo + NativeWind v4. Design system Ensign, tema `app` (escuro). */

// O preset é GERADO de design-system/tokens.json (raiz do monorepo).
// Não adicione cor, espaço, raio ou fonte aqui: edite tokens.json e rode `npm run ds:build`.
const ensign = require('./src/shared/theme/tailwind-preset.native.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset'), ensign],
  plugins: [],
};
