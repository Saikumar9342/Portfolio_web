"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Navbar } from "@/components/layout/Navbar";
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

    const [, setCurrentProgress] = useState(0);

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
                        <GlassCard className="p-8 space-y-6 self-start">
                            <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">{skills.frameworksTitle || "Toolbox"}</Typography>
                            <Typography element="h2" className="text-4xl md:text-5xl lg:text-5xl font-bold text-foreground leading-tight">
                                {skills.title || "Technical Expertise"}
                            </Typography>
                            <Typography className="text-lg text-muted-foreground leading-relaxed">
                                {skills.description || "A comprehensive suite of technologies I use to build robust, scalable, and secure digital products."}
                            </Typography>
                            <div className="pt-4 flex flex-wrap gap-2">
                                {skills.frameworks?.map((f: string) => (
                                    <span key={f} className="px-3 py-1 text-xs font-medium rounded-xl bg-accent/10 text-accent border border-accent/20">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>

                        <div className="lg:col-span-2 md:columns-2 md:[column-gap:1rem]">
                            {/* Frontend Skill Card */}
                            <GlassCard className="p-8 space-y-6 hover:border-accent/40 transition-all duration-500 break-inside-avoid mb-6">
                                <Typography element="h3" className="text-xl font-bold text-foreground flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                    {skills.frontendTitle || "Frontend Engineering"}
                                </Typography>
                                <div className="space-y-6">
                                    {skills.frontend?.map((skill: any) => (
                                        <div key={skill.name} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-foreground font-medium">{skill.name}</span>
                                                <span className="text-muted-foreground font-mono">{skill.level}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
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
                                <GlassCard className="p-6 space-y-4 break-inside-avoid mb-6">
                                    <Typography element="h3" className="text-sm font-semibold text-accent uppercase tracking-widest">{skills.mobileTitle || "Mobile Development"}</Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.mobile?.map((m: string) => (
                                            <span key={m} className="px-3 py-1 text-xs font-medium rounded-xl bg-foreground/5 border border-foreground/10 text-muted-foreground hover:bg-foreground/10 transition-colors">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6 space-y-4 break-inside-avoid mb-6">
                                    <Typography element="h3" className="text-sm font-semibold text-accent uppercase tracking-widest">{skills.backendTitle || "Cloud & Backend"}</Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.backend?.map((b: string) => (
                                            <span key={b} className="px-3 py-1 text-xs font-medium rounded-xl bg-foreground/5 border border-foreground/10 text-muted-foreground hover:bg-foreground/10 transition-colors">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </GlassCard>

                                <GlassCard className="p-6 space-y-4 break-inside-avoid mb-6">
                                    <Typography element="h3" className="text-sm font-semibold text-accent uppercase tracking-widest">{skills.toolsTitle || "Workflow & Tools"}</Typography>
                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-medium">
                                        {skills.tools?.join(" • ")}
                                    </div>
                                </GlassCard>

                                {/* Extra Skill Sections (e.g., DevOps) */}
                                {(() => {
                                    if (!skills) return null;
                                    const knownKeys = new Set([
                                        "frontend",
                                        "mobile",
                                        "backend",
                                        "tools",
                                        "frameworks",
                                        "frontendTitle",
                                        "mobileTitle",
                                        "backendTitle",
                                        "toolsTitle",
                                        "frameworksTitle",
                                        "title",
                                        "description",
                                    ]);

                                    return Object.entries(skills)
                                        .filter(([key, value]) => {
                                            if (knownKeys.has(key)) return false;
                                            if (key.endsWith("Title")) return false;
                                            if (!Array.isArray(value) || value.length === 0) return false;

                                            // Check if corresponding title exists
                                            const titleKey = `${key}Title`;
                                            const titleCandidate = skills[titleKey];
                                            return typeof titleCandidate === "string";
                                        })
                                        .map(([key, value]) => {
                                            const titleKey = `${key}Title`;
                                            const title = (skills[titleKey] as string) || key;
                                            const list = value as any[]; // Still need cast for array content if mixed
                                            const isObjectList = typeof list[0] === "object" && list[0] !== null && 'name' in list[0];

                                            return (
                                                <GlassCard key={key} className="p-6 space-y-4 break-inside-avoid mb-6">
                                                    <Typography element="h3" className="text-sm font-semibold text-accent uppercase tracking-widest">{title}</Typography>
                                                    {isObjectList ? (
                                                        <div className="space-y-4">
                                                            {list.map((item: any) => (
                                                                <div key={item.name} className="space-y-2">
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-foreground font-medium">{item.name}</span>
                                                                        {item.level !== undefined && <span className="text-muted-foreground font-mono">{item.level}%</span>}
                                                                    </div>
                                                                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            whileInView={{ width: `${item.level ?? 0}%` }}
                                                                            transition={{ duration: 1, delay: 0.2 }}
                                                                            className="h-full bg-accent"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {list.map((item) => (
                                                                <span key={String(item)} className="px-3 py-1 text-xs font-medium rounded-xl bg-foreground/5 border border-foreground/10 text-muted-foreground hover:bg-foreground/10 transition-colors">
                                                                    {String(item)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </GlassCard>
                                            );
                                        });
                                })()}
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
