"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, doc, query, where, getDocs, getDoc, DocumentSnapshot, QuerySnapshot } from "firebase/firestore";
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
    // Robust check for main site vs specific user
    const isMainSitePath = userId === undefined || userId === null || userId === "" || userId === "index";

    const adminUidsString = process.env.NEXT_PUBLIC_ADMIN_UIDS || "";
    const adminUids = adminUidsString.split(",").map(id => id.trim()).filter(id => id.length > 0);

    // Check if the current URL parameter is an Admin UID
    const isActuallyAdmin = userId ? adminUids.includes(userId) : false;

    // fetchFromRoot is true if we are on the main site OR viewing an admin's profile
    const fetchFromRoot = isMainSitePath || isActuallyAdmin;
    const effectiveUserId = fetchFromRoot ? undefined : userId;

    const baseData = useMemo(() => getInitialData(fetchFromRoot), [fetchFromRoot]);
    const [data, setData] = useState<PortfolioContent>(baseData);

    const [contentLoaded, setContentLoaded] = useState(false);
    const [projectsLoaded, setProjectsLoaded] = useState(false);
    const [resolvedUid, setResolvedUid] = useState<string | undefined>(undefined);
    const [isNotFound, setIsNotFound] = useState(false);

    // Initialize resolving state based on whether we have a non-admin userId to resolve
    const [isResolving, setIsResolving] = useState(!!effectiveUserId);

    const { currentLanguage } = useLanguage();

    // 1. Resolve username to UID if necessary
    useEffect(() => {
        if (!effectiveUserId) {
            setResolvedUid(undefined);
            setIsResolving(false);
            setData(baseData); // Sync data with baseData for main site
            setContentLoaded(false);
            setProjectsLoaded(false);
            return;
        }

        // Reset states for a fresh resolution
        setIsResolving(true);
        setContentLoaded(false);
        setProjectsLoaded(false);
        setIsNotFound(false);
        setData(baseData); // Immediately show baseData (empty state for guests) while loading

        async function resolve() {
            try {
                // Try searching as UID first
                const docRef = doc(db, "users", effectiveUserId!);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setResolvedUid(effectiveUserId);
                    setIsResolving(false);
                    return;
                }
                // Try searching in usernames collection
                const uRef = doc(db, "usernames", effectiveUserId!);
                const uSnap = await getDoc(uRef);
                if (uSnap.exists()) {
                    const foundUid = uSnap.data()?.userId;
                    if (foundUid) {
                        setResolvedUid(foundUid);
                        setIsResolving(false);
                        return;
                    }
                }
                // Fallback query
                const q = query(collection(db, "users"), where("username", "==", effectiveUserId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setResolvedUid(querySnapshot.docs[0].id);
                } else {
                    // If all resolution attempts fail, it's a 404
                    setIsNotFound(true);
                }
            } catch (error) {
                console.error("Error resolving user:", error);
                setIsNotFound(true);
            } finally {
                setIsResolving(false);
            }
        }
        resolve();
    }, [effectiveUserId, baseData]);

    // 2. Setup Listeners
    useEffect(() => {
        // CRITICAL: If we are still resolving a username, DO NOT start listeners.
        // Starting listeners without a resolvedUid often defaults to 'root' collections,
        // which is why the admin's portfolio was flashing first.
        if (isResolving) return;

        // If we are on a user page but haven't resolved a UID yet (and aren't root), wait.
        if (!fetchFromRoot && !resolvedUid) return;

        let contentRef;
        let projectsRef;
        let profileRef: any = null;

        if (resolvedUid) {
            const uid = resolvedUid;
            profileRef = doc(db, "users", uid);
            if (currentLanguage.isDefault) {
                contentRef = collection(db, "users", uid, "content");
                projectsRef = collection(db, "users", uid, "projects");
            } else {
                contentRef = collection(db, "users", uid, "languages", currentLanguage.code, "content");
                projectsRef = collection(db, "users", uid, "languages", currentLanguage.code, "projects");
            }
        } else {
            // Main site or Admin root paths
            if (currentLanguage?.isDefault) {
                contentRef = collection(db, "content");
                projectsRef = collection(db, "projects");
            } else {
                contentRef = collection(db, "languages", currentLanguage.code, "content");
                projectsRef = collection(db, "languages", currentLanguage.code, "projects");
            }
        }

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

        const contentUnsub = onSnapshot(contentRef as any, (snapshot: QuerySnapshot) => {
            const newContent: any = {};
            if (snapshot.empty) {
                // If we are looking for a specific user and they have NO content, show 404
                if (!fetchFromRoot) setIsNotFound(true);
                setData(baseData);
                setContentLoaded(true);
                return;
            }
            snapshot.forEach(docSnap => {
                const docData = docSnap.data();
                const id = docSnap.id;
                if (id === 'skills') newContent[id] = mergeData(baseData.skills, docData);
                else if (id === 'about') {
                    const socialLinks = normalizeSocialLinks(docData.socialLinks);
                    const baseAbout = mergeData(baseData.about, docData);
                    newContent[id] = { ...baseAbout, socialLinks: socialLinks.length > 0 ? socialLinks : baseData.about.socialLinks };
                } else if (id === 'expertise') newContent[id] = mergeData(baseData.expertise, docData);
                else if (id === 'hero') newContent[id] = mergeData(baseData.hero, docData);
                else if (id === 'projects_page') newContent.projectsPage = mergeData(baseData.projectsPage, docData);
                else if (id === 'contact') newContent[id] = mergeData(baseData.contact, docData);
                else if (id === 'navbar') newContent[id] = mergeData(baseData.navbar, docData);
                else if (id === 'personal') {
                    newContent.name = docData.name || baseData.name;
                    newContent.role = docData.role || baseData.role;
                } else newContent[id] = docData;
            });
            setData(prev => ({ ...prev, ...newContent }));
            setContentLoaded(true);
        }, (error) => {
            console.error("Error fetching content:", error);
            setContentLoaded(true);
        });

        let profileUnsub = () => { };
        if (profileRef) {
            profileUnsub = onSnapshot(profileRef, (docSnap: DocumentSnapshot) => {
                if (docSnap.exists()) {
                    const profileData = docSnap.data();
                    const displayName = profileData.displayName || profileData.username;
                    if (displayName) {
                        setData(prev => {
                            const isDefault = prev.name === "User Portfolio" || prev.name === "New Portfolio";
                            if (isDefault) return { ...prev, name: displayName };
                            return prev;
                        });
                    }
                }
            });
        }

        const projectsUnsub = onSnapshot(projectsRef as any, (snapshot: QuerySnapshot) => {
            if (snapshot.empty) {
                setData(prev => ({ ...prev, projects: [] }));
                setProjectsLoaded(true);
                return;
            }
            const projectsList = snapshot.docs.map(docSnap => {
                const d = docSnap.data();
                let createdAt = d.createdAt;
                if (createdAt && typeof createdAt.toDate === 'function') createdAt = createdAt.toDate();
                return {
                    id: docSnap.id,
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
            setData(prev => ({ ...prev, projects: projectsList }));
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
    }, [resolvedUid, isResolving, currentLanguage.code, currentLanguage.isDefault, baseData, fetchFromRoot]);

    const isLoading = isResolving || (!isNotFound && (!contentLoaded || !projectsLoaded));
    return { data, loading: isLoading, notFound: isNotFound };
}
