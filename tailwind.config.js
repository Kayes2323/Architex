/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Hind Siliguri'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0f9f0",
          100: "#dcf1dc",
          200: "#b9e3ba",
          300: "#8ccd8f",
          400: "#5fb463",
          500: "#3f9944",
          600: "#2f7d35",
          700: "#26632b",
          800: "#204f25",
          900: "#1b4120",
        },
        alert: {
          50: "#fdf1f0",
          100: "#fbdedb",
          200: "#f7c1bb",
          300: "#f19a91",
          400: "#e8756a",
          500: "#d9564a",
          600: "#bd4038",
          700: "#973430",
          800: "#7c2e2b",
          900: "#682a28",
        },
        warn: {
          50: "#fffaeb",
          100: "#fef0c7",
          200: "#fde08a",
          300: "#fbc94d",
          400: "#f7ae24",
          500: "#f0900b",
        },
        ink: {
          50: "#f7f7f6",
          100: "#eeece8",
          200: "#dedad2",
          300: "#c3bcae",
          400: "#a49a87",
          500: "#867a65",
          600: "#6b6151",
          700: "#544c40",
          800: "#3d3830",
          900: "#28241f",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 65, 32, 0.06), 0 1px 8px rgba(27, 65, 32, 0.07)",
        pop: "0 8px 24px rgba(27, 65, 32, 0.16)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
