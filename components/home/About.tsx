"use client";

import { motion } from "framer-motion";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import { portfolioData } from "@/lib/data";
import { Code2, Cpu, Layout, Maximize2 } from "lucide-react";

export function About() {
    const { expertise } = portfolioData;

    const icons = {
        immersive: <Code2 className="w-5 h-5 text-sky-500" />,
        motion: <Maximize2 className="w-5 h-5 text-sky-500" />,
        visual: <Layout className="w-5 h-5 text-sky-500" />
    };

    return (
        <Section id="about" className="py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Services List */}
                <div className="space-y-8">
                    <Typography element="h2" className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                        Elevating Digital Presence
                    </Typography>

                    <div className="space-y-6">
                        {expertise.services.map((service, i) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-6 group"
                            >
                                <div className="mt-1 transition-transform group-hover:scale-110 duration-300">
                                    {(icons as any)[service.id]}
                                </div>
                                <div className="space-y-1">
                                    <Typography element="h3" className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {service.title}
                                    </Typography>
                                    <Typography className="text-sm max-w-md text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {service.description}
                                    </Typography>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Text + Stats */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <Typography className="text-sky-600 dark:text-sky-400 font-semibold text-xs tracking-widest uppercase">
                            {expertise.label}
                        </Typography>
                        <Typography element="h2" className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
                            {expertise.title}
                        </Typography>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {expertise.stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                    <Typography className="text-xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</Typography>
                                    <Typography className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        {stat.label}
                                    </Typography>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}
