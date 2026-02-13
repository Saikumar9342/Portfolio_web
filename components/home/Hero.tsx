"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Typography } from "../ui/layout";
import { portfolioData } from "@/lib/data";
import Link from "next/link";
import { useDynamicColor } from "@/hooks/useDynamicColor";

export function Hero() {
    const { hero } = portfolioData;
    useDynamicColor("/pfp.png");

    return (
        <section className="relative min-h-screen w-full flex items-center pt-20 pb-20 px-4 md:px-8 overflow-hidden bg-background transition-colors duration-1000">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6 space-y-10"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Typography className="text-[10px] md:text-xs font-black text-accent tracking-[0.4em] uppercase py-1 px-3 border border-accent/20 rounded-full inline-block">
                                    {portfolioData.role}
                                </Typography>
                            </motion.div>

                            <Typography element="h1" className="text-6xl md:text-8xl font-black leading-[0.9] text-foreground tracking-tighter">
                                {hero.title.split(" ").map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </Typography>
                        </div>

                        <Typography className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed font-medium">
                            {hero.subtitle}
                        </Typography>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex flex-wrap gap-5 pt-4"
                        >
                            <Link href="/projects">
                                <Button size="lg" className="rounded-full px-12 h-16 text-base font-bold flex items-center gap-3 hover:scale-[1.02] transition-all active:scale-95 group shadow-2xl shadow-accent/20">
                                    {hero.cta}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/#about">
                                <Button size="lg" className="rounded-full px-12 h-16 text-base font-bold border-border bg-transparent hover:bg-foreground/5 text-foreground transition-all duration-300" variant="outline">
                                    About
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Image Content - Prominent & Neat */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="lg:col-span-6"
                    >
                        <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-2xl mx-auto overflow-hidden rounded-[4rem] shadow-2xl group transition-all duration-1000">
                            {/* Smooth hover zoom */}
                            <img
                                src="/pfp.png"
                                alt={portfolioData.name}
                                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Seamless mix: No border, no hard overlay */}
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[4rem]" />

                            {/* Detail Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute bottom-10 left-10 right-10 p-8 glass-panel shadow-2xl rounded-[2.5rem] hidden xl:block"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-[1.25rem] bg-foreground text-background flex items-center justify-center font-black text-2xl shadow-xl">
                                            {portfolioData.name[0]}
                                        </div>
                                        <div className="space-y-0.5">
                                            <Typography className="text-[10px] font-black tracking-[0.2em] text-foreground/40 uppercase">Studio Location</Typography>
                                            <Typography className="text-base font-bold text-foreground">{portfolioData.about.location}</Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 px-5 py-2.5 bg-foreground/5 border border-foreground/10 rounded-full">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <span className="text-[10px] font-black text-foreground/80 tracking-widest uppercase">Now Available</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
