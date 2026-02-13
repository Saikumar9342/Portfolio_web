import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)"],
            },
            letterSpacing: {
                tightest: "-0.06em",
                widest: "0.4em",
            },
            colors: {
                background: "#020308",
                foreground: "#ffffff",
                accent: {
                    DEFAULT: "#3b82f6",
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#0a0a0a",
                    foreground: "#737373",
                },
                border: "rgba(255, 255, 255, 0.05)",
                glass: "rgba(255, 255, 255, 0.02)",
            },
        },
    },
    plugins: [],
};
export default config;
