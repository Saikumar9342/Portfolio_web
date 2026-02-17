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
    const languageCode = currentLanguage.code;
    const isDefaultLanguage = currentLanguage.isDefault;

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
        if (isResolving) return;
        if (!fetchFromRoot && !resolvedUid) return;

        // Initialize loaded states when starting listeners for a new context
        setContentLoaded(false);
        setProjectsLoaded(false);

        /**
         * Deeply merges source onto target.
         * @param ignoreImages If true, keys containing 'imageurl' or 'icon' will not be overwritten.
         */
        const mergeData = (target: any, source: any, ignoreImages: boolean = false): any => {
            if (!source) return target;
            const result = { ...target };

            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    const val = source[key];
                    if (val === undefined || val === null) continue;

                    if (Array.isArray(val)) {
                        // Deeply merge arrays of objects (like Expertise services)
                        if (Array.isArray(target[key]) && typeof val[0] === 'object' && val[0] !== null) {
                            result[key] = val.map((item: any, idx: number) => {
                                const targetItem = target[key][idx] || {};
                                return mergeData(targetItem, item, ignoreImages);
                            });
                        } else if (val.length > 0) {
                            result[key] = val;
                        }
                    } else if (typeof val === 'object' && val !== null) {
                        result[key] = mergeData(target[key], val, ignoreImages);
                    } else {
                        // Only skip images if we are explicitly told to (e.g. during translation merge)
                        if (ignoreImages && (key.toLowerCase().includes('imageurl') || key.toLowerCase().includes('icon'))) {
                            continue;
                        }
                        result[key] = val;
                    }
                }
            }
            return result;
        };

        const mapProject = (docSnap: any): Project => {
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
        };

        // Storage for individual streams
        const rawDefaultContent: any = {};
        const rawLocalizedContent: any = {};
        const rawDefaultProjects: Map<string, Project> = new Map();
        const rawLocalizedProjects: Map<string, Project> = new Map();

        const syncAllSubsystems = () => {
            const newContentConfigs: any = {};

            // 1. Merge Content Docs
            // We consider all documents from hardcoded baseData AND Firestore
            const contentKeys = ['hero', 'about', 'expertise', 'skills', 'contact', 'navbar', 'projects_page', 'personal'];

            contentKeys.forEach(id => {
                const defDoc = rawDefaultContent[id];
                const locDoc = rawLocalizedContent[id];

                // Base template from hardcoded data
                let baseTemplate: any = (baseData as any)[id] || {};
                // Handle naming difference: Firestore uses 'projects_page', hardcoded data uses 'projectsPage'
                if (id === 'projects_page') {
                    baseTemplate = baseData.projectsPage;
                }

                // Merge: Hardcoded Base < Default Firestore (English) < Localized Firestore (Translation)
                // When merging English (defDoc) onto hardcoded base, we ALLOW image updates (ignoreImages: false)
                let merged = defDoc ? mergeData(baseTemplate, defDoc, false) : baseTemplate;

                // When merging Localized (locDoc) onto English, we BLOCK image updates (ignoreImages: true)
                if (locDoc) {
                    merged = mergeData(merged, locDoc, true);
                }

                if (id === 'personal') {
                    newContentConfigs.name = locDoc?.name || defDoc?.name || baseData.name;
                    newContentConfigs.role = locDoc?.role || defDoc?.role || baseData.role;
                } else if (id === 'projects_page') {
                    newContentConfigs.projectsPage = merged;
                } else if (id === 'about') {
                    // Special handling for social links to ensure they are always valid SocialLink[]
                    const socialLinks = normalizeSocialLinks(locDoc?.socialLinks || defDoc?.socialLinks);
                    newContentConfigs.about = {
                        ...merged,
                        socialLinks: socialLinks.length > 0 ? socialLinks : baseData.about.socialLinks
                    };
                } else {
                    newContentConfigs[id] = merged;
                }
            });

            // 2. Merge Projects
            const allProjectIds = new Set([
                ...Array.from(rawDefaultProjects.keys()),
                ...Array.from(rawLocalizedProjects.keys())
            ]);

            const mergedProjects = Array.from(allProjectIds).map(id => {
                const defProj = rawDefaultProjects.get(id);
                const locProj = rawLocalizedProjects.get(id);

                if (!locProj) return defProj!;
                if (!defProj) return locProj;

                // Merge locProj onto defProj
                return {
                    ...defProj,
                    ...locProj,
                    // FORCE use default English image for projects to ensure consistency across languages
                    imageUrl: defProj.imageUrl
                };
            }).sort((a, b) => {
                const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                return bTime - aTime;
            });

            setData(prev => ({
                ...prev,
                ...newContentConfigs,
                projects: mergedProjects.length > 0 ? mergedProjects : baseData.projects
            }));
        };

        // Determine Refs
        const uid = resolvedUid;
        const profileRef = uid ? doc(db, "users", uid) : null;

        const defContentRef = uid ? collection(db, "users", uid, "content") : collection(db, "content");
        const defProjectsRef = uid ? collection(db, "users", uid, "projects") : collection(db, "projects");

        const isDefault = currentLanguage.isDefault;
        const locContentRef = !isDefaultLanguage ? (uid
            ? collection(db, "users", uid, "languages", languageCode, "content")
            : collection(db, "languages", languageCode, "content")
        ) : null;
        const locProjectsRef = !isDefaultLanguage ? (uid
            ? collection(db, "users", uid, "languages", languageCode, "projects")
            : collection(db, "languages", languageCode, "projects")
        ) : null;

        // LISTENERS
        const unsubs: (() => void)[] = [];

        // 1. Default Content
        unsubs.push(onSnapshot(defContentRef as any, (snap: QuerySnapshot) => {
            snap.forEach(d => rawDefaultContent[d.id] = d.data());
            setContentLoaded(true);
            syncAllSubsystems();
        }, (err: any) => { console.error("Def Content Err:", err); setContentLoaded(true); }));

        // 2. Default Projects
        unsubs.push(onSnapshot(defProjectsRef as any, (snap: QuerySnapshot) => {
            snap.docs.forEach(d => rawDefaultProjects.set(d.id, mapProject(d)));
            setProjectsLoaded(true);
            syncAllSubsystems();
        }, (err: any) => { console.error("Def Proj Err:", err); setProjectsLoaded(true); }));

        // 3. Localized Content (Optional)
        if (locContentRef) {
            unsubs.push(onSnapshot(locContentRef as any, (snap: QuerySnapshot) => {
                snap.forEach(d => rawLocalizedContent[d.id] = d.data());
                syncAllSubsystems();
            }));
        }

        // 4. Localized Projects (Optional)
        if (locProjectsRef) {
            unsubs.push(onSnapshot(locProjectsRef as any, (snap: QuerySnapshot) => {
                snap.docs.forEach(d => rawLocalizedProjects.set(d.id, mapProject(d)));
                syncAllSubsystems();
            }));
        }

        // 5. Profile Listener (Independent)
        if (profileRef) {
            unsubs.push(onSnapshot(profileRef, (docSnap: DocumentSnapshot) => {
                if (docSnap.exists()) {
                    const profileData = docSnap.data();
                    const displayName = profileData.displayName || profileData.username;
                    if (displayName) {
                        setData(prev => {
                            const isDefaultName = prev.name === "User Portfolio" || prev.name === "New Portfolio";
                            if (isDefaultName) return { ...prev, name: displayName };
                            return prev;
                        });
                    }
                }
            }));
        }

        return () => unsubs.forEach(u => u());
    }, [resolvedUid, isResolving, languageCode, isDefaultLanguage, baseData, fetchFromRoot]);

    const isLoading = isResolving || (!isNotFound && (!contentLoaded || !projectsLoaded));
    return { data, loading: isLoading, notFound: isNotFound, resolvedUid };
}
