"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project, HeroData, AboutData, ExpertiseData, SkillsData, ContactData, NavbarData } from "@/types";

export interface PortfolioContent {
    hero: HeroData;
    about: AboutData;
    expertise: ExpertiseData;
    skills: SkillsData;
    contact: ContactData;
    projects: Project[];
    name: string;
    role: string;
}

const emptyData: PortfolioContent = {
    hero: { badge: "", title: "", subtitle: "", cta: "", secondaryCta: "" },
    about: { title: "", biography: "", education: [], location: "", interests: [] },
    expertise: { title: "", label: "", stats: [], services: [] },
    skills: {
        frontendTitle: "Frontend Engineering",
        mobileTitle: "Mobile Development",
        backendTitle: "Cloud & Backend",
        toolsTitle: "Workflow & Tools",
        frameworksTitle: "Toolbox",
        frontend: [],
        frameworks: [],
        mobile: [],
        backend: [],
        tools: []
    },
    contact: { title: "", description: "", email: "", personalEmail: "", cta: "", secondaryCta: "" },
    projects: [],
    name: "",
    role: ""
};

export function usePortfolio() {
    const [data, setData] = useState<PortfolioContent>(emptyData);

    // Track loading state for different parts
    const [contentLoaded, setContentLoaded] = useState(false);
    const [projectsLoaded, setProjectsLoaded] = useState(false);

    useEffect(() => {
        // Listen to 'content' collection
        const contentUnsub = onSnapshot(collection(db, "content"), (snapshot) => {
            if (snapshot.empty) {
                console.log("No content found in Firestore");
                setContentLoaded(true); // Treat as loaded even if empty
                return;
            }

            const newContent: any = {};
            snapshot.forEach(doc => {
                newContent[doc.id] = doc.data();
            });

            setData(prev => ({
                ...prev,
                ...newContent
            }));
            setContentLoaded(true);
        }, (error) => {
            console.error("Error fetching content:", error);
            setContentLoaded(true); // Stop loading on error
        });

        // Listen to 'projects' collection
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const projectsUnsub = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setProjectsLoaded(true);
                return;
            }

            const projects = snapshot.docs.map(doc => {
                const d = doc.data();
                // Handle timestamp conversion safely
                let createdAt = d.createdAt;
                if (createdAt && typeof createdAt.toDate === 'function') {
                    createdAt = createdAt.toDate();
                }

                return {
                    id: doc.id,
                    title: d.title,
                    description: d.description,
                    techStack: d.techStack || [],
                    imageUrl: d.imageUrl || "",
                    liveLink: d.liveLink || "",
                    githubLink: d.githubLink || "",
                    category: d.category || "",
                    createdAt
                } as Project;
            });

            setData(prev => ({ ...prev, projects }));
            setProjectsLoaded(true);
        }, (error) => {
            console.error("Error fetching projects:", error);
            setProjectsLoaded(true);
        });

        return () => {
            contentUnsub();
            projectsUnsub();
        };
    }, []);

    const isLoading = !contentLoaded || !projectsLoaded;

    return { data, loading: isLoading };
}
