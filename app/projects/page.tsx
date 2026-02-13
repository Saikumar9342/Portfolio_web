"use client";

import { motion } from "framer-motion";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Typography, Section } from "@/components/ui/layout";
import dynamic from 'next/dynamic';

export default function ProjectsPage() {
    return (
        <main className="relative min-h-screen">
            <div className="relative z-10">
                <Navbar />

                <section className="pt-32 pb-20">
                    <div className="container px-6 md:px-12 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 mb-16"
                        >
                            <Typography className="text-sm font-semibold text-accent tracking-wide uppercase">Portfolio</Typography>
                            <Typography element="h1" className="text-5xl md:text-7xl font-semibold text-foreground">
                                Selected Projects
                            </Typography>
                            <Typography className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                A collection of enterprise banking portals, internal tools, and mobile applications I&apos;ve built using modern web and mobile technologies.
                            </Typography>
                        </motion.div>

                        <ProjectGrid />
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-12 border-t border-border bg-muted/30 mt-20">
                    <div className="container px-6 mx-auto max-w-6xl text-center">
                        <Typography className="text-xs text-muted-foreground">
                            © 2024 Saikumar Pasumarthi. All rights reserved.
                        </Typography>
                    </div>
                </footer>
            </div>
        </main>
    );
}
