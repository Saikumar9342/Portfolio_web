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
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const [imgSrc, setImgSrc] = useState(project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop");

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl bg-foreground/5 cursor-pointer"
        >
            {/* Image Section */}
            <Image
                src={imgSrc}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImgSrc("https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop")}
            />

            {/* Premium Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {project.techStack?.slice(0, 3).map((tech) => (
                            <span key={tech} className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent border border-accent/30 rounded-full backdrop-blur-md">
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Typography element="h3" className="text-2xl font-black text-foreground tracking-tight uppercase">
                            {project.title}
                        </Typography>
                        <Typography className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                            {project.description}
                        </Typography>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        {project.githubLink && (
                            <Link href={project.githubLink} target="_blank" className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 text-foreground transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                        )}
                        {project.liveLink && (
                            <Link href={project.liveLink} target="_blank" className="p-2 rounded-full bg-accent/20 hover:bg-accent/30 text-accent transition-colors">
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                        )}
                        <div className="ml-auto flex items-center gap-2 text-xs font-bold text-accent tracking-widest uppercase group/btn">
                            View Details
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Static Category Tag */}
            <div className="absolute top-6 left-6 z-30 group-hover:opacity-0 transition-opacity duration-300">
                <div className="px-4 py-1.5 rounded-full bg-background/40 text-foreground/80 text-[10px] font-black tracking-widest uppercase backdrop-blur-xl border border-white/5">
                    {project.category || "Featured"}
                </div>
            </div>
        </motion.div>
    );
}
