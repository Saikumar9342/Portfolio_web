"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Navbar } from "@/components/layout/Navbar";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Footer } from "@/components/layout/Footer";

import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { NotFoundScreen } from "@/components/ui/NotFoundScreen";
import { useDynamicColor } from "@/hooks/useDynamicColor";
import { useParams } from "next/navigation";

const PortfolioContent = ({ data, userId }: { data: any; userId?: string }) => {
    const { contact, hero, about, expertise, skills, name } = data;

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
                <Navbar name={name} data={data.navbar} contact={contact} loading={false} userId={userId} />

                {/* HERO */}
                <Hero data={hero} role={data.role} name={name} location={about.location} userId={userId} />

                {/* ABOUT SECTION */}
                <About about={about} expertise={expertise} contact={contact} />

                {/* SKILLS SECTION */}
                <Section id="skills" className="min-h-screen flex items-center py-24 border-t border-border/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
                        <GlassCard className="p-8 space-y-6 self-start">
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

                        <div className="lg:col-span-2 md:columns-2 md:[column-gap:1rem]">
                            {/* Frontend Skill Card */}
                            {skills.frontend && skills.frontend.length > 0 && (
                                <GlassCard className="p-6 space-y-4 hover:border-accent/40 transition-all duration-500 break-inside-avoid mb-4">
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
                            )}

                            <div className="space-y-4">
                                {/* Mobile & Backend Cards */}
                                {skills.mobile && skills.mobile.length > 0 && (
                                    <GlassCard className="p-6 space-y-3 break-inside-avoid mb-4">
                                        <Typography element="h3" className="text-lg font-bold">{skills.mobileTitle || "Mobile Development"}</Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.mobile?.map((m: string) => (
                                                <span key={m} className="px-3 py-1 text-xs rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/80">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </GlassCard>
                                )}

                                {skills.backend && skills.backend.length > 0 && (
                                    <GlassCard className="p-6 space-y-3 break-inside-avoid mb-4">
                                        <Typography element="h3" className="text-lg font-bold">{skills.backendTitle || "Cloud & Backend"}</Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.backend?.map((b: string) => (
                                                <span key={b} className="px-3 py-1 text-xs rounded-lg bg-foreground/5 border border-foreground/10 text-foreground/80">
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </GlassCard>
                                )}

                                {skills.tools && skills.tools.length > 0 && (
                                    <GlassCard className="p-6 space-y-3 break-inside-avoid mb-4">
                                        <Typography element="h3" className="text-lg font-bold">{skills.toolsTitle || "Workflow & Tools"}</Typography>
                                        <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                                            {skills.tools?.join(" | ")}
                                        </div>
                                    </GlassCard>
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
                                                                    <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-foreground/60">
                                                                        <span>{item.name}</span>
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

                {/* FOOTER */}
                <Footer contact={contact} about={about} navbar={data.navbar} name={name} targetUserId={userId} />
            </div>
        </main>
    );
};

export default function UserPortfolio() {
    const params = useParams();
    // Safely extract userId, assuming the dynamic route is [userId]
    const userId = params?.userId as string | undefined;

    // Use empty string fallback if needed, but hook handles undefined
    const { data, loading, notFound, resolvedUid } = usePortfolio(userId);

    if (loading) return <LoadingScreen />;
    if (notFound) return <NotFoundScreen />;

    // Use resolved UID if available (for username URLs), otherwise fallback to param userId
    const effectiveUserId = resolvedUid || userId;

    return <PortfolioContent data={data} userId={effectiveUserId} />;
}
