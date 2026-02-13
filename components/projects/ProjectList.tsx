"use client";

import { motion } from "framer-motion";
import { Project } from "@/types";
import { Typography } from "../ui/layout";
import { ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProjectListProps {
    projects: Project[];
    onProjectClick: (project: Project) => void;
}

export function ProjectList({ projects, onProjectClick }: ProjectListProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <div className="w-full space-y-0 border-t border-foreground/10" onMouseMove={handleMouseMove}>
            {projects?.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onProjectClick(project)}
                    className="group relative flex flex-col md:flex-row items-start md:items-center justify-between py-12 border-b border-foreground/10 cursor-pointer transition-all duration-500 hover:px-8"
                >
                    {/* Background Hover Effect */}
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 w-full">
                        {/* Number & Category */}
                        <div className="flex items-center gap-4 min-w-[140px]">
                            <span className="text-xs font-black text-accent/40 uppercase tracking-widest">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                {project.category || "Featured"}
                            </span>
                        </div>

                        {/* Title & Short Desc */}
                        <div className="flex-1 space-y-2">
                            <Typography element="h3" className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none group-hover:text-accent transition-colors duration-300">
                                {project.title}
                            </Typography>
                            <div className="flex flex-wrap gap-4 pt-2">
                                {project.techStack?.slice(0, 4).map(tech => (
                                    <span key={tech} className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em] italic">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Image Preview (Floating Tooltip style) */}
                        <motion.div
                            style={{
                                position: 'fixed',
                                left: mousePosition.x,
                                top: mousePosition.y,
                                x: '-50%',
                                y: '-50%',
                                zIndex: 100,
                                pointerEvents: 'none'
                            }}
                            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                            animate={hoveredIndex === index ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -5 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="hidden lg:block w-80 aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20"
                        >
                            <Image
                                src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        {/* Action Link */}
                        <div className="flex items-center gap-4 ml-auto relative z-10">
                            <div className="w-16 h-16 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:scale-110 transition-all duration-500">
                                <Plus className="w-8 h-8 text-foreground group-hover:text-accent-foreground group-hover:rotate-90 transition-all duration-500" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
