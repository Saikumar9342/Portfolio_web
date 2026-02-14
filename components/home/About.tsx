"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Section, Typography } from "@/components/ui/layout";
// import { portfolioData } from "@/lib/data";
import * as Icons from "lucide-react";
import { PortfolioContent } from "@/hooks/usePortfolio";

interface AboutProps {
    about: PortfolioContent['about'];
    expertise: PortfolioContent['expertise'];
    contact: PortfolioContent['contact'];
}

export function About({ about, expertise, contact }: AboutProps) {

    const getServiceIcon = (service: any) => {
        const IconComponent = (Icons as any)[service.icon] || (Icons as any)[service.id] || Icons.Code2;
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
        <Section id="about" className="py-24 bg-foreground/5 backdrop-blur-sm border-t border-accent/30 overflow-hidden">
            <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                {/* Left Side: Biography & Education */}
                <motion.div
                    style={{ y: elementY }}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">
                                {about.biographyLabel || "Biography"}
                            </Typography>
                            {about.location && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Icons.MapPin className="w-4 h-4 text-accent" />
                                    <span className="text-xs font-medium uppercase tracking-wider">{about.location}</span>
                                </div>
                            )}
                        </div>
                        <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            {about.title}
                        </Typography>
                        <Typography className="text-lg text-muted-foreground leading-relaxed">
                            {about.biography}
                        </Typography>

                        {/* Social Links Provision */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            {about.socialLinks && about.socialLinks.length > 0 && (
                                about.socialLinks.map((link) => (
                                    <a
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground/5 border border-accent/60 text-foreground hover:bg-accent/10 hover:border-accent/80 transition-all group"
                                    >
                                        {getSocialIcon(link.platform)}
                                        <span className="text-xs font-bold uppercase tracking-wider">{link.platform}</span>
                                    </a>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">
                            {about.educationLabel || "Education"}
                        </Typography>
                        <div className="space-y-4">
                            {about.education?.map((edu, idx) => (
                                <motion.div
                                    key={edu.institution}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-2xl border border-accent/40 bg-foreground/5 group hover:bg-foreground/10 transition-colors"
                                >
                                    <Typography className="text-lg font-bold text-foreground mb-1">{edu.degree}</Typography>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>{edu.institution}</span>
                                        <span className="font-mono">{edu.year}</span>
                                    </div>
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
                        <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">
                            What I Do
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
                                        <Typography element="h3" className="text-xl font-bold text-foreground">
                                            {service.title}
                                        </Typography>
                                        <Typography className="text-muted-foreground leading-relaxed">
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
                                className="p-8 rounded-2xl bg-foreground/5 border border-accent/40 text-center"
                            >
                                <Typography className="text-3xl font-bold text-accent mb-2">{stat.value}</Typography>
                                <Typography className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
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
