"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { NavbarData, ContactData } from "@/types";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface NavbarProps {
    name: string;
    data: NavbarData;
    contact: ContactData;
    loading?: boolean;
    userId?: string;
}

export function Navbar({ name, data, contact, loading, userId }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Helper to generate correct paths
    const getPath = (path: string) => {
        if (!userId) return path; // Main site: use path as is

        // If path is root '/' or empty, go to user home
        if (path === '/' || path === '') return `/p/${userId}`;

        // If path is an anchor like '/#about', make it '/p/{uid}#about'
        if (path.startsWith('/#') || path.startsWith('#')) {
            const hash = path.startsWith('/') ? path.substring(1) : path;
            return `/p/${userId}${hash}`;
        }

        // If path is a subpage like '/projects', make it '/p/{uid}/projects'
        if (path.startsWith('/')) {
            return `/p/${userId}${path}`;
        }

        return path;
    };

    const navItems = data?.items?.length > 0 ? data.items.map(item => ({
        ...item,
        href: getPath(item.href)
    })) : [
        { label: "Projects", href: getPath("/projects") },
        { label: "About", href: getPath("/#about") },
        { label: "Skills", href: getPath("/#skills") }
    ];

    const ctaText = data?.ctaText || "Hire Me";

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-foreground/10 py-3"
                    : "bg-transparent py-4"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href={userId ? `/p/${userId}` : "/"} className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center transition-transform"
                    >
                        <BrandLogo className="text-foreground" size={28} />
                    </motion.div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-base font-outfit font-black tracking-tighter text-foreground uppercase">{data?.logoText || (name ? name.charAt(0).toLowerCase() : "s")}</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6 text-[10px] font-inter font-black uppercase tracking-[0.3em] text-muted-foreground">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative hover:text-foreground transition-colors group py-2"
                            >
                                {item.label}
                                <motion.span
                                    className="absolute bottom-0 left-0 w-0 h-px bg-[#C6A969] rounded-full transition-all duration-300 group-hover:w-full"
                                    layoutId="nav-underline"
                                />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <a
                                href={contact?.email ? `mailto:${contact.email}` : "#"}
                                className={cn(
                                    buttonVariants({ variant: "default" }),
                                    "rounded-lg px-5 h-9 flex items-center justify-center font-outfit font-black text-[9px] uppercase tracking-[0.3em] shadow-xl shadow-[#C6A969]/5 hover:bg-[#C6A969] hover:text-black transition-all border-none bg-white/5 text-white"
                                )}
                            >
                                {ctaText}
                            </a>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl hover:bg-foreground/10 transition-colors"
                    >
                        {mobileOpen ? (
                            <X className="w-6 h-6 text-foreground" />
                        ) : (
                            <Menu className="w-6 h-6 text-foreground" />
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
                className="md:hidden overflow-hidden bg-background border-b border-foreground/10"
            >
                <div className="px-4 py-4 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-2"
                    >
                        <a
                            href={contact?.email ? `mailto:${contact.email}` : "#"}
                            className={cn(
                                buttonVariants({ variant: "default" }),
                                "w-full rounded-xl h-12 flex items-center justify-center font-bold text-xs uppercase tracking-widest"
                            )}
                        >
                            {ctaText}
                        </a>
                    </motion.div>
                </div>
            </motion.div>
        </motion.nav >
    );
}
