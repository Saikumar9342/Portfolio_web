"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import * as Icons from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Navbar } from "@/components/layout/Navbar";
import { type PortfolioContent as PortfolioDataType } from "@/hooks/usePortfolio";
import { Footer } from "@/components/layout/Footer";
import { useDynamicColor } from "@/hooks/useDynamicColor";

export const PortfolioContent = ({ data, userId }: { data: PortfolioDataType; userId?: string }) => {
    const { contact, hero, about, expertise, skills, name } = data;

    // Extract theme color from hero image or default profile
    useDynamicColor(hero?.imageUrl || "", { theme: data.theme });

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

    const renderSection = (section: string) => {
        switch (section) {
            case 'hero':
                return <Hero key="hero" data={hero} role={data.role} name={name} location={about.location} userId={userId} showImage={data.showHeroImage} />;
            case 'about':
                return <About key="about" about={about} expertise={expertise} contact={contact} />;
            case 'skills':
                return (
                    <Section key="skills" id="skills" className="min-h-screen py-24 relative overflow-hidden">

                        <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                            {/* Skill Context Panel */}
                            <div className="lg:w-1/3 space-y-8 flex flex-col items-start text-left">
                                <div className="space-y-4">
                                    <Typography className="text-[9px] font-bold text-accent tracking-[0.2em] uppercase">
                                        {skills.frameworksTitle || "Inventory"}
                                    </Typography>
                                    <Typography element="h2" className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                        {skills.title || "Technical Expertise"}
                                    </Typography>
                                    <Typography className="text-lg text-muted-foreground/80 leading-relaxed font-medium">
                                        {skills.description || "A high-performance suite of technologies engineered for scalable digital experiences."}
                                    </Typography>
                                </div>

                                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl relative overflow-hidden group w-full text-left">

                                    <div className="relative space-y-4 text-left">
                                        <Typography className="text-[9px] font-bold text-accent/50 uppercase tracking-[0.2em]">Core Frameworks</Typography>
                                        <div className="flex flex-wrap gap-2 justify-start">
                                            {skills.frameworks?.map((f: string | { name: string }) => {
                                                const name = typeof f === 'string' ? f : f.name;
                                                return (
                                                    <span key={name} className="px-4 py-2 text-[9px] font-bold rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-accent-foreground transition-all duration-300 tracking-[0.2em]">
                                                        {name}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="lg:w-2/3 md:columns-2 md:[column-gap:1.5rem] space-y-6">
                                {/* Frontend Skill Card */}
                                {skills.frontend && skills.frontend.length > 0 && (
                                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.04] transition-all duration-500 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                                        <div className="flex items-center justify-between mb-8">
                                            <Typography element="h3" className="text-lg font-bold flex items-center gap-3 text-white">
                                                <div className="w-2 h-2 rounded-full bg-accent" />
                                                {skills.frontendTitle || "Frontend Engineering"}
                                            </Typography>
                                        </div>

                                        <div className="space-y-6">
                                            {skills.frontend?.map((skill: string | { name: string; level?: number }) => {
                                                const name = typeof skill === 'string' ? skill : skill.name;
                                                const level = typeof skill === 'string' ? 85 : (skill.level ?? 85);
                                                return (
                                                    <div key={name} className="space-y-3 group/skill">
                                                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover/skill:text-accent transition-colors">
                                                            <span>
                                                                {(() => {
                                                                    const n = String(name).toUpperCase();
                                                                    if (n.includes('JAVASCRIPT') || n === 'JS') return 'JAVASCRIPT (ES6)';
                                                                    if (n.includes('TYPESCRIPT') || n === 'TS') return 'TYPESCRIPT';
                                                                    if (n === 'HTML') return 'HTML5';
                                                                    if (n === 'CSS') return 'CSS3';
                                                                    if (n === 'REACTJS' || n === 'REACT.JS') return 'REACT';
                                                                    return name;
                                                                })()}
                                                            </span>
                                                            <span className="font-mono text-[10px]">{level}%</span>
                                                        </div>
                                                        {/* Step/Signal Indicator */}
                                                        <div className="h-1.5 w-full bg-accent/5 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${level}%` }}
                                                                transition={{ duration: 1, delay: 0.2 }}
                                                                className="h-full bg-accent shadow-[0_0_8px_var(--accent)]"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}


                                <div className="space-y-4">
                                    {/* Mobile Card */}
                                    {skills.mobile && skills.mobile.length > 0 && (
                                        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all mb-6 break-inside-avoid group/mini">
                                            <div className="flex justify-between items-center mb-4">
                                                <Typography element="h3" className="text-xs font-bold tracking-wide text-white flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                    {skills.mobileTitle || "Mobile Development"}
                                                </Typography>
                                                <Icons.Smartphone className="w-4 h-4 text-accent/40" />
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.mobile?.map((m: string | { name: string }) => {
                                                    const name = typeof m === 'string' ? m : m.name;
                                                    const formattedName = (() => {
                                                        const n = String(name).toUpperCase();
                                                        if (n.includes('JAVASCRIPT') || n === 'JS') return 'JAVASCRIPT (ES6)';
                                                        if (n.includes('TYPESCRIPT') || n === 'TS') return 'TYPESCRIPT';
                                                        if (n === 'HTML') return 'HTML5';
                                                        if (n === 'CSS') return 'CSS3';
                                                        if (n === 'REACTJS' || n === 'REACT.JS') return 'REACT';
                                                        return name;
                                                    })();
                                                    return (
                                                        <span key={name} className="px-3 py-1 text-[9px] font-medium bg-white/5 border border-white/10 rounded-lg text-muted-foreground hover:border-accent/30 hover:text-white transition-all">
                                                            {formattedName}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Backend Card */}
                                    {skills.backend && skills.backend.length > 0 && (
                                        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all mb-6 break-inside-avoid group/mini">
                                            <div className="flex justify-between items-center mb-4">
                                                <Typography element="h3" className="text-xs font-bold tracking-wide text-white flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                    {skills.backendTitle || "Cloud & Backend"}
                                                </Typography>
                                                <Icons.Cpu className="w-4 h-4 text-accent/40" />
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.backend?.map((b: string | { name: string }) => {
                                                    const name = typeof b === 'string' ? b : b.name;
                                                    const formattedName = (() => {
                                                        const n = String(name).toUpperCase();
                                                        if (n.includes('JAVASCRIPT') || n === 'JS') return 'JAVASCRIPT (ES6)';
                                                        if (n.includes('TYPESCRIPT') || n === 'TS') return 'TYPESCRIPT';
                                                        if (n === 'HTML') return 'HTML5';
                                                        if (n === 'CSS') return 'CSS3';
                                                        if (n === 'REACTJS' || n === 'REACT.JS') return 'REACT';
                                                        return name;
                                                    })();
                                                    return (
                                                        <span key={name} className="px-3 py-1 text-[9px] font-medium bg-white/5 border border-white/10 rounded-lg text-muted-foreground hover:border-accent/30 hover:text-white transition-all">
                                                            {formattedName}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tools */}
                                    {skills.tools && skills.tools.length > 0 && (
                                        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 break-inside-avoid mb-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <Typography element="h3" className="text-xs font-bold tracking-wide text-white flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                    {skills.toolsTitle || "Workflow & Tools"}
                                                </Typography>
                                                <Icons.Terminal className="w-4 h-4 text-accent/40" />
                                            </div>
                                            <div className="text-[9px] text-muted-foreground/60 leading-relaxed">
                                                {skills.tools?.map((t: string | { name: string }) => typeof t === 'string' ? t : t.name).join(" | ")}
                                            </div>
                                        </div>
                                    )}


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
                                                const list = value as any[];
                                                const isObjectList = typeof list[0] === "object" && list[0] !== null && 'name' in list[0];

                                                return (
                                                    <GlassCard key={key} className="p-6 space-y-3 break-inside-avoid mb-4">
                                                        <Typography element="h3" className="text-lg font-bold">{title}</Typography>
                                                        {isObjectList ? (
                                                            <div className="space-y-3">
                                                                {list.map((item: any) => (
                                                                    <div key={item.name} className="space-y-1">
                                                                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-[0.3em] text-foreground/60">
                                                                            <span>
                                                                                {(() => {
                                                                                    const n = String(item.name).toUpperCase();
                                                                                    if (n.includes('JAVASCRIPT') || n === 'JS') return 'JAVASCRIPT (ES6)';
                                                                                    if (n.includes('TYPESCRIPT') || n === 'TS') return 'TYPESCRIPT';
                                                                                    if (n === 'HTML') return 'HTML5';
                                                                                    if (n === 'CSS') return 'CSS3';
                                                                                    if (n === 'REACTJS' || n === 'REACT.JS') return 'REACT';
                                                                                    return item.name;
                                                                                })()}
                                                                            </span>
                                                                            {item.level !== undefined && <span>{item.level}%</span>}
                                                                        </div>
                                                                        <div className="h-1 w-full bg-accent/5 rounded-full overflow-hidden">
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
                                                                    <span key={String(item)} className="px-3 py-1 text-xs rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/80">
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
                );
            case 'projects':
                return null; // The dedicated projects page will handle this, or we can make a featured projects section later
            case 'expertise':
                return null; // Merged into about
            default:
                return null;
        }
    };

    return (
        <main ref={containerRef} className={`relative min-h-screen theme-${data.theme || "dark"}`}>
            <div className="relative z-10 bg-background text-foreground transition-colors duration-500">
                <Navbar name={name} data={data.navbar} contact={contact} loading={false} userId={userId} />

                {data.layoutOrder ? data.layoutOrder.map(renderSection) : (
                    <>
                        <Hero data={hero} role={data.role} name={name} location={about.location} userId={userId} showImage={data.showHeroImage} />
                        <About about={about} expertise={expertise} contact={contact} />
                        {renderSection("skills")}
                    </>
                )}


                {/* FOOTER */}
                <Footer contact={contact} about={about} navbar={data.navbar} name={name} targetUserId={userId} />
            </div>
        </main>
    );
};
