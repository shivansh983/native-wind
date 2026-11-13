/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8",
        navy: "#0f172a",
        background: "#ffffff",
        surface: "#ffffff",
        border: "#e2e8f0",
        main: "#0f172a",
        muted: "#64748b",
        "muted-light": "#94a3b8",
      },
    },
  },
  plugins: [],
};
