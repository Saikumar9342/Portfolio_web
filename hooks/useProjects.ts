"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/types";
import { portfolioData } from "@/lib/data";

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>(portfolioData.projects as Project[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                if (!snapshot.size) {
                    // No data in Firestore yet — keep default portfolio data
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
                        techStack: data.techStack ?? [],
                        imageUrl: data.imageUrl ?? "",
                        liveLink: data.liveLink ?? "",
                        githubLink: data.githubLink ?? "",
                        createdAt,
                    };
                    return p;
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
