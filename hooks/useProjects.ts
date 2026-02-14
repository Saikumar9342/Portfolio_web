"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/types";
import { portfolioData } from "@/lib/data";

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>(portfolioData.projects as Project[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const projectsRef = collection(db, "projects");

        const unsubscribe = onSnapshot(
            projectsRef,
            (snapshot) => {
                if (!snapshot.size) {
                    // No data in Firestore yet - keep default portfolio data
                    setLoading(false);
                    return;
                }

                const projectsData = snapshot.docs.map((doc) => {
                    const data = doc.data() as DocumentData;
                    // Map Firestore Timestamp to Date if present
                    const createdAt = data.createdAt && typeof (data.createdAt as any).toDate === 'function'
                        ? (data.createdAt as any).toDate()
                        : data.createdAt;

                    const p: Project = {
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        fullDescription: data.fullDescription ?? "",
                        role: data.role ?? "",
                        techStack: data.techStack ?? [],
                        imageUrl: data.imageUrl ?? "",
                        liveLink: data.liveLink ?? "",
                        githubLink: data.githubLink ?? "",
                        category: data.category ?? "",
                        createdAt,
                    };
                    return p;
                }).sort((a, b) => {
                    const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                    const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                    return bTime - aTime;
                }) as Project[];

                setProjects(projectsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching projects:", err);
                setError("Failed to load projects");
                // Keep default data if offline or Firestore fails
                setProjects(portfolioData.projects as Project[]);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { projects, loading, error };
}
