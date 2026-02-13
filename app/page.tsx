"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { portfolioData } from "@/lib/data";

export default function Home() {
    const { contact } = portfolioData;
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [currentProgress, setCurrentProgress] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
        setCurrentProgress(latest);
    });

    return (
        <main ref={containerRef} className="relative min-h-screen">
            <div className="relative z-10">
                <Navbar />

                {/* HERO */}
                <Hero />

                {/* PROJECTS SECTION */}
                <section id="projects" className="relative py-20 md:py-32">
                    <div className="container px-6 md:px-12 mx-auto max-w-7xl">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <Typography className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">Portfolio</Typography>
                                <Typography element="h2" className="text-5xl md:text-6xl font-semibold text-foreground">
                                    Selected Projects
                                </Typography>
                            </div>

                            <ProjectGrid />
                        </div>
                    </div>
                </section>

                {/* ABOUT / EXPERTISE */}
                <About />

                {/* CALL TO ACTION */}
                <section className="py-20 md:py-32 border-t border-border">
                    <div className="container px-6 mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <Typography element="h2" className="text-4xl md:text-5xl font-semibold text-foreground">
                                Ready to work together?
                            </Typography>

                            <Typography className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Let&apos;s create something amazing together. Feel free to reach out.
                            </Typography>

                            <div className="flex flex-col md:flex-row gap-4 justify-center">
                                <Button size="lg" className="rounded-lg px-8 h-12 font-semibold">
                                    {contact.cta}
                                </Button>
                                <a
                                    href="/Saikumar.p_FrontendDeveloper.pdf"
                                    target="_blank"
                                    className="rounded-lg px-8 h-12 flex items-center justify-center font-semibold border border-border hover:border-foreground/50 text-foreground transition-all duration-300"
                                >
                                    {contact.secondaryCta}
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-12 border-t border-border bg-muted/30">
                    <div className="container px-6 mx-auto max-w-6xl">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <a href="mailto:saikumarp@gmail.com" className="text-sm font-semibold text-foreground hover:text-accent transition-colors">
                                saikumarp@gmail.com
                            </a>

                            <Typography className="text-xs text-muted-foreground">
                                © 2024 Saikumar Pasumarthi. All rights reserved.
                            </Typography>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
