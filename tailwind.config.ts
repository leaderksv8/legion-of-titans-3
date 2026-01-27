import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#070707",
        paper: "#FFFFFF",
        gold: "#C9B27C",
        ash: "rgba(255,255,255,0.78)",
        hairline: "rgba(255,255,255,0.16)",
        panel: "rgba(255,255,255,0.04)"
      },
      boxShadow: {
        soft: "0 18px 70px rgba(0,0,0,0.55)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      letterSpacing: {
        luxe: "0.18em"
      }
    },
  },
  plugins: [],
} satisfies Config;
