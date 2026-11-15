import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        senior: {
          blue: "#1E3A8A",
          teal: "#0D9488",
          amber: "#D97706",
          rose: "#E11D48",
          emerald: "#059669",
          slate: "#334155",
        },
      },
      fontSize: {
        "senior-base": "1.125rem",
        "senior-lg": "1.35rem",
        "senior-xl": "1.65rem",
        "senior-2xl": "2.1rem",
      },
    },
  },
  plugins: [],
};

export default config;
