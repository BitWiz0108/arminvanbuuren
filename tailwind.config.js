/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      transparent: "var(--color-transparent)",
      background: "var(--color-background)",
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      third: "var(--color-third)",
      bluePrimary: "var(--color-blue-primary)",
      blueSecondary: "var(--color-blue-secondary)",
      activePrimary: "var(--color-active-primary)",
      activeSecondary: "var(--color-active-secondary)",
      error: "var(--color-error)",
    },
    screens: {
      'ssm': '500px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'medium-lg': '900px', // new LG breakpoint
      'medium-xl': '1200px', // new LG breakpoint
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
    },
  },
  plugins: [],
};
