"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { Typography } from "../ui/layout";
import { X, ExternalLink, Github, Globe, Code2, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                    className="fixed inset-0 z-[200] bg-background flex flex-col overflow-hidden"
                >
                    {/* Immersive Scrollable View */}
                    <div className="flex-1 overflow-y-auto">

                        {/* Hero Header */}
                        <div className="relative h-[60vh] md:h-[80vh] w-full">
                            <Image
                                src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Cinematic Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                            {/* Close Button - Clean & Fixed */}
                            <button
                                onClick={onClose}
                                className="fixed top-8 right-8 z-[210] w-14 h-14 rounded-full bg-background/50 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-background transition-colors group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                            </button>

                            {/* Floating Header Info */}
                            <div className="absolute bottom-12 left-0 w-full">
                                <div className="container px-6 md:px-12 mx-auto max-w-7xl">
                                    <div className="max-w-4xl space-y-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="flex items-center gap-4"
                                        >
                                            <span className="w-8 h-px bg-accent" />
                                            <Typography className="text-[10px] font-black text-accent tracking-[0.4em] uppercase">Detailed Case Study</Typography>
                                        </motion.div>
                                        <Typography element="h2" className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95]">
                                            {project.title}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="bg-background pt-24 pb-48">
                            <div className="container px-6 md:px-12 mx-auto max-w-7xl">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">

                                    {/* Project Narrative */}
                                    <div className="lg:col-span-7 space-y-16">
                                        <div className="space-y-12">
                                            <Typography className="text-xl md:text-2xl text-foreground font-semibold leading-relaxed">
                                                {project.description}
                                            </Typography>
                                            <div className="h-px w-full bg-foreground/10" />
                                            <Typography className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                                {project.fullDescription || "Detailed breakdown of the architectural decisions, user flow optimization, and performance considerations that went into building this interface."}
                                            </Typography>
                                        </div>
                                    </div>

                                    {/* Metadata & Actions */}
                                    <div className="lg:col-span-5 relative">
                                        <div className="sticky top-12 space-y-12">
                                            {/* Tech Stack */}
                                            <div className="space-y-4">
                                                <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Stack / Technologies</Typography>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack?.map(tech => (
                                                        <span key={tech} className="px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/5 text-xs font-bold uppercase tracking-widest text-foreground/80">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Role & Categories */}
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Role</Typography>
                                                    <Typography className="text-lg font-bold uppercase tracking-tight">
                                                        {project.role || "Lead Developer"}
                                                    </Typography>
                                                </div>
                                                <div className="space-y-4">
                                                    <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Classification</Typography>
                                                    <Typography className="text-lg font-bold uppercase tracking-tight">
                                                        {project.category || "Selected Product"}
                                                    </Typography>
                                                </div>
                                            </div>

                                            {/* Direct Actions */}
                                            <div className="pt-8 space-y-4">
                                                {project.liveLink && (
                                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                                                        <Button className="w-full h-20 rounded-[1.25rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent/20">
                                                            Launch Experience <ExternalLink className="ml-2 w-4 h-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                                {project.githubLink && (
                                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                                                        <Button variant="outline" className="w-full h-20 rounded-[1.25rem] text-xs font-black uppercase tracking-[0.2em] border-foreground/10 hover:bg-foreground/5">
                                                            View Source <Github className="ml-2 w-4 h-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
