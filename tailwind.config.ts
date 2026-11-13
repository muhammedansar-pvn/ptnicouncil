import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0756A0",
          hover: "#054380",
          light: "#EEF4FA",
        },
        brand: {
          dark: "#172033",
          muted: "#64748B",
          border: "#E5EAF1",
          bg: "#F7F9FC",
        },
      },
      fontFamily: {
        cooper: ["'Cooper Black'", "'Cooper'", "'Rockwell Extra Bold'", "'Arial Black'", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        malayalam: ["'Manjari'", "'Noto Sans Malayalam'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
