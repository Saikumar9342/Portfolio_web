import type { Timestamp } from "firebase/firestore";

export interface Project {
    id: string;
    title: string;
    description: string;
    fullDescription?: string;
    role?: string;
    techStack: string[];
    imageUrl: string;
    liveLink?: string;
    githubLink?: string;
    category?: string;
    createdAt?: Timestamp | Date | null;
}

export interface HeroData {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
    imageUrl?: string;
}

export interface AboutData {
    title: string;
    biography: string;
    education: Education[];
    location: string;
    interests: string[];
    socialLinks?: SocialLink[];
}

export interface Education {
    degree: string;
    institution: string;
    year: string;
}

export interface ExpertiseData {
    title: string;
    label: string;
    stats: Stat[];
    services: Service[];
}

export interface Stat {
    label: string;
    value: string;
}

export interface Service {
    id: string;
    title: string;
    description: string;
}

export interface SkillsData {
    frontendTitle?: string;
    mobileTitle?: string;
    backendTitle?: string;
    toolsTitle?: string;
    frameworksTitle?: string; // For "Toolbox"
    title?: string;
    description?: string;
    frontend: Skill[];
    frameworks: string[];
    mobile: string[];
    backend: string[];
    tools: string[];
    [key: string]: string | string[] | Skill[] | undefined | number; // Allow dynamic skill categories
}

export interface Skill {
    name: string;
    level: number;
}

export interface ContactData {
    title: string;
    description: string;
    email: string;
    personalEmail: string;
    cta: string;
    secondaryCta: string;
    resumeUrl?: string;
}

export interface SocialLink {
    platform: 'linkedin' | 'github' | 'twitter' | 'instagram' | 'other';
    url: string;
    label?: string;
}

export interface NavbarData {
    logoText: string;
    items: NavItem[];
    ctaText: string;
}

export interface NavItem {
    label: string;
    href: string;
}
