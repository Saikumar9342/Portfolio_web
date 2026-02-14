"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Navbar } from "@/components/layout/Navbar";
import { Typography } from "@/components/ui/layout";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Project } from "@/types";
import { useDynamicColor } from "@/hooks/useDynamicColor";
import { Footer } from "@/components/layout/Footer";

import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function ProjectsPage() {
    const { data, loading } = usePortfolio();
    const { projects, name, contact, about, hero } = data;

    // Apply dynamic theme based on first project or hero profile
    const firstProjectImage = projects?.length > 0 ? projects[0].imageUrl : null;
    const { isLoading: themeLoading } = useDynamicColor(firstProjectImage || hero?.imageUrl || "/pfp.jpeg");

    if (loading || themeLoading) return <LoadingScreen />;

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
                                    <Typography className="text-xs font-bold text-accent tracking-[0.5em] uppercase">{data.projectsPage.label || "Works Portfolio"}</Typography>
                                </div>
                                <Typography element="h1" className="text-6xl md:text-8xl lg:text-8xl font-bold text-foreground leading-[0.9] uppercase tracking-tighter">
                                    {data.projectsPage.title || "Selected"}<br />
                                    <span className="text-transparent border-t-0 bg-clip-text bg-gradient-to-r from-foreground to-foreground/40">{data.projectsPage.titleHighlight || "Works"}</span>
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="pl-2"
                            >
                                <Typography className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium max-w-2xl">
                                    {data.projectsPage.description || "A curated collection of digital experiences, focusing on high-performance interfaces and elegant mobile interactions."}
                                </Typography>
                            </motion.div>
                        </div>

                        {/* Cinematic Gallery Section */}
                        <div className="mt-48 mb-64">
                            <ProjectShowcase
                                projects={projects}
                            />
                        </div>
                    </div>
                </section>

                {/* COMBINED CONTACT & FOOTER */}
                <Footer contact={contact} about={about} navbar={data.navbar} name={name} />
            </div>
        </main>
    );
}
