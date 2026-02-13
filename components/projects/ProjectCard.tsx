"use client";

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
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group block relative"
        >
            <div className="space-y-6">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-foreground/5 mb-6">
                    {project.imageUrl && (
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105"
                        />
                    )}

                    {/* Category Pill */}
                    <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 rounded-full bg-background/80 text-foreground text-xs font-semibold shadow-md border border-foreground/10 backdrop-blur-md">
                            {project.category || "Featured"}
                        </div>
                    </div>
                </div>

                {/* Info Container */}
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                        <Typography element="h3" className="text-lg font-bold text-foreground transition-colors">
                            {project.title}
                        </Typography>
                        <Typography className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                            {project.description}
                        </Typography>
                    </div>

                    {/* Index */}
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">{project.id}</span>
                </div>
            </div>

            {/* Quick Link Overlay on entire card if needed, or structured links */}
            <div className="absolute inset-0 z-20 pointer-events-none" />
        </motion.div>
    );
}
