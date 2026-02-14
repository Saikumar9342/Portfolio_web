"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project, HeroData, AboutData, ExpertiseData, SkillsData, ContactData, NavbarData, SocialLink, ProjectsPageData } from "@/types";
import { portfolioData } from "@/lib/data";
import { useLanguage } from "@/context/LanguageContext";

export interface PortfolioContent {
    hero: HeroData;
    about: AboutData;
    expertise: ExpertiseData;
    skills: SkillsData;
    contact: ContactData;
    navbar: NavbarData;
    projectsPage: ProjectsPageData;
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
        biographyLabel: (portfolioData.about as any).biographyLabel || "Biography",
        educationLabel: (portfolioData.about as any).educationLabel || "Education",
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
        resumeUrl: "",
        formNameLabel: portfolioData.contact.formNameLabel,
        formNamePlaceholder: portfolioData.contact.formNamePlaceholder,
        formEmailLabel: portfolioData.contact.formEmailLabel,
        formEmailPlaceholder: portfolioData.contact.formEmailPlaceholder,
        formSubjectLabel: portfolioData.contact.formSubjectLabel,
        formSubjectPlaceholder: portfolioData.contact.formSubjectPlaceholder,
        formMessageLabel: portfolioData.contact.formMessageLabel,
        formMessagePlaceholder: portfolioData.contact.formMessagePlaceholder,
        formSubmitButton: portfolioData.contact.formSubmitButton,
    },
    navbar: { logoText: "S", ctaText: "Hire Me", items: [] },
    projectsPage: (portfolioData as any).projectsPage || {
        title: "Selected",
        titleHighlight: "Works",
        label: "Works Portfolio",
        description: "A curated collection of digital experiences, focusing on high-performance interfaces and elegant mobile interactions."
    },
    projects: portfolioData.projects as Project[],
    name: portfolioData.name,
    role: portfolioData.role
};

export function usePortfolio(userId?: string) {
    const [data, setData] = useState<PortfolioContent>(emptyData);

    // Track loading state for different parts
    const [contentLoaded, setContentLoaded] = useState(false);
    const [projectsLoaded, setProjectsLoaded] = useState(false);

    const { currentLanguage } = useLanguage();

    useEffect(() => {
        // Determine collection references based on language
        let contentRef;
        let projectsRef;

        // Helper to construct path
        const getPath = (base: string, lang: string, isDefault: boolean) => {
            // If default (or 'en'), use the root collections 'content' and 'projects'
            // If dynamic language, use 'languages/{code}/content' and 'languages/{code}/projects'
            if (isDefault) return base;
            return `languages/${lang}/${base}`;
        };

        if (userId) {
            // User-specific paths
            if (currentLanguage.isDefault) {
                contentRef = collection(db, "users", userId, "content");
                projectsRef = collection(db, "users", userId, "projects");
            } else {
                contentRef = collection(db, "users", userId, "languages", currentLanguage.code, "content");
                projectsRef = collection(db, "users", userId, "languages", currentLanguage.code, "projects");
            }
        } else {
            // Root paths (Single user / Default)
            if (currentLanguage?.isDefault) {
                contentRef = collection(db, "content");
                projectsRef = collection(db, "projects");
            } else {
                contentRef = collection(db, "languages", currentLanguage.code, "content");
                projectsRef = collection(db, "languages", currentLanguage.code, "projects");
            }
        }

        // Listen to Content
        const contentUnsub = onSnapshot(contentRef, (snapshot) => {
            const newContent: any = {};

            // If the whole collection is empty, we fall back to placeholders
            if (snapshot.empty) {
                console.log(`No content found in Firestore for language: ${currentLanguage.code}`);
                setData(emptyData);
                setContentLoaded(true);
                return;
            }

            // Helper to merge data with fallbacks for arrays/objects
            const mergeData = (target: any, source: any) => {
                const result = { ...target };
                for (const key in source) {
                    if (source[key] !== undefined && source[key] !== null) {
                        // For arrays, only override if the source array is not empty
                        if (Array.isArray(source[key])) {
                            if (source[key].length > 0) {
                                result[key] = source[key];
                            }
                        } else if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                            // Recursively merge simple objects if needed, or just replace
                            result[key] = { ...target[key], ...source[key] };
                        } else {
                            result[key] = source[key];
                        }
                    }
                }
                return result;
            };

            snapshot.forEach(doc => {
                const docData = doc.data();
                const id = doc.id;

                if (id === 'skills') {
                    newContent[id] = mergeData(emptyData.skills, docData);
                } else if (id === 'about') {
                    const socialLinks = normalizeSocialLinks(docData.socialLinks);
                    const baseAbout = mergeData(emptyData.about, docData);
                    newContent[id] = {
                        ...baseAbout,
                        socialLinks: socialLinks.length > 0 ? socialLinks : emptyData.about.socialLinks
                    };
                } else if (id === 'expertise') {
                    newContent[id] = mergeData(emptyData.expertise, docData);
                } else if (id === 'hero') {
                    newContent[id] = mergeData(emptyData.hero, docData);
                } else if (id === 'projects_page') {
                    newContent.projectsPage = mergeData(emptyData.projectsPage, docData);
                } else if (id === 'contact') {
                    newContent[id] = mergeData(emptyData.contact, docData);
                } else if (id === 'navbar') {
                    newContent[id] = mergeData(emptyData.navbar, docData);
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
            setContentLoaded(true);
        });

        // Listen to Projects
        const projectsUnsub = onSnapshot(projectsRef, (snapshot) => {
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
            }).sort((a, b) => {
                const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                return bTime - aTime;
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
    }, [userId, currentLanguage]);

    const isLoading = !contentLoaded || !projectsLoaded;

    return { data, loading: isLoading };
}
