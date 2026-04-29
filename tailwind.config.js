/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF8F5",
        ink: "#111111",
        body: "#5F6368",
        line: "#EAEAEA",
        red: {
          DEFAULT: "#B42318",
          dark: "#8E1F1F",
        },
      },
      fontFamily: {
        sans: [
          "Tajawal",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Tajawal",
          "Inter",
          "'Instrument Serif'",
          "Georgia",
          "serif",
        ],
        latin: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,17,0.04), 0 8px 32px rgba(17,17,17,0.06)",
        lift: "0 12px 40px rgba(17,17,17,0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};
