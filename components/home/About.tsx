"use client";

import { motion } from "framer-motion";
import { Section, Typography } from "@/components/ui/layout";
import { portfolioData } from "@/lib/data";
import { Code2, Layout, Maximize2 } from "lucide-react";

export function About() {
    const { expertise, about } = portfolioData;

    const icons = {
        immersive: <Code2 className="w-6 h-6 text-accent" />,
        motion: <Maximize2 className="w-6 h-6 text-accent" />,
        visual: <Layout className="w-6 h-6 text-accent" />
    };

    return (
        <Section id="about" className="py-24 bg-foreground/5 backdrop-blur-sm border-t border-foreground/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

                {/* Left Side: Biography & Education */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">
                            Biography
                        </Typography>
                        <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            {about.title}
                        </Typography>
                        <Typography className="text-lg text-muted-foreground leading-relaxed">
                            {about.biography}
                        </Typography>
                    </div>

                    <div className="space-y-6">
                        <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">
                            Education
                        </Typography>
                        <div className="space-y-4">
                            {about.education.map((edu) => (
                                <div key={edu.institution} className="p-6 rounded-2xl border border-foreground/10 bg-foreground/5 group hover:bg-foreground/10 transition-colors">
                                    <Typography className="text-lg font-bold text-foreground mb-1">{edu.degree}</Typography>
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                        <span>{edu.institution}</span>
                                        <span className="font-mono">{edu.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Services & Stats */}
                <div className="space-y-16">
                    <div className="space-y-8">
                        <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">
                            What I Do
                        </Typography>
                        <div className="grid gap-8">
                            {expertise.services.map((service, i) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-6 items-start group"
                                >
                                    <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 transition-transform group-hover:scale-110 duration-300">
                                        {(icons as any)[service.id]}
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
                        {expertise.stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-foreground/5 border border-foreground/10 text-center"
                            >
                                <Typography className="text-3xl font-bold text-accent mb-2">{stat.value}</Typography>
                                <Typography className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                    {stat.label}
                                </Typography>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}
