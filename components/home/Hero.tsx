"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Typography } from "../ui/layout";
import { portfolioData } from "@/lib/data";
import Link from "next/link";

export function Hero() {
    const { hero } = portfolioData;

    return (
        <section className="relative min-h-screen w-full flex items-center py-20 px-4 md:px-8">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-7 space-y-8 order-2 lg:order-1"
                    >
                        <div className="space-y-4">
                            <Typography className="text-sm font-semibold text-accent tracking-[0.2em] uppercase">
                                {portfolioData.role}
                            </Typography>
                            <Typography element="h1" className="text-6xl md:text-8xl font-bold leading-[1.1] text-foreground tracking-tight">
                                {hero.title}
                            </Typography>
                        </div>

                        <Typography className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-normal">
                            {hero.subtitle}
                        </Typography>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap gap-4 pt-4"
                        >
                            <Link href="/projects">
                                <Button size="lg" className="rounded-full px-10 h-14 text-base font-semibold flex items-center gap-3 bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all active:scale-95 group">
                                    {hero.cta}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/#about">
                                <Button size="lg" className="rounded-full px-10 h-14 text-base font-semibold border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-foreground transition-all duration-300" variant="outline">
                                    About Me
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Image Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 30 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
                    >
                        <div className="relative group">
                            {/* Decorative background glass */}
                            <div className="absolute -inset-4 bg-accent/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                            {/* Image Container */}
                            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                <img
                                    src="/pfp.jpeg"
                                    alt={portfolioData.name}
                                    className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                            </div>

                            {/* Floating Stats or Label maybe? */}
                            <div className="absolute -bottom-6 -right-6 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                    <Typography className="text-xs font-bold tracking-wider text-foreground">AVAILABLE FOR WORK</Typography>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
