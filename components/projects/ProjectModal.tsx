"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Github, Globe, Sparkles, X } from "lucide-react";
import { Project } from "@/types";
import { Typography } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const containerVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.9 },
    },
    exit: { opacity: 0, y: 24, scale: 0.985, transition: { duration: 0.22 } },
};

const contentVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.08 + index * 0.05, duration: 0.35 },
    }),
};

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen, onClose]);

    if (!project) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-xl px-4 py-6 md:px-8 md:py-10"
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(event) => event.stopPropagation()}
                        className="relative mx-auto flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-foreground/15 bg-background shadow-[0_40px_100px_-20px_rgba(0,0,0,0.75)]"
                    >
                        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />
                        <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-foreground/10 blur-[120px]" />

                        <header className="relative z-20 flex items-center justify-between border-b border-foreground/10 px-6 py-5 md:px-10">
                            <div className="min-w-0">
                                <Typography className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-accent">
                                    <Sparkles className="h-4 w-4" />
                                    Project Spotlight
                                </Typography>
                                <Typography element="h3" className="truncate text-xl font-black text-foreground md:text-3xl">
                                    {project.title}
                                </Typography>
                            </div>

                            <button
                                onClick={onClose}
                                aria-label="Close project modal"
                                className="ml-4 flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.04] text-foreground transition-all duration-300 hover:rotate-90 hover:border-accent/50 hover:text-accent"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </header>

                        <div className="relative z-10 grid flex-1 grid-cols-1 gap-8 overflow-y-auto px-6 py-6 md:px-10 md:py-8 lg:grid-cols-[1.15fr_0.85fr]">
                            <motion.section custom={0} variants={contentVariants} initial="hidden" animate="visible" className="space-y-7">
                                <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-foreground/10">
                                    <Image
                                        src={
                                            project.imageUrl ||
                                            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"
                                        }
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/35 px-4 py-3 backdrop-blur-md">
                                        <Typography className="text-sm font-semibold text-white">
                                            {project.description}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                                        <Typography className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                                            Role
                                        </Typography>
                                        <Typography className="text-base font-bold uppercase text-foreground">
                                            {project.role || "Software Engineer"}
                                        </Typography>
                                    </div>
                                    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
                                        <Typography className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                                            Category
                                        </Typography>
                                        <Typography className="text-base font-bold uppercase text-foreground">
                                            {project.category || "Professional Work"}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-foreground/10 bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.01] p-6">
                                    <Typography className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                                        Deep Dive
                                    </Typography>
                                    <Typography className="text-sm leading-relaxed text-muted-foreground md:text-base">
                                        {project.fullDescription ||
                                            "A production-focused implementation with attention to performance, maintainability, and robust user experience patterns."}
                                    </Typography>
                                </div>
                            </motion.section>

                            <motion.aside custom={1} variants={contentVariants} initial="hidden" animate="visible" className="space-y-6">
                                <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6">
                                    <Typography className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                                        <Globe className="h-4 w-4" />
                                        Tech Stack
                                    </Typography>
                                    <div className="flex flex-wrap gap-2">
                                        {(project.techStack?.length ? project.techStack : ["Engineering"]).map((tech, index) => (
                                            <motion.span
                                                key={tech}
                                                initial={{ opacity: 0, scale: 0.92 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.12 + index * 0.03, duration: 0.25 }}
                                                className="rounded-xl border border-accent/35 bg-accent/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-accent"
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-6">
                                    <Typography className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                                        Actions
                                    </Typography>
                                    <div className="space-y-3">
                                        {project.liveLink ? (
                                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="block">
                                                <Button className="h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-[0.18em]">
                                                    Live Preview <ExternalLink className="ml-2 h-4 w-4" />
                                                </Button>
                                            </a>
                                        ) : null}
                                        {project.githubLink ? (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="block">
                                                <Button variant="outline" className="h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-[0.18em]">
                                                    View Source <Github className="ml-2 h-4 w-4" />
                                                </Button>
                                            </a>
                                        ) : null}
                                        {!project.liveLink && !project.githubLink ? (
                                            <div className="rounded-xl border border-dashed border-foreground/20 bg-foreground/[0.03] px-4 py-3 text-center text-xs text-muted-foreground">
                                                No external links provided for this project.
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </motion.aside>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
