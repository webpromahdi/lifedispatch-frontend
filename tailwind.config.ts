import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14B8A6",
          light: "#F0FDFA",
          dark: "#0D9488",
          foreground: "#FFFFFF",
        },
        background: "#F8FAFC",
        surface: "#FFFFFF",
        sidebar: {
          DEFAULT: "#FFFFFF",
          hover: "#F1F5F9",
          border: "#E2E8F0",
          foreground: "#1E2D3D",
          primary: "#14B8A6",
          "primary-foreground": "#FFFFFF",
          accent: "#F0FDFA",
          "accent-foreground": "#14B8A6",
          ring: "#14B8A6",
        },
        text: {
          primary: "#1E2D3D",
          secondary: "#64748B",
          muted: "#94A3B8",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
        },
        secondary: {
          DEFAULT: "#8B5CF6",
          light: "#EDE9FE",
          foreground: "#FFFFFF",
        },
        status: {
          DEFAULT: "#22C55E",
          bg: "#F0FDF4",
          text: "#15803D",
        },
        destructive: {
          DEFAULT: "#EF4444",
          bg: "#FEF2F2",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          bg: "#FFFBEB",
          foreground: "#92400E",
        },
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
