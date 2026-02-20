"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Typography } from "../ui/layout";
import Link from "next/link";
import Image from "next/image";

import { PortfolioContent } from "@/hooks/usePortfolio";

interface HeroProps {
    data: PortfolioContent['hero'];
    role: string;
    name: string;
    location: string;
    userId?: string;
    showImage?: boolean;
}

export function Hero({ data, role, name, location, userId, showImage = true }: HeroProps) {
    const hero = data;
    const { scrollY } = useScroll();
    const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

    // Helper for link generation
    const getLink = (path: string) => {
        if (!userId) return path;
        if (path.startsWith("http")) return path;
        if (path === '/projects') return `/p/${userId}/projects`;
        if (path === '/#about') return `/p/${userId}#about`;
        if (path.startsWith('#')) return `/p/${userId}${path}`;
        return path;
    };

    return (
        <section className="relative min-h-[100dvh] w-full flex items-center pt-32 md:pt-24 pb-12 px-4 md:px-8 overflow-hidden bg-background transition-colors duration-1000">
            <div className="container mx-auto max-w-6xl h-full relative z-10 flex items-center px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

                    {/* Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.2
                                }
                            }
                        }}
                        className={`${showImage ? 'lg:col-span-6' : 'lg:col-span-8 lg:col-start-3 text-center'} space-y-6`}
                    >
                        <div className="space-y-4">
                            <Typography element="h1" className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] text-foreground tracking-tighter uppercase overflow-hidden">
                                {hero?.title?.split(" ").map((word, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block mr-4"
                                        variants={{
                                            hidden: { y: 100, opacity: 0 },
                                            visible: {
                                                y: 0,
                                                opacity: 1,
                                                transition: {
                                                    type: "spring",
                                                    damping: 12,
                                                    stiffness: 100
                                                }
                                            }
                                        }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </Typography>
                        </div>

                        <Typography className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed font-medium">
                            {hero.subtitle}
                        </Typography>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className={`flex flex-wrap gap-4 pt-2 ${showImage ? '' : 'justify-center'}`}
                        >
                            <Link href={getLink("/projects")}>
                                <Button size="lg" className="px-8 flex items-center gap-3 hover:scale-[1.02] transition-all active:scale-95 group shadow-2xl shadow-accent/20">
                                    {hero.cta}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href={getLink(hero.secondaryCtaHref || "/#about")}>
                                <Button size="lg" className="px-8 border-border bg-transparent hover:bg-foreground/5 text-foreground transition-all duration-300" variant="outline">
                                    {hero.secondaryCta || "About"}
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {showImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="lg:col-span-6 flex justify-center lg:justify-end"
                        >
                            <div className="relative aspect-[3/4] w-full max-w-md lg:max-w-lg xl:max-w-xl max-h-[75vh] overflow-hidden rounded-3xl group transition-all duration-1000 bg-secondary/10 border border-border/50">
                                {/* Smooth hover zoom or placeholder */}
                                {hero.imageUrl ? (
                                    <Image
                                        src={hero.imageUrl}
                                        alt={name}
                                        fill
                                        className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 bg-muted/5 p-12 text-center">
                                        <div className="w-32 h-32 rounded-full bg-accent/5 flex items-center justify-center mb-6 ring-1 ring-border/50">
                                            <Typography className="text-6xl font-black text-accent/20">
                                                {name?.charAt(0) || "U"}
                                            </Typography>
                                        </div>
                                        <Typography className="text-sm font-medium tracking-widest uppercase opacity-50">
                                            {name || "User Portfolio"}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ opacity: scrollIndicatorOpacity }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-foreground/50"
                >
                    <ChevronDown className="w-8 h-8" />
                </motion.div>
            </motion.div>

            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        </section>
    );
}
