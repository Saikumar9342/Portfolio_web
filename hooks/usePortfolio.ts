"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project, HeroData, AboutData, ExpertiseData, SkillsData, ContactData, NavbarData, SocialLink } from "@/types";
import { portfolioData } from "@/lib/data";

export interface PortfolioContent {
    hero: HeroData;
    about: AboutData;
    expertise: ExpertiseData;
    skills: SkillsData;
    contact: ContactData;
    navbar: NavbarData;
    projects: Project[];
    name: string;
    role: string;
}

const allowedPlatforms = new Set<SocialLink["platform"]>([
    "linkedin",
    "github",
    "twitter",
    "instagram",
    "other",
]);

function normalizeSocialLinks(input: any): SocialLink[] {
    if (!Array.isArray(input)) return [];
    return input
        .map((item) => {
            const platformRaw = String(item?.platform ?? "").toLowerCase();
            const platform = allowedPlatforms.has(platformRaw as SocialLink["platform"])
                ? (platformRaw as SocialLink["platform"])
                : "other";
            const url = String(item?.url ?? "").trim();
            if (!url) return null;
            return { platform, url } as SocialLink;
        })
        .filter(Boolean) as SocialLink[];
}

const emptyData: PortfolioContent = {
    hero: {
        badge: portfolioData.hero.badge,
        title: portfolioData.hero.title,
        subtitle: portfolioData.hero.subtitle,
        cta: portfolioData.hero.cta,
        secondaryCta: portfolioData.hero.secondaryCta,
        imageUrl: ""
    },
    about: {
        title: portfolioData.about.title,
        biography: portfolioData.about.biography,
        education: portfolioData.about.education,
        location: portfolioData.about.location,
        interests: portfolioData.about.interests,
        socialLinks: normalizeSocialLinks(portfolioData.about.socialLinks)
    },
    expertise: {
        title: portfolioData.expertise.title,
        label: portfolioData.expertise.label,
        stats: portfolioData.expertise.stats,
        services: portfolioData.expertise.services
    },
    skills: {
        frontendTitle: portfolioData.skills.frontendTitle,
        mobileTitle: portfolioData.skills.mobileTitle,
        backendTitle: portfolioData.skills.backendTitle,
        toolsTitle: portfolioData.skills.toolsTitle,
        frameworksTitle: portfolioData.skills.frameworksTitle,
        title: "Technical Expertise",
        description: "A comprehensive suite of technologies I use to build robust, scalable, and secure digital products.",
        frontend: portfolioData.skills.frontend,
        frameworks: portfolioData.skills.frameworks,
        mobile: portfolioData.skills.mobile,
        backend: portfolioData.skills.backend,
        tools: portfolioData.skills.tools
    },
    contact: {
        title: portfolioData.contact.title,
        description: portfolioData.contact.description,
        email: portfolioData.contact.email,
        personalEmail: portfolioData.contact.personalEmail,
        cta: portfolioData.contact.cta,
        secondaryCta: portfolioData.contact.secondaryCta,
        resumeUrl: ""
    },
    navbar: { logoText: "S", ctaText: "Hire Me", items: [] },
    projects: portfolioData.projects as Project[],
    name: portfolioData.name,
    role: portfolioData.role
};

export function usePortfolio(userId?: string) {
    const [data, setData] = useState<PortfolioContent>(emptyData);

    // Track loading state for different parts
    const [contentLoaded, setContentLoaded] = useState(false);
    const [projectsLoaded, setProjectsLoaded] = useState(false);

    useEffect(() => {
        // Determine collection references
        const contentRef = userId
            ? collection(db, "users", userId, "content")
            : collection(db, "content");

        const projectsRef = userId
            ? collection(db, "users", userId, "projects")
            : collection(db, "projects");

        // Listen to Content
        const contentUnsub = onSnapshot(contentRef, (snapshot) => {
            if (snapshot.empty) {
                console.log("No content found in Firestore");
                // If it's a specific user, maybe they haven't set up content yet.
                // We could set some defaults or empty state, but keeping emptyData is fine for now.
                setContentLoaded(true);
                return;
            }

            const newContent: any = {};
            snapshot.forEach(doc => {
                const docData = doc.data();
                const id = doc.id;

                if (id === 'skills') {
                    newContent[id] = { ...emptyData.skills, ...docData };
                } else if (id === 'about') {
                    const socialLinks = normalizeSocialLinks(docData.socialLinks);
                    newContent[id] = { ...emptyData.about, ...docData, socialLinks };
                } else if (id === 'expertise') {
                    newContent[id] = { ...emptyData.expertise, ...docData };
                } else if (id === 'hero') {
                    newContent[id] = { ...emptyData.hero, ...docData };
                } else if (id === 'contact') {
                    const d = docData;
                    newContent[id] = {
                        title: d.title || emptyData.contact.title,
                        description: d.description || emptyData.contact.description,
                        email: d.email || emptyData.contact.email,
                        personalEmail: d.personalEmail || emptyData.contact.personalEmail,
                        cta: d.cta || emptyData.contact.cta,
                        secondaryCta: d.secondaryCta || emptyData.contact.secondaryCta,
                        resumeUrl: d.resumeUrl || "",
                    } as ContactData;
                } else if (id === 'navbar') {
                    newContent[id] = { ...emptyData.navbar, ...docData };
                } else if (id === 'personal') {
                    newContent.name = docData.name || emptyData.name;
                    newContent.role = docData.role || emptyData.role;
                } else {
                    newContent[id] = docData;
                }
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

        // Listen to Projects
        const q = query(projectsRef, orderBy("createdAt", "desc"));
        const projectsUnsub = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setData(prev => ({ ...prev, projects: [] }));
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
                    fullDescription: d.fullDescription || "",
                    role: d.role || "",
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
    }, [userId]); // Add userId to dependency array

    const isLoading = !contentLoaded || !projectsLoaded;

    return { data, loading: isLoading };
}
