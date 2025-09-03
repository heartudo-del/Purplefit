import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    // ... theme extensions are correct
    extend: {
      keyframes: { /* ... keyframes are correct ... */ },
      animation: { /* ... animations are correct ... */ },
    },
  },
  // This line is the correct way to load animations
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
