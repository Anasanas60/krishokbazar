/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      colors: {
        green: {
          50: "#f0f9f1",
          100: "#dcf1de",
          200: "#bae3be",
          300: "#8ecd95",
          400: "#5fb06a",
          500: "#4f7942",
          600: "#3a5a31",
          700: "#2f4728",
          800: "#273921",
          900: "#22301d",
        },
        yellow: {
          500: "#f9a826",
        },
      },
      borderRadius: {
        md: "14px",
        lg: "22px",
      },
      boxShadow: {
        md: "0 6px 16px rgba(16,24,40,0.08)",
      },
    },
  },
  plugins: [],
};
