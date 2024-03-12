import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  plugins: [daisyui],
  theme: {
    extend: {},
  },
} satisfies Config;
