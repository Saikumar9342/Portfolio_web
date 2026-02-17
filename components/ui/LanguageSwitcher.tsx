"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
    const { languages, currentLanguage, setLanguage } = useLanguage();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    // Visibility Logic: Hide on Brand Landing Page ('/'), Show everywhere else (including custom domains)
    useEffect(() => {
        // If path is not root, always show (e.g. /p/userId)
        if (pathname !== "/") {
            setIsVisible(true);
            return;
        }

        // If path is root ('/'), check if we are on the main domain or a custom domain.
        // Main Domain = Landing Page (Hide Switcher)
        // Custom Domain = User Portfolio (Show Switcher)
        const hostname = window.location.hostname;
        const primaryDomain = (process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || "anithix.com").toLowerCase();

        // Check if we are on the main branding site root
        const isMainSite = hostname === primaryDomain ||
            hostname === `www.${primaryDomain}` ||
            hostname === "localhost" ||
            hostname.endsWith(`.vercel.app`); // Vercel preview URLs

        if (isMainSite) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [pathname]);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsCollapsed(true);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // if (languages.length <= 1) return null;
    if (!isVisible) return null;

    // Dimensions for the "small" version
    const closedWidth = 170;
    const handleWidth = 48;
    const offsetWhenCollapsed = -(closedWidth - handleWidth);

    return (
        <div
            className="fixed bottom-32 left-0 z-[500]"
            ref={containerRef}
        >
            <motion.div
                initial={false}
                animate={{
                    x: isCollapsed ? offsetWhenCollapsed : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="relative flex items-center"
            >
                {/* Compact Integrated Glass Capsule */}
                <div
                    className={cn(
                        "flex items-center h-12 bg-background/60 backdrop-blur-[40px] border border-l-0 border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-r-[24px] transition-all duration-500",
                        isOpen ? "w-[220px]" : "w-[170px]"
                    )}
                >
                    {/* Content Section: Icon & Names */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isCollapsed) setIsOpen(!isOpen);
                        }}
                        className={cn(
                            "flex-1 flex items-center gap-3 pl-5 h-full transition-opacity duration-300",
                            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                        )}
                    >
                        <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent text-xl shadow-md border border-white/5 shrink-0">
                            {currentLanguage.flag || "🌐"}
                        </div>
                        <div className="flex flex-col items-start overflow-hidden text-left">
                            <span className="text-[10px] font-bold uppercase tracking-tight text-white/95 whitespace-nowrap">
                                {currentLanguage.name}
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-accent/60 leading-none">
                                {currentLanguage.code}
                            </span>
                        </div>
                    </button>

                    {/* Edge Control: The Compact Arrow Handle */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCollapsed(!isCollapsed);
                            if (!isCollapsed) setIsOpen(false);
                        }}
                        className="w-[48px] h-full flex items-center justify-center group shrink-0 pointer-events-auto"
                    >
                        <motion.div
                            animate={{ rotate: isCollapsed ? 0 : 180 }}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300 border border-white/10"
                        >
                            <ChevronRight className="w-4 h-4 text-accent group-hover:text-white transition-colors" />
                        </motion.div>
                    </button>

                    {/* Compact Selection Drawer */}
                    <AnimatePresence>
                        {isOpen && !isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full left-0 mb-4 w-full bg-[#0a0a0a] border border-white/20 rounded-tr-[24px] rounded-br-[8px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-2 pointer-events-auto"
                            >
                                <div className="space-y-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLanguage(lang);
                                                setIsOpen(false);
                                                // Tucking it back after selection for better flow
                                                setIsCollapsed(true);
                                            }}
                                            className={cn(
                                                "w-full text-left p-2.5 rounded-[16px] flex items-center gap-3 transition-all group",
                                                currentLanguage.code === lang.code
                                                    ? "bg-accent shadow-lg shadow-accent/20"
                                                    : "hover:bg-white/10"
                                            )}
                                        >
                                            <span className="text-xl group-hover:scale-110 transition-transform">
                                                {lang.flag || "🌐"}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "block text-[10px] font-bold uppercase tracking-wider",
                                                    currentLanguage.code === lang.code ? "text-white" : "text-white/70"
                                                )}>
                                                    {lang.name}
                                                </span>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase tracking-[0.1em] leading-none",
                                                    currentLanguage.code === lang.code ? "text-white/70" : "text-white/40"
                                                )}>
                                                    {lang.code}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
