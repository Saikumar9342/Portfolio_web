"use client";

import { useParams, useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Typography, Section, GlassCard } from "@/components/ui/layout";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ArrowLeft, ExternalLink, Github, Terminal, Layers, Tag, User } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useDynamicColor } from "@/hooks/useDynamicColor";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data, loading } = usePortfolio();
    const id = params.id as string;

    const project = data.projects.find((p) => p.id === id);
    const containerRef = useRef<HTMLDivElement>(null);

    // Theme color based on project image
    const { isLoading: themeLoading } = useDynamicColor(project?.imageUrl || data.hero?.imageUrl || "/pfp.jpeg");

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
        layoutEffect: false
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    return (
        <main ref={containerRef} className="relative min-h-screen bg-background overflow-x-hidden">
            {(loading || themeLoading) ? (
                <LoadingScreen />
            ) : !project ? (
                <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                    <Typography element="h1" className="text-4xl font-bold">Project Not Found</Typography>
                    <button
                        onClick={() => router.push("/projects")}
                        className="flex items-center gap-2 text-accent hover:underline font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Projects
                    </button>
                </div>
            ) : (
                <>
                    <Navbar name={data.name} data={data.navbar} contact={data.contact} loading={loading} />

                    {/* HERO SECTION - CINEMATIC FIRST IMPRESSION */}
                    <section className="relative h-[85vh] w-full overflow-hidden flex items-center pt-24 pb-12">
                        <motion.div
                            style={{ opacity, scale, y }}
                            className="absolute inset-0 z-0"
                        >
                            <Image
                                src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"}
                                alt={project.title}
                                fill
                                priority
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
                            <div className="absolute inset-0 bg-black/50 z-0" />
                        </motion.div>

                        <div className="container mx-auto max-w-7xl px-6 relative z-20">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="max-w-4xl"
                            >
                                <button
                                    onClick={() => router.back()}
                                    className="group flex items-center gap-3 text-foreground/50 hover:text-accent transition-all mb-12"
                                >
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all backdrop-blur-sm">
                                        <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Return to Gallery</span>
                                </button>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-px w-12 bg-accent/60" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent">Project Case Study</span>
                                    </div>

                                    <Typography element="h1" className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.9] tracking-tightest uppercase font-sans">
                                        {project.title}
                                    </Typography>

                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Status: Production Ready</span>
                                    </div>

                                    <div className="flex flex-wrap gap-8 pt-6">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 block">Discipline</span>
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-accent" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                                    {project.category || "Design + Development"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50 block">Position</span>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-accent" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                                    {project.role || "Lead Developer"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* CONTENT GRID */}
                    <Section className="py-24">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
                            {/* Main Story */}
                            <div className="lg:col-span-2 space-y-20">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4">
                                        <Typography className="text-[10px] font-bold text-accent uppercase tracking-widest">{data.skills?.frameworksTitle || "The Deep Dive"}</Typography>
                                        <Typography element="h2" className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.05] tracking-tight font-sans uppercase">
                                            Engineering for the next dimension.
                                        </Typography>
                                    </div>

                                    <Typography className="text-xl md:text-2xl text-foreground font-semibold leading-relaxed font-sans mt-4">
                                        {project.description}
                                    </Typography>

                                    <div className="h-px w-24 bg-accent/30" />

                                    <div className="text-muted-foreground leading-relaxed space-y-8 whitespace-pre-wrap text-lg font-light">
                                        {project.fullDescription || "A detailed breakdown of the architectural decisions, technical challenges, and implementation details for this specific case study."}
                                    </div>
                                </motion.div>

                                {/* Tech Stack Visuals */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-10"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-accent/10 text-accent">
                                            <Terminal className="w-6 h-6" />
                                        </div>
                                        <Typography element="h3" className="text-2xl font-bold text-foreground tracking-tight">Technical Architecture</Typography>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {project.techStack?.map((tech) => (
                                            <GlassCard key={tech} className="px-6 py-4 border-white/5 hover:border-accent/40 transition-all duration-500 hover:bg-accent/5 cursor-default group">
                                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/60 group-hover:text-accent transition-colors">{tech}</span>
                                            </GlassCard>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sidebar / Stats */}
                            <div className="space-y-12">
                                {/* Action Links */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <GlassCard className="p-8 space-y-8 border-accent/20 bg-accent/5 backdrop-blur-xl relative overflow-visible group rounded-none">
                                        <div className="absolute -top-px -left-px w-10 h-10 border-t-2 border-l-2 border-accent z-20" />
                                        <div className="absolute -bottom-px -right-px w-10 h-10 border-b-2 border-r-2 border-accent z-20" />
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-accent/20" />

                                        <div className="space-y-2">
                                            <Typography className="text-[10px] font-bold text-accent uppercase tracking-[0.5em]">Release Assets</Typography>
                                            <Typography element="h4" className="text-2xl font-bold">Project Access</Typography>
                                        </div>

                                        <div className="space-y-4">
                                            {project.liveLink && (
                                                <a
                                                    href={project.liveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-5 rounded-2xl bg-accent text-accent-foreground hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20"
                                                >
                                                    Explore Deployment
                                                    <ExternalLink className="w-5 h-5 flex-shrink-0" />
                                                </a>
                                            )}
                                            {project.githubLink && (
                                                <a
                                                    href={project.githubLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-foreground font-bold text-xs uppercase tracking-[0.2em] backdrop-blur-sm"
                                                >
                                                    View Repository
                                                    <Github className="w-5 h-5 flex-shrink-0" />
                                                </a>
                                            )}
                                            {!project.liveLink && !project.githubLink && (
                                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-muted-foreground text-xs font-medium italic leading-relaxed">
                                                    Architecture and codebase are proprietary for enterprise confidentiality.
                                                </div>
                                            )}
                                        </div>
                                    </GlassCard>
                                </motion.div>

                                {/* Project Details Box */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="space-y-10 px-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-px bg-accent/40" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em]">Metadata</span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Client/Role</span>
                                            <p className="font-bold text-base text-foreground tracking-tight">{project.role || "Lead Software Engineer"}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Domain</span>
                                            <p className="font-bold text-base text-foreground tracking-tight">{project.category || "Full-Stack Development"}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Timeline</span>
                                            <p className="font-bold text-base text-foreground tracking-tight">Active Production</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </Section>

                    <Footer contact={data.contact} about={data.about} navbar={data.navbar} name={data.name} />
                </>
            )}
        </main>
    );
}
