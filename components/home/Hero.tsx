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
        <section className="relative min-h-screen w-full flex items-center pt-20 pb-20 px-4 md:px-8 overflow-hidden">
            {/* Soft decorative blur backgrounds for sync */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-background overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />
            </div>

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
                                <Button size="lg" className="rounded-full px-12 h-16 text-base font-bold flex items-center gap-3 bg-accent text-accent-foreground hover:scale-[1.02] transition-all active:scale-95 group shadow-2xl shadow-accent/20">
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
                        <div className="relative aspect-[4/5] w-full max-w-xl mx-auto overflow-hidden rounded-[3.5rem] border border-border/50 shadow-2xl group">
                            {/* Smooth hover zoom */}
                            <img
                                src="/pfp.jpeg"
                                alt={portfolioData.name}
                                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Subtle overlay to sync theme colors */}
                            <div className="absolute inset-0 bg-accent/5 mix-blend-overlay pointer-events-none" />

                            {/* Detail Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute bottom-8 left-8 right-8 p-6 glass-panel border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl hidden md:block"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground font-black text-xl shadow-lg">
                                            {portfolioData.name[0]}
                                        </div>
                                        <div className="space-y-0.5">
                                            <Typography className="text-[10px] font-black tracking-widest text-accent uppercase opacity-60">Located in</Typography>
                                            <Typography className="text-sm font-bold">{portfolioData.about.location}</Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-green-500 tracking-tighter uppercase">Active Now</span>
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
