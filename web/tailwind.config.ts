import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        prose: '65ch',
      },
    },
  },
  plugins: [],
};

export default config;
