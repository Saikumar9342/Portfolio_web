import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
// import { portfolioData } from "@/lib/data";
import { Button } from "../ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, Github, Linkedin } from "lucide-react";
import { NavbarData, ContactData } from "@/types";

interface NavbarProps {
    name: string;
    data: NavbarData;
    contact: ContactData;
    loading?: boolean;
}

export function Navbar({ name, data, contact, loading }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = data?.items?.length > 0 ? data.items : [
        { label: "Projects", href: "/projects" },
        { label: "About", href: "/#about" },
        { label: "Skills", href: "/#skills" }
    ];

    const ctaText = data?.ctaText || "Hire Me";
    const logoText = data?.logoText || "S";

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
            <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center shadow-lg"
                    >
                        <span className="text-accent-foreground font-black text-xl">{logoText}</span>
                    </motion.div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-sm font-black tracking-tight text-foreground">{name}</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button className="rounded-lg px-6" variant="default">
                            {ctaText}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    <ThemeToggle />
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
                    >
                        {mobileOpen ? (
                            <X className="w-5 h-5 text-foreground" />
                        ) : (
                            <Menu className="w-5 h-5 text-foreground" />
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
                    <Button className="w-full rounded-lg mt-2">{ctaText}</Button>
                </div>
            </motion.div>
        </motion.nav>
    );
}
