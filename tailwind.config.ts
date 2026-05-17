import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D6EFD",
        accent: "#FF6600",
        success: "#28A745",
        "page-bg": "#F5F5F5",
        "dark-text": "#212529",
        "grey-text": "#6C757D",
        border: "#E0E0E0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        body: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
