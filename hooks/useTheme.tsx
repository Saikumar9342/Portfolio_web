"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "light" as Theme,
      resolvedTheme: "light" as const,
      setTheme: () => {},
    };
  }
  return ctx;
}

function applyTheme(t: Theme) {
  if (typeof window === "undefined") return;

  const html = document.documentElement;
  let resolved: "light" | "dark" = "light";

  if (t === "auto") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } else {
    resolved = t;
  }

  // Remove both classes first
  html.classList.remove("light", "dark");
  // Add the resolved class
  html.classList.add(resolved);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // On mount, read from localStorage and apply
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial = stored || "auto";
    setThemeState(initial);

    // Determine resolved theme
    if (initial === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
    } else {
      setResolvedTheme(initial);
    }

    applyTheme(initial);
    setMounted(true);
  }, []);

  // When theme state changes, apply it
  useEffect(() => {
    if (!mounted) return;

    let resolved: "light" | "dark" = "light";
    if (theme === "auto") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      resolved = theme;
    }

    setResolvedTheme(resolved);
    applyTheme(theme);
  }, [theme, mounted]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
