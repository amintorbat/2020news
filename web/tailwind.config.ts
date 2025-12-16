import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        base: {
          DEFAULT: "#fdfdfd",
          foreground: "#111111",
          muted: "#6b7280",
          border: "#e4e7ec",
        },
        brand: {
          DEFAULT: "#0b6efd",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#0b6efd",
        },
      },
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 60px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
