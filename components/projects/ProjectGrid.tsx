"use client";

// import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
// import { portfolioData } from "@/lib/data";
import { Project } from "@/types";

interface ProjectGridProps {
    projects: Project[];
    loading?: boolean;
}

export function ProjectGrid({ projects, loading }: ProjectGridProps) {
    // const { projects, loading } = useProjects();
    // const displayProjects = projects.length > 0 ? projects : portfolioData.projects;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {loading ? (
                // Simple skeletal loading state
                [1, 2].map((i) => (
                    <div key={i} className="aspect-video w-full rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                ))
            ) : (
                projects.map((project, index) => (
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
