"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Navbar } from "@/components/layout/Navbar";
import { Typography, Section } from "@/components/ui/layout";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Project } from "@/types";
import { Github, Linkedin, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDynamicColor } from "@/hooks/useDynamicColor";

export default function ProjectsPage() {
    const { data, loading } = usePortfolio();
    const { projects, name, contact, about, hero } = data;
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Apply dynamic theme based on first project or hero profile
    const firstProjectImage = projects?.length > 0 ? projects[0].imageUrl : null;
    useDynamicColor(firstProjectImage || hero?.imageUrl || "/pfp.jpeg");

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <Typography className="text-xl font-bold animate-pulse uppercase tracking-[0.2em]">Loading...</Typography>
                </div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
            <div className="relative z-10">
                <Navbar name={name} data={data.navbar} contact={contact} loading={loading} />

                {/* Sophisticated Header */}
                <section className="pt-48 pb-12">
                    <div className="container px-6 md:px-12 mx-auto max-w-7xl">
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="w-12 h-px bg-accent/50" />
                                    <Typography className="text-[10px] font-black text-accent tracking-[0.5em] uppercase">Works Portfolio</Typography>
                                </div>
                                <Typography element="h1" className="text-6xl md:text-8xl lg:text-9xl font-black text-foreground leading-[0.9] uppercase tracking-tighter">
                                    Selected<br />
                                    <span className="text-transparent border-t-0 bg-clip-text bg-gradient-to-r from-foreground to-foreground/40">Works</span>
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="pl-2"
                            >
                                <Typography className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium max-w-2xl">
                                    A curated collection of digital experiences, focusing on high-performance interfaces and elegant mobile interactions.
                                </Typography>
                            </motion.div>
                        </div>

                        {/* Cinematic Gallery Section */}
                        <div className="mt-48 mb-64">
                            <ProjectShowcase
                                projects={projects}
                                onProjectClick={handleProjectClick}
                            />
                        </div>
                    </div>
                </section>

                <ProjectModal
                    project={selectedProject}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

                {/* COMBINED CONTACT & FOOTER */}
                <footer id="contact" className="py-24 border-t border-foreground/10 bg-foreground/5 relative overflow-hidden">
                    <div className="container px-6 mx-auto max-w-6xl relative z-10">
                        <div className="mb-24 text-center space-y-8 max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <Typography element="h2" className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
                                    {contact.title}
                                </Typography>
                                <Typography className="text-lg text-muted-foreground leading-relaxed">
                                    {contact.description}
                                </Typography>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <Button size="lg" className="rounded-2xl px-12 h-16 text-sm font-black uppercase tracking-widest shadow-2xl shadow-accent/20">
                                        {contact.cta}
                                    </Button>
                                    <a
                                        href="/Saikumar.p_FrontendDeveloper.pdf"
                                        target="_blank"
                                        className="rounded-2xl px-12 h-16 flex items-center justify-center text-sm font-black uppercase tracking-widest border border-foreground/10 hover:bg-foreground/10 text-foreground transition-all duration-300"
                                    >
                                        {contact.secondaryCta}
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 pt-20 border-t border-foreground/10">
                            <div className="md:col-span-5 space-y-6">
                                <Link href="/" className="flex items-center gap-3 group">
                                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-2xl shadow-accent/20">
                                        <span className="text-accent-foreground font-black text-2xl">S</span>
                                    </div>
                                    <span className="text-xl font-bold tracking-tighter text-foreground uppercase">{name}</span>
                                </Link>
                                <Typography className="text-muted-foreground leading-relaxed max-w-sm font-medium">
                                    Associate Software Engineer specializing in building resilient financial interfaces and cross-platform mobile experiences.
                                </Typography>
                                <div className="flex items-center gap-4 pt-4">
                                    {about.socialLinks?.map((link) => (
                                        <Link key={link.url} href={link.url} target="_blank" className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-500 border border-foreground/5">
                                            {link.platform.toLowerCase() === 'github' && <Github className="w-5 h-5" />}
                                            {link.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-5 h-5" />}
                                            {['github', 'linkedin'].indexOf(link.platform.toLowerCase()) === -1 && <Globe className="w-5 h-5" />}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-8">
                                <Typography className="text-xs font-black uppercase tracking-[0.3em] text-accent">Links</Typography>
                                <ul className="space-y-4">
                                    {data.navbar?.items.map((item: any) => (
                                        <li key={item.label}>
                                            <Link href={item.href} className="text-sm text-foreground/60 hover:text-accent transition-colors font-bold uppercase tracking-widest">
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="md:col-span-4 space-y-8">
                                <Typography className="text-xs font-black uppercase tracking-[0.3em] text-accent">Contact</Typography>
                                <div className="space-y-6">
                                    <a href={`mailto:${contact.email}`} className="block text-xl font-black text-foreground hover:text-accent transition-colors tracking-tight">
                                        {contact.email}
                                    </a>
                                    <Typography className="text-sm text-foreground/60 leading-relaxed font-medium">
                                        {about.location}
                                    </Typography>
                                    <div className="pt-4">
                                        <Button size="sm" variant="outline" className="rounded-xl px-6 font-black uppercase tracking-widest text-[10px]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                            Back to Top
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-24 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                            <span>© {new Date().getFullYear()} {name}. All Rights Reserved.</span>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
