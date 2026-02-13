"use client";

import { useState } from "react";
import { Project } from "@/types";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Typography } from "../ui/layout";

interface ProjectCardProps {
    project: Project;
    index: number;
    onClick: () => void;
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
    const [imgSrc, setImgSrc] = useState(project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop");

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={onClick}
            className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-foreground/5 cursor-pointer border border-foreground/10 hover:border-accent/30 transition-all duration-500"
        >
            {/* Image Section */}
            <Image
                src={imgSrc}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImgSrc("https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop")}
            />

            {/* Premium Overlay - More visible on hover, but present always */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Content Overlay */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.techStack?.slice(0, 3).map((tech) => (
                            <span key={tech} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground rounded-full">
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-1">
                        <Typography element="h3" className="text-xl md:text-2xl font-black text-foreground tracking-tighter uppercase leading-none">
                            {project.title}
                        </Typography>
                        <Typography className="text-xs md:text-sm text-muted-foreground line-clamp-1 font-medium group-hover:line-clamp-none transition-all duration-500">
                            {project.description}
                        </Typography>
                    </div>

                    <div className="pt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            {project.githubLink && (
                                <div className="p-2 rounded-full bg-foreground/10 text-foreground">
                                    <Github className="w-4 h-4" />
                                </div>
                            )}
                            {project.liveLink && (
                                <div className="p-2 rounded-full bg-accent/20 text-accent">
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-accent tracking-[0.2em] uppercase">
                            Explore Project
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Static Category Tag */}
            <div className="absolute top-6 left-6 z-30">
                <div className="px-4 py-1.5 rounded-full bg-background/60 text-foreground text-[10px] font-black tracking-widest uppercase backdrop-blur-xl border border-white/10">
                    {project.category || "Featured"}
                </div>
            </div>
        </motion.div>
    );
}
