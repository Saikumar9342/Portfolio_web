import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { NavbarData, ContactData } from "@/types";
import { BrandLogo } from "../ui/BrandLogo";

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
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center transition-transform"
                    >
                        <BrandLogo className="text-foreground" size={36} />
                    </motion.div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-xl font-bold tracking-tighter text-foreground uppercase">{data?.logoText || name.charAt(0).toLowerCase()}</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative text-muted-foreground hover:text-foreground transition-colors group py-2"
                            >
                                {item.label}
                                <motion.span
                                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"
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
                            <Button
                                className="rounded-lg px-8 py-6 font-bold text-xs uppercase tracking-widest shadow-xl shadow-accent/10 hover:shadow-accent/20 transition-all"
                                variant="default"
                                onClick={() => {
                                    const contactSection = document.getElementById("contact");
                                    if (contactSection) {
                                        contactSection.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                            >
                                {ctaText}
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-3">
                    <motion.button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
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
                    <Button
                        className="w-full rounded-lg mt-2"
                        onClick={() => {
                            setMobileOpen(false);
                            const contactSection = document.getElementById("contact");
                            if (contactSection) {
                                contactSection.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                    >
                        {ctaText}
                    </Button>
                </div>
            </motion.div>
        </motion.nav >
    );
}
