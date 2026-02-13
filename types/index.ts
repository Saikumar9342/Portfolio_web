import type { Timestamp } from "firebase/firestore";

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    imageUrl: string;
    liveLink?: string;
    githubLink?: string;
    createdAt?: Timestamp | Date | null; // Firestore Timestamp mapped to Date when reading
}
