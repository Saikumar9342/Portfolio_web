"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
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

const getInitialData = (isMainSite: boolean): PortfolioContent => {
    // If it's the main site entry point, use the hardcoded portfolioData as base
    // If it's a specific user sub-page, use generic placeholders
    if (isMainSite) {
        return {
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
    }

    // Truly empty state for new users
    return {
        hero: { badge: "Welcome", title: "New Portfolio", subtitle: "", cta: "Contact", secondaryCta: "", imageUrl: "" },
        about: { title: "", biography: "", biographyLabel: "Biography", educationLabel: "Education", education: [], location: "", interests: [], socialLinks: [] },
        expertise: { title: "", label: "EXPERTISE", stats: [], services: [] },
        skills: { title: "Technical Expertise", description: "", frontend: [], frameworks: [], mobile: [], backend: [], tools: [] },
        contact: { title: "Get in Touch", description: "", email: "", personalEmail: "", cta: "Send", secondaryCta: "", resumeUrl: "" },
        navbar: { logoText: "Portfolio", ctaText: "Contact", items: [] },
        projectsPage: { title: "Projects", titleHighlight: "", label: "Portfolio", description: "" },
        projects: [],
        name: "User Portfolio",
        role: "Professional"
    };
};

export function usePortfolio(userId?: string) {
    // 1. Determine if we are on the main site or a guest portal
    // Main site = no userId passed (app/page.tsx)
    const isMainSitePath = !userId;

    // 2. Determine if this specific userId belongs to an Admin
    const adminUidsString = process.env.NEXT_PUBLIC_ADMIN_UIDS || "";
    const adminUids = adminUidsString.split(",").map(id => id.trim()).filter(id => id.length > 0);
    const isActuallyAdmin = userId ? adminUids.includes(userId) : false;

    // 3. Decide where to fetch data from
    // If it's the main site OR the userId is an admin, we pull from root
    // otherwise we pull from the specific user collection
    const fetchFromRoot = isMainSitePath || isActuallyAdmin;
    const effectiveUserId = fetchFromRoot ? undefined : userId;

    // 4. Set the initial "loading" state data
    // Main site/Admin sees Saikumar's branding while loading
    // Guests see a generic "Welcome" branding while loading
    const baseData = getInitialData(fetchFromRoot);
    const [data, setData] = useState<PortfolioContent>(baseData);

    // Track loading state for different parts
    const [contentLoaded, setContentLoaded] = useState(false);
    const [projectsLoaded, setProjectsLoaded] = useState(false);

    const { currentLanguage } = useLanguage();

    useEffect(() => {
        // Determine collection references
        let contentRef;
        let projectsRef;
        let userProfileRef: any = null;

        if (effectiveUserId) {
            // User-specific paths - effectiveUserId is guaranteed string here
            const uid = effectiveUserId;
            if (currentLanguage.isDefault) {
                contentRef = collection(db, "users", uid, "content");
                projectsRef = collection(db, "users", uid, "projects");
                // Also fetch the root user document for profile info (displayName, etc.)
                // This is now handled in the profileUnsub block below
                userProfileRef = doc(db, "users", uid);
            } else {
                contentRef = collection(db, "users", uid, "languages", currentLanguage.code, "content");
                projectsRef = collection(db, "users", uid, "languages", currentLanguage.code, "projects");
            }
        } else {
            // Root paths (Admin or Default)
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

            // If the whole collection is empty, fall back to baseData
            if (snapshot.empty) {
                setData(baseData);
                setContentLoaded(true);
                return;
            }

            // Helper to merge data with fallbacks
            const mergeData = (target: any, source: any) => {
                const result = { ...target };
                for (const key in source) {
                    if (source[key] !== undefined && source[key] !== null) {
                        if (Array.isArray(source[key])) {
                            if (source[key].length > 0) result[key] = source[key];
                        } else if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
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
                    newContent[id] = mergeData(baseData.skills, docData);
                } else if (id === 'about') {
                    const socialLinks = normalizeSocialLinks(docData.socialLinks);
                    const baseAbout = mergeData(baseData.about, docData);
                    newContent[id] = {
                        ...baseAbout,
                        socialLinks: socialLinks.length > 0 ? socialLinks : baseData.about.socialLinks
                    };
                } else if (id === 'expertise') {
                    newContent[id] = mergeData(baseData.expertise, docData);
                } else if (id === 'hero') {
                    newContent[id] = mergeData(baseData.hero, docData);
                } else if (id === 'projects_page') {
                    newContent.projectsPage = mergeData(baseData.projectsPage, docData);
                } else if (id === 'contact') {
                    newContent[id] = mergeData(baseData.contact, docData);
                } else if (id === 'navbar') {
                    newContent[id] = mergeData(baseData.navbar, docData);
                } else if (id === 'personal') {
                    newContent.name = docData.name || baseData.name;
                    newContent.role = docData.role || baseData.role;
                } else {
                    newContent[id] = docData;
                }
            });

            setData(prev => ({ ...prev, ...newContent }));
            setContentLoaded(true);
        }, (error) => {
            console.error("Error fetching content:", error);
            setContentLoaded(true);
        });

        // Listen to User Profile (for Name fallback)
        let profileUnsub = () => { };
        if (effectiveUserId) {
            // We use a separate listener for the user profile doc "users/{uid}"
            const profileRef = doc(db, "users", effectiveUserId);
            profileUnsub = onSnapshot(profileRef, (docSnap) => {
                if (docSnap.exists()) {
                    const profileData = docSnap.data();
                    const displayName = profileData.displayName || profileData.username;
                    if (displayName) {
                        setData(prev => {
                            // Only update if 'personal' content hasn't set a name already
                            // Or if the current name is the default "User Portfolio"
                            // We can't easily check here if 'personal' exists in 'prev', 
                            // so we'll just update if it looks default or we want to sync.
                            // Better approach: merge it.
                            const currentName = prev.name;
                            const isDefault = currentName === "User Portfolio" || currentName === "New Portfolio";
                            if (isDefault || !prev.role) { // minimal check
                                return {
                                    ...prev,
                                    name: displayName,
                                    // Could also use customDomain or other fields here
                                };
                            }
                            return prev;
                        });
                    }
                }
            });
        }


        // Listen to Projects
        const projectsUnsub = onSnapshot(projectsRef, (snapshot) => {
            if (snapshot.empty) {
                setData(prev => ({ ...prev, projects: [] }));
                setProjectsLoaded(true);
                return;
            }

            const projects = snapshot.docs.map(doc => {
                const d = doc.data();
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
            profileUnsub();
            projectsUnsub();
        };
    }, [effectiveUserId, currentLanguage, baseData]);

    const isLoading = !contentLoaded || !projectsLoaded;

    return { data, loading: isLoading };
}
