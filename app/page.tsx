"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Github, Linkedin, Twitter, Globe, ArrowUp, Mail, MapPin } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Footer } from "@/components/layout/Footer";

import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useDynamicColor } from "@/hooks/useDynamicColor";

const PortfolioContent = ({ data }: { data: any }) => {
    const { contact, hero, about, expertise, skills, name, projects } = data;

    // Extract theme color from hero image or default profile
    useDynamicColor(hero?.imageUrl || "/pfp.jpeg");

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
        layoutEffect: false
    });

    const [currentProgress, setCurrentProgress] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
        setCurrentProgress(latest);
    });

    return (
        <main ref={containerRef} className="relative min-h-screen">
            <div className="relative z-10">
                <Navbar name={name} data={data.navbar} contact={contact} loading={false} />

                {/* HERO */}
                <Hero data={hero} role={data.role} name={name} location={about.location} />

                {/* ABOUT SECTION (REPLACING PREVIOUS ABOUT) */}
                <About about={about} expertise={expertise} contact={contact} />

                {/* SKILLS SECTION */}
                <Section id="skills" className="min-h-screen flex items-center py-24 border-t border-border/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
                        <GlassCard className="h-full p-8 flex flex-col justify-center space-y-6">
                            <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">{skills.frameworksTitle || "Toolbox"}</Typography>
                            <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                {skills.title || "Technical Expertise"}
                            </Typography>
                            <Typography className="text-lg text-muted-foreground leading-relaxed">
                                {skills.description || "A comprehensive suite of technologies I use to build robust, scalable, and secure digital products."}
                            </Typography>
                            <div className="pt-4 flex flex-wrap gap-2">
                                {skills.frameworks?.map((f: string) => (
                                    <span key={f} className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent border border-accent/20">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>

                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Frontend Skill Card */}
                            <GlassCard className="p-6 space-y-4 hover:border-accent/40 transition-all duration-500">
                                <Typography element="h3" className="text-xl font-bold flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                    {skills.frontendTitle || "Frontend Engineering"}
                                </Typography>
                                <div className="space-y-3">
                                    {skills.frontend?.map((skill: any) => (
                                        <div key={skill.name} className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-foreground/60">
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
                                    <Typography element="h3" className="text-lg font-bold">{skills.mobileTitle || "Mobile Development"}</Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.mobile?.map((m: string) => (
                                            <span key={m} className="px-3 py-1 text-xs rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/80">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6 space-y-3">
                                    <Typography element="h3" className="text-lg font-bold">{skills.backendTitle || "Cloud & Backend"}</Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.backend?.map((b: string) => (
                                            <span key={b} className="px-3 py-1 text-xs rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/80">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6 space-y-3">
                                    <Typography element="h3" className="text-lg font-bold">{skills.toolsTitle || "Workflow & Tools"}</Typography>
                                    <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                                        {skills.tools?.join(" • ")}
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* COMBINED CONTACT & FOOTER */}
                <Footer contact={contact} about={about} navbar={data.navbar} name={name} />
            </div>
        </main>
    );
};

export default function Home() {
    const { data, loading } = usePortfolio();

    if (loading) return <LoadingScreen />;

    return <PortfolioContent data={data} />;
}
