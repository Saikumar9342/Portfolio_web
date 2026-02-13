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

export default function Home() {
    const { data, loading } = usePortfolio();
    const { contact, hero, about, expertise, skills, name, projects } = data;
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

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <Typography className="text-xl font-bold animate-pulse">Syncing Portfolio...</Typography>
                </div>
            </div>
        );
    }

    return (
        <main ref={containerRef} className="relative min-h-screen">
            <div className="relative z-10">
                <Navbar name={name} data={data.navbar} contact={contact} loading={loading} />

                {/* HERO */}
                <Hero data={hero} role={data.role} name={name} location={about.location} />

                {/* ABOUT SECTION (REPLACING PREVIOUS ABOUT) */}
                <About about={about} expertise={expertise} contact={contact} />

                {/* SKILLS SECTION */}
                {/* SKILLS SECTION */}
                <Section id="skills" className="py-24 border-t border-border/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <GlassCard className="h-full p-8 flex flex-col justify-center space-y-6">
                            <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">{skills.frameworksTitle || "Toolbox"}</Typography>
                            <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                Technical Expertise
                            </Typography>
                            <Typography className="text-lg text-muted-foreground leading-relaxed">
                                A comprehensive suite of technologies I use to build robust, scalable, and secure digital products.
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

                {/* CALL TO ACTION */}
                <Section id="projects" className="py-24 border-t border-border/50">
                    <div className="space-y-12">
                        <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center md:text-left">
                            Featured Projects
                        </Typography>
                        <ProjectGrid projects={projects} loading={loading} />
                    </div>
                </Section>

                {/* CALL TO ACTION */}
                <section className="py-24 border-t border-foreground/10 bg-foreground/5">
                    <div className="container px-6 mx-auto max-w-4xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground">
                                {contact.title}
                            </Typography>

                            <Typography className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                {contact.description}
                            </Typography>

                            <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
                                <Button size="lg" className="rounded-full px-12 h-14 text-base font-semibold shadow-lg shadow-accent/20">
                                    {contact.cta}
                                </Button>
                                <a
                                    href="/Saikumar.p_FrontendDeveloper.pdf"
                                    target="_blank"
                                    className="rounded-full px-12 h-14 flex items-center justify-center font-semibold border border-foreground/10 hover:border-foreground/30 bg-foreground/5 hover:bg-foreground/10 text-foreground transition-all duration-300"
                                >
                                    {contact.secondaryCta}
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-20 border-t border-foreground/10 bg-background relative overflow-hidden">
                    <div className="container px-6 mx-auto max-w-6xl relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
                            {/* Brand Column */}
                            <div className="md:col-span-5 space-y-6">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-2xl shadow-accent/20">
                                        <span className="text-accent-foreground font-black text-2xl">S</span>
                                    </div>
                                    <span className="text-xl font-bold tracking-tighter text-foreground uppercase">{name}</span>
                                </Link>
                                <Typography className="text-muted-foreground leading-relaxed max-w-sm">
                                    Associate Software Engineer specializing in building resilient financial interfaces and cross-platform mobile experiences.
                                </Typography>
                                <div className="flex items-center gap-3 pt-4">
                                    {about.socialLinks?.map((link) => (
                                        <Link key={link.url} href={link.url} target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-accent/20 hover:text-accent transition-all duration-300">
                                            {link.platform.toLowerCase() === 'github' && <Github className="w-5 h-5" />}
                                            {link.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-5 h-5" />}
                                            {link.platform.toLowerCase() === 'twitter' && <Twitter className="w-5 h-5" />}
                                            {['github', 'linkedin', 'twitter'].indexOf(link.platform.toLowerCase()) === -1 && <Globe className="w-5 h-5" />}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="md:col-span-3 space-y-6">
                                <Typography className="text-xs font-black uppercase tracking-[0.3em] text-accent">Navigation</Typography>
                                <ul className="space-y-4">
                                    {data.navbar.items.map((item: any) => (
                                        <li key={item.label}>
                                            <Link href={item.href} className="text-sm text-foreground/60 hover:text-accent transition-colors font-medium">
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Contact Info */}
                            <div className="md:col-span-4 space-y-6">
                                <Typography className="text-xs font-black uppercase tracking-[0.3em] text-accent">Get in Touch</Typography>
                                <div className="space-y-4">
                                    <a href={`mailto:${contact.email}`} className="block text-sm text-foreground/80 hover:text-accent transition-colors font-medium">
                                        {contact.email}
                                    </a>
                                    <Typography className="text-sm text-foreground/60 leading-relaxed">
                                        {about.location}
                                    </Typography>
                                    <div className="pt-4">
                                        <Button size="sm" className="rounded-full px-6 font-bold" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                            Back to Top
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-20 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span>© {new Date().getFullYear()} {name}. Built for Performance.</span>
                            <div className="flex gap-8">
                                <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
                                <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
