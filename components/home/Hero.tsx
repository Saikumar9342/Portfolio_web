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
        <section className="relative min-h-screen w-full flex items-center py-20">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl space-y-8"
                >
                    {/* Subtitle */}
                    <Typography className="text-sm font-semibold text-accent tracking-wide uppercase">
                        Frontend Engineer
                    </Typography>

                    {/* Main Heading */}
                    <Typography element="h1" className="text-7xl md:text-8xl font-semibold leading-tight text-foreground">
                        {hero.title}
                    </Typography>

                    {/* Description */}
                    <Typography className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-normal">
                        {hero.subtitle}
                    </Typography>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-4 pt-8"
                    >
                        <Link href="/projects">
                            <Button size="lg" className="rounded-full px-10 h-14 text-base font-semibold flex items-center gap-3 bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 transition-all active:scale-95 group">
                                {hero.cta}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/#about">
                            <Button size="lg" className="rounded-full px-10 h-14 text-base font-semibold border-white/10 hover:border-white/30 hover:bg-white/5" variant="outline">
                                About Me
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
