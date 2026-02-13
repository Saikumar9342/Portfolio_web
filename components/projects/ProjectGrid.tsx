"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import { portfolioData } from "@/lib/data";

export function ProjectGrid() {
    const { projects, loading } = useProjects();

    // If loading, show skeletons (optional - for now let's just use data)
    // If no projects in Firestore, fallback to JSON data
    const displayProjects = projects.length > 0 ? projects : portfolioData.projects;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {loading && projects.length === 0 ? (
                // Simple skeletal loading state
                [1, 2].map((i) => (
                    <div key={i} className="aspect-video w-full rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                ))
            ) : (
                displayProjects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                    />
                ))
            )}
        </div>
    );
}
