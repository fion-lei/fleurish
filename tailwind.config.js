/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fleur: {
          purple: "#E1BAD4",
          green: "#85B254",
          cream: "#FFF8ED",
          melon: "#F0FFC8",
          matcha: "#85B254",
          apple: "#B5E78A",
          blue: "#9CB3E8",
          darkblue: "#7998DF",
        },
      },
      boxShadow: {
        soft: "0 6px 14px rgba(0,0,0,0.08)",
        insetSoft:
          "inset 0 2px 0 rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.06)",
      },
      letterSpacing: {
        wide2: "0.06em",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
