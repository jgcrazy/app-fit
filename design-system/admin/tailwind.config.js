/** Admin — Laravel 13 + Blade/Livewire (ou Inertia + React). Tema: admin. */
const ensign = require('./design-system/tailwind-preset.web.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [ensign],
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.{js,jsx,ts,tsx,vue}',
    './app/Livewire/**/*.php',
    './app/View/Components/**/*.php',
  ],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        'fade-in':   { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in':  { from: { opacity: '0', transform: 'scale(.96)' },
                       to:   { opacity: '1', transform: 'scale(1)' } },
        'slide-up':  { from: { transform: 'translateY(100%)' },
                       to:   { transform: 'translateY(0)' } },
        'slide-down':{ from: { opacity: '0', transform: 'translateY(-12px)' },
                       to:   { opacity: '1', transform: 'translateY(0)' } },
        shimmer:     { from: { backgroundPosition: '-160% 0' },
                       to:   { backgroundPosition: '260% 0' } },
      },
      animation: {
        // duração e easing vêm dos tokens, via as custom properties do tema
        'fade-in':    'fade-in var(--duration-base) var(--ease-standard) both',
        'scale-in':   'scale-in var(--duration-fast) var(--ease-decelerate) both',
        'slide-up':   'slide-up var(--duration-slow) var(--ease-decelerate) both',
        'slide-down': 'slide-down var(--duration-base) var(--ease-decelerate) both',
        shimmer:      'shimmer var(--duration-slower) var(--ease-linear) infinite',
        spin:         'spin 800ms var(--ease-linear) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({ strategy: 'class' }),
  ],
};
