"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { portfolioData } from "@/lib/data";
import { Button } from "../ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { name } = portfolioData;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm border-b border-slate-200 dark:border-slate-800 py-3"
                    : "bg-transparent py-4"
            )}
        >
            <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center"
                    >
                        <span className="text-white font-bold text-lg">S</span>
                    </motion.div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Frontend Engineer</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6 text-sm font-medium">
                        <Link href="/projects" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Projects
                        </Link>
                        <Link href="/#about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            About
                        </Link>
                        <Link href="/#skills" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Skills
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button className="rounded-lg px-6" variant="default">
                            Hire Me
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {mobileOpen ? (
                            <X className="w-5 h-5 text-slate-900 dark:text-white" />
                        ) : (
                            <Menu className="w-5 h-5 text-slate-900 dark:text-white" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                    opacity: mobileOpen ? 1 : 0,
                    height: mobileOpen ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800"
            >
                <div className="px-4 py-4 space-y-3">
                    <Link
                        href="/projects"
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        onClick={() => setMobileOpen(false)}
                    >
                        Projects
                    </Link>
                    <Link
                        href="/#about"
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        onClick={() => setMobileOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        href="/#skills"
                        className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        onClick={() => setMobileOpen(false)}
                    >
                        Skills
                    </Link>
                    <Button className="w-full rounded-lg mt-2">Hire Me</Button>
                </div>
            </motion.div>
        </motion.nav>
    );
}
