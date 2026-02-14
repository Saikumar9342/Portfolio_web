"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Navbar } from "@/components/layout/Navbar";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Footer } from "@/components/layout/Footer";
import * as Icons from "lucide-react";

import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useDynamicColor } from "@/hooks/useDynamicColor";

const PortfolioContent = ({ data }: { data: any }) => {
    const { contact, hero, about, expertise, skills, name, projects } = data;

    // Extract theme color from hero image or default profile
    const { isLoading: themeLoading } = useDynamicColor(hero?.imageUrl || "/pfp.jpeg");

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
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
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
                        </motion.div>

                        <div className="lg:col-span-2 md:columns-2 md:[column-gap:1rem]">
                            {/* Frontend Skill Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <GlassCard className="p-8 space-y-6 hover:border-accent/40 transition-all duration-500 break-inside-avoid mb-6">
                                    <Typography element="h3" className="text-xl font-bold text-foreground flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        {skills.frontendTitle || "Frontend Engineering"}
                                    </Typography>
                                    <div className="space-y-6">
                                        {skills.frontend?.map((skill: any) => {
                                            const IconComponent = (Icons as any)[skill.icon] || Icons.Circle;
                                            return (
                                                <div key={skill.name} className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-foreground font-medium flex items-center gap-2">
                                                            <IconComponent className="w-4 h-4 text-accent" />
                                                            {skill.name}
                                                        </span>
                                                        <span className="text-muted-foreground font-mono">{skill.level}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${skill.level}%` }}
                                                            transition={{ duration: 1, delay: 0.2 }}
                                                            viewport={{ once: true }}
                                                            className="h-full bg-accent"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </GlassCard>
                            </motion.div>

                            <div className="space-y-4">
                                {/* Mobile & Backend Cards */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <GlassCard className="p-6 space-y-4 break-inside-avoid mb-6">
                                        <Typography element="h3" className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            {skills.mobileTitle || "Mobile Development"}
                                        </Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.mobile?.map((m: any) => {
                                                const itemName = typeof m === 'string' ? m : m.name;
                                                const itemIcon = typeof m === 'object' ? m.icon : null;
                                                const IconComponent = itemIcon ? (Icons as any)[itemIcon] : null;

                                                return (
                                                    <span key={itemName} className="px-3 py-1 text-xs font-medium rounded-xl bg-foreground/5 border border-foreground/10 text-muted-foreground hover:bg-foreground/10 transition-colors flex items-center gap-1.5">
                                                        {IconComponent && <IconComponent className="w-3 h-3 text-accent" />}
                                                        {itemName}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </GlassCard>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <GlassCard className="p-6 space-y-4 break-inside-avoid mb-6">
                                        <Typography element="h3" className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            {skills.backendTitle || "Cloud & Backend"}
                                        </Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.backend?.map((b: any) => {
                                                const itemName = typeof b === 'string' ? b : b.name;
                                                const itemIcon = typeof b === 'object' ? b.icon : null;
                                                const IconComponent = itemIcon ? (Icons as any)[itemIcon] : null;

                                                return (
                                                    <span key={itemName} className="px-3 py-1 text-xs font-medium rounded-xl bg-foreground/5 border border-foreground/10 text-muted-foreground hover:bg-foreground/10 transition-colors flex items-center gap-1.5">
                                                        {IconComponent && <IconComponent className="w-3 h-3 text-accent" />}
                                                        {itemName}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </GlassCard>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <GlassCard className="p-6 space-y-4 break-inside-avoid mb-6">
                                        <Typography element="h3" className="text-xl font-bold text-foreground flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            {skills.toolsTitle || "Workflow & Tools"}
                                        </Typography>
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground font-medium">
                                            {skills.tools?.join(" • ")}
                                        </div>
                                    </GlassCard>
                                </motion.div>

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
                                                <motion.div
                                                    key={key}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <GlassCard className="p-6 space-y-4 break-inside-avoid mb-6">
                                                        <Typography element="h3" className="text-xl font-bold text-foreground flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                                            {title}
                                                        </Typography>
                                                        {isObjectList ? (
                                                            <div className="space-y-4">
                                                                {list.map((item: any) => {
                                                                    const IconComponent = item.icon ? (Icons as any)[item.icon] : Icons.Circle;
                                                                    return (
                                                                        <div key={item.name} className="space-y-2">
                                                                            <div className="flex justify-between text-sm">
                                                                                <span className="text-foreground font-medium flex items-center gap-2">
                                                                                    <IconComponent className="w-4 h-4 text-accent" />
                                                                                    {item.name}
                                                                                </span>
                                                                                <span className="text-muted-foreground font-mono">{item.level}%</span>
                                                                            </div>
                                                                            <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                                                                <motion.div
                                                                                    initial={{ width: 0 }}
                                                                                    whileInView={{ width: `${item.level}%` }}
                                                                                    transition={{ duration: 1, delay: 0.2 }}
                                                                                    viewport={{ once: true }}
                                                                                    className="h-full bg-accent"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2">
                                                                {list.map((item: string) => (
                                                                    <span key={item} className="px-3 py-1 text-xs font-medium rounded-xl bg-foreground/5 border border-foreground/10 text-muted-foreground hover:bg-foreground/10 transition-colors">
                                                                        {item}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </GlassCard>
                                                </motion.div>
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

    // We need to move the hook usage here to control the loading screen from the top level
    // Extract theme color from hero image or default profile
    const { isLoading: themeLoading } = useDynamicColor(data?.hero?.imageUrl || "/pfp.jpeg");

    if (loading || themeLoading) return <LoadingScreen />;

    return <PortfolioContent data={data} />;
}
