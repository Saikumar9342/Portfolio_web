"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Smartphone,
    Globe,
    ShieldCheck,
    ArrowRight,
    Layers,
    Cpu,
    Target,
    Bell,
    Clock,
    Lock,
    Users,
    ChevronDown,
    Terminal,
    Code2,
    Database,
    Cloud
} from "lucide-react";
import { Button } from "../ui/button";
import { Section, Typography, GlassCard } from "../ui/layout";
import { BrandLogo } from "../ui/BrandLogo";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

export function AtomLanding() {
    return (
        <div className="relative bg-[#0A0A0A] text-[#F5F5F7] selection:bg-[#C6A969] selection:text-black font-inter overflow-x-hidden snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth">

            {/* HERO SECTION */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center px-6 snap-start">
                <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl">
                            <BrandLogo size={48} className="text-[#C6A969]" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full bg-[#C6A969]/10 border border-[#C6A969]/20 mb-4">
                            <Typography className="text-[10px] font-outfit font-black tracking-[0.4em] text-[#C6A969] uppercase leading-none">
                                The Developer&apos;s Ecosystem
                            </Typography>
                        </div>

                        <Typography element="h1" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-outfit font-black tracking-tight uppercase leading-[1] max-w-4xl mx-auto">
                            Deploy your <br className="hidden md:block" />
                            <span className="text-[#C6A969]">Digital Legacy</span> in Seconds.
                        </Typography>

                        <Typography className="text-xs md:text-sm text-[#AAAAAA] max-w-lg mx-auto font-medium leading-[1.7] px-4 opacity-80">
                            Atom is a high-performance portfolio engine that bridges the gap between your mobile workflow and global web presence.
                            Built for engineers who value precision, speed, and absolute control.
                        </Typography>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 px-4">
                            <Button size="lg" variant="ghost" className="w-full sm:w-auto h-11 px-8 rounded-xl text-white hover:bg-white/5 transition-all font-outfit uppercase tracking-[0.3em] text-[10px] font-black border border-white/5">
                                Live Showcase
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#C6A969]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#C6A969]/40"
                >
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </section>

            {/* PROTOCOL */}
            <section id="protocol" className="relative h-screen min-h-[700px] flex items-center justify-center px-6 snap-start border-t border-white/5">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="space-y-4 text-center lg:text-left">
                                <Typography className="text-[#C6A969] font-black tracking-[0.5em] text-[9px] uppercase">The Workflow</Typography>
                                <Typography element="h2" className="text-3xl md:text-5xl font-outfit font-black tracking-tight uppercase leading-[1.1]">The Atom <br /><span className="text-white/30 italic">Protocol</span></Typography>
                            </div>

                            <div className="space-y-10">
                                {[
                                    { step: "01", title: "Mobile UI Engine", desc: "Design your interface, update projects, and curate your skills in real-time using the Atom Mobile App. No code required." },
                                    { step: "02", title: "Global Sync", desc: "Your data is instantly pushed to our global edge network, ensuring sub-200ms load times for visitors worldwide." },
                                    { step: "03", title: "Domain Gateway", desc: "Point your .com or .dev domain to Atom. Our high-performance middleware handles routing and SSL automatically." }
                                ].map((item, i) => (
                                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex gap-8 group">
                                        <div className="text-[10px] font-black text-[#C6A969] opacity-40 group-hover:opacity-100 transition-opacity mt-1">{item.step}</div>
                                        <div>
                                            <Typography element="h3" className="text-base font-outfit font-bold mb-1 uppercase tracking-tight text-white">{item.title}</Typography>
                                            <Typography className="text-[11px] md:text-xs text-[#AAAAAA] leading-relaxed opacity-70 italic">{item.desc}</Typography>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative hidden lg:block">
                            <div className="aspect-square bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden group flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#C6A969]/5 to-transparent pointer-events-none" />
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <motion.div
                                        animate={{ boxShadow: ["0 0 20px rgba(198, 169, 105, 0.1)", "0 0 40px rgba(198, 169, 105, 0.3)", "0 0 20px rgba(198, 169, 105, 0.1)"] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="w-32 h-32 rounded-full border border-[#C6A969]/30 bg-black/40 backdrop-blur-xl flex items-center justify-center relative z-20"
                                    >
                                        <Globe className="w-12 h-12 text-[#C6A969]" />
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C6A969]/40" />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                    <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: -140, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 1 }} className="absolute p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
                                        <Smartphone className="w-6 h-6 text-white/40" />
                                    </motion.div>
                                    <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 140, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5, duration: 1 }} className="absolute p-4 rounded-2xl border border-[#C6A969]/20 bg-[#C6A969]/5 backdrop-blur-lg">
                                        <Target className="w-6 h-6 text-[#C6A969]" />
                                    </motion.div>
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                                        <motion.path d="M 100 200 Q 150 200 200 200" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 0.5 }} viewport={{ once: true }} transition={{ delay: 2, duration: 1.5 }} />
                                        <motion.path d="M 300 200 Q 250 200 200 200" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="4 4" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 0.5 }} viewport={{ once: true }} transition={{ delay: 2.5, duration: 1.5 }} />
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="white" stopOpacity="0" />
                                                <stop offset="50%" stopColor="#C6A969" />
                                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MOBILE */}
            <section id="mobile" className="relative h-screen min-h-[700px] flex items-center justify-center px-6 snap-start bg-white/[0.01]">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="order-2 lg:order-1 relative flex justify-center">
                            <div className="relative w-full max-w-[260px] h-[520px] bg-[#111111] rounded-[2.5rem] border-[4px] border-white/10 shadow-2xl p-4 overflow-hidden">
                                <div className="flex justify-between items-center px-4 pt-2 mb-6">
                                    <div className="w-10 h-1.5 bg-white/10 rounded-full" />
                                    <div className="w-2.5 h-2.5 rounded-full border border-white/20" />
                                </div>
                                <div className="space-y-6 px-2">
                                    <div className="h-20 w-full bg-white/[0.03] rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                                        <Typography className="text-[7px] font-black text-white/40 uppercase tracking-widest">Network Edge</Typography>
                                        <div className="flex justify-between items-center">
                                            <Typography className="text-[9px] text-[#C6A969] font-bold">saikumar.dev</Typography>
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="h-16 bg-white/[0.03] rounded-xl border border-white/5 p-3 space-y-1">
                                            <Users className="w-3 h-3 text-[#C6A969]" />
                                            <Typography className="text-[12px] font-black text-white">1.2k</Typography>
                                        </div>
                                        <div className="h-16 bg-white/[0.03] rounded-xl border border-white/5 p-3 space-y-1">
                                            <Zap className="w-3 h-3 text-[#C6A969]" />
                                            <Typography className="text-[12px] font-black text-white">99.9%</Typography>
                                        </div>
                                    </div>
                                    <div className="h-24 w-full bg-white/[0.03] rounded-xl border border-white/5 p-4 flex flex-col gap-2">
                                        <div className="h-1 w-full bg-white/5 rounded-full" />
                                        <div className="h-1 w-2/3 bg-white/5 rounded-full" />
                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-0 right-0 flex justify-around items-center px-4 opacity-40">
                                    <div className="w-6 h-6 rounded-lg bg-[#C6A969]" />
                                    <div className="w-6 h-6 rounded-lg bg-white/5" />
                                    <div className="w-6 h-6 rounded-lg bg-white/5" />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="order-1 lg:order-2 space-y-8">
                            <div className="space-y-4">
                                <Typography className="text-[#C6A969] font-black tracking-[0.5em] text-[10px] uppercase">The Gateway</Typography>
                                <Typography element="h2" className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black tracking-tight uppercase leading-[1.1]">Atom <span className="text-white/30">Mobile</span></Typography>
                                <Typography className="text-xs md:text-sm text-[#AAAAAA] max-w-sm leading-relaxed italic text-center lg:text-left mx-auto lg:mx-0">
                                    The entire Atom Ecosystem fits in your pocket. Sync your engineering identity with one tap.
                                </Typography>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { icon: Smartphone, title: "Liquid Sync", desc: "Live site updates in under 1s." },
                                    { icon: Bell, title: "Pulse", desc: "Real-time inquiry push alerts." },
                                    { icon: Lock, title: "Secure", desc: "Credential & API key vaulting." },
                                    { icon: Clock, title: "Edge", desc: "Global presence automation." }
                                ].map((feature, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <feature.icon className="w-4 h-4 text-[#C6A969]" />
                                        </div>
                                        <Typography element="h4" className="text-xs font-outfit font-black uppercase text-white tracking-tight">{feature.title}</Typography>
                                        <Typography className="text-[10px] text-[#AAAAAA] leading-relaxed opacity-60">{feature.desc}</Typography>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 flex justify-center lg:justify-start">
                                <div className="inline-flex flex-col items-center lg:items-start">
                                    <Typography className="text-[8px] font-black tracking-[0.4em] text-[#C6A969] uppercase mb-4">Availability</Typography>
                                    <div className="h-10 px-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3 grayscale opacity-30">
                                        <Typography className="text-[9px] font-black uppercase tracking-widest">Awaiting Store Approval</Typography>
                                    </div>
                                    <Typography className="text-[9px] font-outfit font-bold italic text-white/20 mt-3">Stay Tuned for the Play Store release.</Typography>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TECH STACKS - MODERN MINIMALIST */}
            <section className="relative h-screen min-h-[750px] flex flex-col items-center px-8 snap-start border-t border-white/5 bg-black pt-20 pb-10">
                {/* Subtle Refined Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col items-center justify-center">
                    <div className="text-center mb-12">
                        <motion.div initial={{ opacity: 0, y: -5 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <Typography className="text-[#C6A969] font-bold text-[9px] uppercase mb-3 tracking-normal">Core Infrastructure</Typography>
                            <Typography element="h2" className="text-3xl md:text-5xl font-outfit font-black tracking-tight uppercase leading-none">
                                SYSTEM <span className="text-white/20">PROTOCOLS.</span>
                            </Typography>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 md:px-0 w-full mb-12">
                        {[
                            { icon: Cpu, title: "Edge Performance", detail: "Sub-50ms TTFB global delivery." },
                            { icon: Layers, title: "Native Physics", detail: "Hardware-accelerated engine." },
                            { icon: Database, title: "Real-time State", detail: "Liquid sync across all nodes." },
                            { icon: Cloud, title: "Edge Gateway", detail: "Zero-latency domain proxy." }
                        ].map((tech, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group flex flex-col items-center text-center">
                                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:border-[#C6A969]/30 border border-transparent transition-all">
                                        <tech.icon className="w-4 h-4 text-white/50 group-hover:text-[#C6A969] transition-colors" />
                                    </div>
                                    <Typography className="text-[11px] font-outfit font-black text-white/90 uppercase mb-1 tracking-tight">{tech.title}</Typography>
                                    <Typography className="text-[10px] text-[#AAAAAA] leading-relaxed opacity-60 font-medium tracking-tight">{tech.detail}</Typography>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>

                {/* Refined Footer - Clean & Integrated */}
                <div className="max-w-7xl mx-auto w-full relative z-10 px-6">
                    <footer className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <BrandLogo size={16} className="text-[#C6A969]" />
                                <Typography className="text-[10px] font-black text-white uppercase tracking-tight">ATOM ECOSYSTEM</Typography>
                            </div>
                            <Typography className="text-[10px] font-outfit font-bold text-white/40 uppercase tracking-tight">
                                ARCHITECTED BY <span className="text-white">SAIKUMAR PASUMARTHI</span>
                            </Typography>
                        </div>
                        <Typography className="text-[8px] text-white/20 font-medium uppercase tracking-tight">© 2026 ANTHRIX ENGINEERING • ALL RIGHTS RESERVED.</Typography>
                    </footer>
                </div>
            </section>
        </div>
    );
}
