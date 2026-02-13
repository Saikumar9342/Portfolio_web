"use client";

import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const nextTheme = (): "light" | "dark" => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "light";
    return resolvedTheme === "light" ? "dark" : "light";
  };

  return (
    <motion.button
      onClick={() => setTheme(nextTheme())}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: resolvedTheme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {resolvedTheme === "light" ? (
          <Moon className="w-5 h-5 text-slate-600" />
        ) : (
          <Sun className="w-5 h-5 text-slate-400" />
        )}
      </motion.div>
    </motion.button>
  );
}
