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
                outfit: ["var(--font-outfit)"],
            },
            letterSpacing: {
                tightest: "-0.06em",
                widest: "0.4em",
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                border: "var(--border)",
                glass: "var(--glass)",
            },
        },
    },
    plugins: [],
};
export default config;
