"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { Typography, GlassCard } from "../ui/layout";
import { X, ExternalLink, Github, Globe, Code2, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-background border border-foreground/10 w-full max-w-7xl h-full max-h-[90vh] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden relative"
                    >
                        {/* 1. HEADER BAR */}
                        <header className="px-8 py-6 border-b border-foreground/5 flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-30">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <Typography className="text-[10px] font-black uppercase tracking-[0.2em] text-accent leading-none mb-1">Project Spotlight</Typography>
                                    <Typography element="h3" className="text-xl font-bold tracking-tight text-foreground leading-none">{project.title}</Typography>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-accent hover:text-white flex items-center justify-center transition-all duration-300 group"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </header>

                        {/* 2. SCROLLABLE CONTENT */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 md:p-12 scroll-smooth">
                            <div className="max-w-6xl mx-auto space-y-16">

                                {/* Large Hero Image */}
                                <div className="relative aspect-[21/9] w-full rounded-[2rem] overflow-hidden shadow-2xl group">
                                    <Image
                                        src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                                    {/* Narrative Section */}
                                    <div className="lg:col-span-7 space-y-12">
                                        <div className="space-y-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Overview</span>
                                            </div>
                                            <Typography className="text-xl md:text-2xl font-bold text-foreground leading-tight tracking-tight">
                                                {project.description}
                                            </Typography>
                                            <div className="w-12 h-1 bg-accent/30 rounded-full" />
                                        </div>

                                        <div className="space-y-8">
                                            <Typography className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                                                {project.fullDescription || "A sophisticated solution architectural approach focused on performance, accessibility, and intuitive user experiences."}
                                            </Typography>

                                            {/* Key Highlights */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                                                <GlassCard className="p-6 border-foreground/5 hover:border-accent/20 transition-colors">
                                                    <Code2 className="w-6 h-6 text-accent mb-4" />
                                                    <Typography className="text-sm font-bold text-foreground mb-1 uppercase tracking-wider">Architecture</Typography>
                                                    <Typography className="text-xs text-muted-foreground">Modular, scalable design system approach.</Typography>
                                                </GlassCard>
                                                <GlassCard className="p-6 border-foreground/5 hover:border-accent/20 transition-colors">
                                                    <Globe className="w-6 h-6 text-accent mb-4" />
                                                    <Typography className="text-sm font-bold text-foreground mb-1 uppercase tracking-wider">Deployment</Typography>
                                                    <Typography className="text-xs text-muted-foreground">Global edge network delivery & optimization.</Typography>
                                                </GlassCard>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Information */}
                                    <div className="lg:col-span-5 space-y-8">
                                        <GlassCard className="p-8 bg-foreground/[0.02] border-foreground/5 space-y-8">
                                            <div className="grid grid-cols-2 gap-6 border-b border-foreground/5 pb-8">
                                                <div className="space-y-1">
                                                    <Typography className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Role</Typography>
                                                    <Typography className="text-sm font-bold text-foreground uppercase">{project.role || "Front End Dev"}</Typography>
                                                </div>
                                                <div className="space-y-1">
                                                    <Typography className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</Typography>
                                                    <Typography className="text-sm font-bold text-foreground uppercase">{project.category || "Work"}</Typography>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Typography className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Core Stack</Typography>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack?.map(tech => (
                                                        <span key={tech} className="px-3 py-1.5 rounded-lg bg-accent/5 border border-accent/10 text-[9px] font-bold text-accent uppercase tracking-widest">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-3 pt-4">
                                                {project.liveLink && (
                                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="block">
                                                        <Button className="w-full h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-accent/20">
                                                            View Live Demo <ExternalLink className="ml-2 w-3 h-3" />
                                                        </Button>
                                                    </a>
                                                )}
                                                {project.githubLink && (
                                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="block">
                                                        <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border-foreground/10 hover:bg-foreground/5">
                                                            GitHub Source <Github className="ml-2 w-3 h-3" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </GlassCard>

                                        {/* Status Tag */}
                                        <div className="flex items-center justify-center gap-4 py-4 px-6 rounded-2xl bg-foreground/3 border border-foreground/5 opacity-60">
                                            <Zap className="w-3 h-3 text-accent" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground">Verified Architecture</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
