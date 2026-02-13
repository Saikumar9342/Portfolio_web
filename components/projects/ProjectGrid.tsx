"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { Project } from "@/types";

interface ProjectGridProps {
    projects: Project[];
    loading?: boolean;
}

export function ProjectGrid({ projects, loading }: ProjectGridProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {loading ? (
                    // Simple skeletal loading state
                    [1, 2].map((i) => (
                        <div key={i} className="aspect-video w-full rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                    ))
                ) : (
                    projects?.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onClick={() => handleProjectClick(project)}
                        />
                    ))
                )}
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
