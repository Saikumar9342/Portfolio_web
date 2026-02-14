"use client";

import { motion } from "framer-motion";
import { Project } from "@/types";
import { Typography } from "../ui/layout";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

interface ProjectShowcaseProps {
    projects: Project[];
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
    return (
        <div className="space-y-32 md:space-y-64">
            {projects?.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={`group flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
                >
                    {/* Image Section - The "Stage" */}
                    <Link
                        href={`/projects/${project.id}`}
                        className="relative w-full lg:w-3/5 cursor-pointer block"
                    >
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-accent/20 rounded-[2.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 transform transition-all duration-700 group-hover:scale-[0.98] group-hover:shadow-2xl group-hover:border-accent/30">
                            <Image
                                src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                            />
                            {/* Sophisticated Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent opacity-60" />
                        </div>
                    </Link>

                    {/* Content Section - The "Story" */}
                    <div className="w-full lg:w-2/5 space-y-8">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3"
                            >
                                <span className="h-px w-8 bg-accent/50" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
                                    0{(index + 1)} / {project.category || "Design + Dev"}
                                </span>
                            </motion.div>

                            <Typography element="h3" className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-foreground">
                                {project.title}
                            </Typography>
                        </div>

                        <Typography className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium line-clamp-4">
                            {project.description}
                        </Typography>

                        <div className="flex flex-wrap gap-4 pt-2">
                            {project.techStack?.slice(0, 4).map(tech => (
                                <span key={tech} className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] relative group-hover:text-foreground transition-colors">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="pt-8">
                            <Link
                                href={`/projects/${project.id}`}
                                className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em] text-foreground hover:text-accent transition-colors"
                            >
                                <span>Explore Project</span>
                                <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-500 group-hover:scale-110">
                                    <ArrowUpRight className="w-5 h-5 group-hover:text-accent-foreground transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
