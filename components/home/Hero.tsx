"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Typography } from "../ui/layout";
import Link from "next/link";
import { useDynamicColor } from "@/hooks/useDynamicColor";
// import { portfolioData } from "@/lib/data";
import { PortfolioContent } from "@/hooks/usePortfolio";

interface HeroProps {
    data: PortfolioContent['hero'];
    role: string;
    name: string;
    location: string;
}

export function Hero({ data, role, name, location }: HeroProps) {
    const hero = data;
    useDynamicColor(hero.imageUrl || "/pfp.jpeg");

    return (
        <section className="relative h-[100dvh] w-full flex items-center pt-24 pb-12 px-4 md:px-8 overflow-hidden bg-background transition-colors duration-1000">
            <div className="container mx-auto max-w-6xl h-full relative z-10 flex items-center px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6 space-y-6"
                    >
                        <div className="space-y-4">
                            <Typography element="h1" className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] text-foreground tracking-tighter uppercase">
                                {hero?.title?.split(" ").map((word, i) => (
                                    <span key={i} className="block">{word}</span>
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
                            className="flex flex-wrap gap-4 pt-2"
                        >
                            <Link href="/projects">
                                <Button size="lg" className="px-8 flex items-center gap-3 hover:scale-[1.02] transition-all active:scale-95 group shadow-2xl shadow-accent/20">
                                    {hero.cta}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href={hero.secondaryCtaHref || "/#about"}>
                                <Button size="lg" className="px-8 border-border bg-transparent hover:bg-foreground/5 text-foreground transition-all duration-300" variant="outline">
                                    {hero.secondaryCta || "About"}
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="lg:col-span-6 flex justify-center lg:justify-end"
                    >
                        <div className="relative aspect-[3/4] w-full max-w-md lg:max-w-lg xl:max-w-xl max-h-[75vh] overflow-hidden rounded-[2rem] shadow-2xl group transition-all duration-1000 border border-foreground/10">
                            {/* Smooth hover zoom */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={hero.imageUrl || "/pfp.jpeg"}
                                alt={name}
                                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Seamless mix: No border, no hard overlay */}
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
