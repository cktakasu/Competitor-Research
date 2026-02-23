import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2d2a26",
        accent: "#ff3b30",
        "scandi-wood": "#f4efe6",
        "scandi-warm-grey": "#e8e6e1",
        "scandi-light": "#fafaf9",
        surface: "#ffffff",
        "text-main": "#2d2a26",
        "text-muted": "#8a817c"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2.5rem"
      },
      boxShadow: {
        scandi: "0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.01)"
      }
    }
  },
  plugins: [forms, containerQueries]
};

export default config;
