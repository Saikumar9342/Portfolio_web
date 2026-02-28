"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section, Typography } from "@/components/ui/layout";

import * as Icons from "lucide-react";
import { PortfolioContent } from "@/hooks/usePortfolio";

interface AboutProps {
    about: PortfolioContent['about'];
    expertise: PortfolioContent['expertise'];
    contact: PortfolioContent['contact'];
}

export function About({ about, expertise, contact }: AboutProps) {

    const getServiceIcon = (service: import("@/types").Service) => {
        const IconComponent = (Icons as any)[service.icon || service.id] || Icons.Code2;
        return <IconComponent className="w-6 h-6 text-accent" />;
    };

    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'github': return <Icons.Github className="w-5 h-5" />;
            case 'linkedin': return <Icons.Linkedin className="w-5 h-5" />;
            case 'twitter': return <Icons.Twitter className="w-5 h-5" />;
            default: return <Icons.Globe className="w-5 h-5" />;
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const elementY = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const reverseElementY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

    return (
        <Section id="about" className="py-24 overflow-hidden relative">

            <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start relative z-10">


                {/* Left Side: Biography & Education */}
                <motion.div
                    style={{ y: elementY }}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-12"
                >
                    <div className="relative group">
                        <div className="relative p-8 md:p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-3xl overflow-hidden shadow-2xl">

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                        <Typography className="text-[9px] font-bold text-accent tracking-wide">
                                            {about.biographyLabel || "Status: Active"}
                                        </Typography>
                                    </div>
                                    {about.location && (
                                        <div className="flex items-center gap-2 text-muted-foreground/60">
                                            <Icons.MapPin className="w-3 h-3" />
                                            <Typography className="text-[9px] font-bold tracking-wide">{about.location}</Typography>
                                        </div>
                                    )}
                                </div>
                                <Typography element="h2" className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                    {about.title}
                                </Typography>
                                <Typography className="text-base text-muted-foreground/80 leading-relaxed font-medium">
                                    {about.biography}
                                </Typography>

                                {/* Social Links - Premium Pills */}
                                <div className="flex flex-wrap gap-3 pt-6">
                                    {about.socialLinks?.map((link) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/5 text-white/70 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-300 group/link"
                                        >
                                            {getSocialIcon(link.platform)}
                                            <span className="text-[10px] font-bold tracking-wide">{link.platform}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <Typography className="text-[9px] font-bold text-accent tracking-wide uppercase">
                                {about.educationLabel || "Education"}
                            </Typography>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {about.education?.map((edu, idx) => (
                                <motion.div
                                    key={edu.institution}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group/edu"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <Typography className="text-base font-bold text-white">{edu.degree}</Typography>
                                        <span className="text-[9px] font-bold text-muted-foreground/60">{edu.year}</span>
                                    </div>
                                    <Typography className="text-[9px] font-bold text-muted-foreground tracking-wide">
                                        {edu.institution}
                                    </Typography>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </motion.div>

                {/* Right Side: Services & Stats */}
                <motion.div
                    style={{ y: reverseElementY }}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-16"
                >
                    <div className="space-y-8">
                        <Typography className="text-xs font-semibold text-accent tracking-wide">
                            {expertise.label || "What I Do"}
                        </Typography>
                        <div className="grid gap-8">
                            {expertise.services?.map((service, i) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 items-start group"
                                >
                                    <div className="p-3 rounded-xl bg-accent/5 border border-accent/40 transition-transform group-hover:scale-110 duration-300">
                                        {getServiceIcon(service)}
                                    </div>
                                    <div className="space-y-2">
                                        <Typography element="h3" className="text-lg font-bold text-foreground">
                                            {service.title}
                                        </Typography>
                                        <Typography className="text-sm text-muted-foreground leading-relaxed">
                                            {service.description}
                                        </Typography>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {expertise.stats?.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center group/stat overflow-hidden"
                            >

                                <Typography className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight break-words group-hover/stat:text-accent transition-colors duration-500">
                                    {stat.value}
                                </Typography>
                                <Typography className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] group-hover/stat:text-white transition-colors duration-500">
                                    {stat.label}
                                </Typography>

                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </Section>
    );
}

