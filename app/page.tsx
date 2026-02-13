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

                {/* ABOUT SECTION (REPLACING PREVIOUS ABOUT) */}
                <About />

                {/* SKILLS SECTION */}
                <section id="skills" className="py-24 border-t border-border/50">
                    <div className="container px-6 md:px-12 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="space-y-6">
                                <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">Toolbox</Typography>
                                <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                    Technical Expertise
                                </Typography>
                                <Typography className="text-lg text-muted-foreground leading-relaxed">
                                    A comprehensive suite of technologies I use to build robust, scalable, and secure digital products.
                                </Typography>
                                <div className="pt-4 flex flex-wrap gap-2">
                                    {portfolioData.skills.frameworks.map(f => (
                                        <span key={f} className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Frontend Skill Card */}
                                <GlassCard className="p-6 space-y-4 hover:border-accent/40 transition-all duration-500">
                                    <Typography element="h3" className="text-xl font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        Frontend Engineering
                                    </Typography>
                                    <div className="space-y-3">
                                        {portfolioData.skills.frontend.map(skill => (
                                            <div key={skill.name} className="space-y-1">
                                                <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                    <span>{skill.name}</span>
                                                    <span>{skill.level}%</span>
                                                </div>
                                                <div className="h-1 w-full bg-accent/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${skill.level}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className="h-full bg-accent"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                <div className="space-y-4">
                                    {/* Mobile & Backend Cards */}
                                    <GlassCard className="p-6 space-y-3">
                                        <Typography element="h3" className="text-lg font-bold">Mobile Development</Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolioData.skills.mobile.map(m => (
                                                <span key={m} className="px-3 py-1 text-xs rounded-lg bg-foreground/[0.03] border border-foreground/10 text-foreground/80">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-3">
                                        <Typography element="h3" className="text-lg font-bold">Cloud & Backend</Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolioData.skills.backend.map(b => (
                                                <span key={b} className="px-3 py-1 text-xs rounded-lg bg-foreground/[0.03] border border-foreground/10 text-foreground/80">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6 space-y-3">
                                        <Typography element="h3" className="text-lg font-bold">Workflow & Tools</Typography>
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            {portfolioData.skills.tools.join(" • ")}
                                        </div>
                                    </GlassCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="py-24 border-t border-foreground/5 bg-foreground/[0.02]">
                    <div className="container px-6 mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground">
                                {portfolioData.contact.title}
                            </Typography>

                            <Typography className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                {portfolioData.contact.description}
                            </Typography>

                            <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
                                <Button size="lg" className="rounded-full px-12 h-14 text-base font-semibold shadow-lg shadow-accent/20">
                                    {portfolioData.contact.cta}
                                </Button>
                                <a
                                    href="/Saikumar.p_FrontendDeveloper.pdf"
                                    target="_blank"
                                    className="rounded-full px-12 h-14 flex items-center justify-center font-semibold border border-foreground/10 hover:border-foreground/30 bg-foreground/[0.05] hover:bg-foreground/[0.08] text-foreground transition-all duration-300"
                                >
                                    {portfolioData.contact.secondaryCta}
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-12 border-t border-foreground/5 bg-foreground/[0.01]">
                    <div className="container px-6 mx-auto max-w-6xl">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex flex-col items-center md:items-start gap-2">
                                <a href={`mailto:${portfolioData.contact.email}`} className="text-sm font-semibold text-foreground hover:text-accent transition-colors">
                                    {portfolioData.contact.email}
                                </a>
                                <Typography className="text-xs text-muted-foreground">
                                    {portfolioData.about.location}
                                </Typography>
                            </div>

                            <Typography className="text-xs text-muted-foreground">
                                © 2024 {portfolioData.name}. All rights reserved.
                            </Typography>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
