"use client";

import { motion } from "framer-motion";
import { Loader2, Github, Linkedin, Twitter, Globe, Copy, Check } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { Typography } from "@/components/ui/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ContactData, AboutData, NavbarData } from "@/types";
import { BrandLogo } from "../ui/BrandLogo";

interface FooterProps {
    contact: ContactData;
    about: AboutData;
    navbar: NavbarData;
    name: string;
}

export function Footer({ contact, about, navbar, name }: FooterProps) {
    const [isDownloadingResume, setIsDownloadingResume] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const resumeUrl = contact.resumeUrl || "/Saikumar.p_FrontendDeveloper.pdf";
    const isCloudinary = resumeUrl.includes("res.cloudinary.com");

    // Use API proxy for Cloudinary, direct for others
    const resumeDownloadUrl = isCloudinary
        ? `/api/resume?url=${encodeURIComponent(resumeUrl)}`
        : resumeUrl;

    const getFileNameFromDisposition = (value: string | null) => {
        if (!value) return null;
        const match = value.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
        return match ? decodeURIComponent(match[1]) : null;
    };

    const handleResumeDownload = async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (isDownloadingResume) return;
        setIsDownloadingResume(true);

        try {
            const response = await fetch(resumeDownloadUrl, { method: "GET" });
            if (!response.ok) throw new Error("Resume download failed");

            const blob = await response.blob();
            const fileName =
                getFileNameFromDisposition(response.headers.get("content-disposition")) ||
                "resume.pdf";

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            window.location.href = resumeDownloadUrl;
        } finally {
            setIsDownloadingResume(false);
        }
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(contact.email);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <footer id="contact" className="min-h-screen flex flex-col justify-center relative overflow-hidden border-t border-foreground/10 bg-foreground/5">
            <div className="container px-6 mx-auto max-w-6xl relative z-10 flex flex-col justify-center py-12 md:py-24">
                {/* Contact CTA Section */}
                <div className="mb-16 text-center space-y-8 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <Typography element="h2" className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
                            {contact.title}
                        </Typography>
                        <Typography className="text-lg text-muted-foreground leading-relaxed">
                            {contact.description}
                        </Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <a
                                href={`mailto:${contact.email}?subject=Portfolio Inquiry`}
                                className={buttonVariants({
                                    size: "lg",
                                    className: "rounded-2xl px-12 h-16 text-sm font-black uppercase tracking-widest shadow-2xl shadow-accent/20"
                                })}
                            >
                                {contact.cta}
                            </a>
                            <a
                                href={resumeDownloadUrl}
                                onClick={handleResumeDownload}
                                download="resume.pdf"
                                aria-busy={isDownloadingResume}
                                className={`rounded-2xl px-12 h-16 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest border border-foreground/10 text-foreground transition-all duration-300 ${isDownloadingResume
                                    ? "opacity-80 cursor-not-allowed"
                                    : "hover:bg-foreground/10"
                                    }`}
                            >
                                {isDownloadingResume && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isDownloadingResume ? "Processing..." : contact.secondaryCta}
                            </a>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-foreground/10">
                    {/* Brand Column */}
                    <div className="md:col-span-5 space-y-4">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="transition-transform group-hover:scale-105">
                                <BrandLogo className="text-foreground" size={32} />
                            </div>
                            <span className="text-lg font-bold tracking-tighter text-foreground uppercase">ATOM</span>
                        </Link>
                        <Typography className="text-sm text-muted-foreground leading-relaxed max-w-sm font-medium">
                            {about.title}
                        </Typography>
                        <div className="flex items-center gap-3 pt-2">
                            {about.socialLinks?.map((link: any) => (
                                <Link key={link.url} href={link.url} target="_blank" className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 border border-foreground/5">
                                    {link.platform.toLowerCase() === 'github' && <Github className="w-4 h-4" />}
                                    {link.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-4 h-4" />}
                                    {link.platform.toLowerCase() === 'twitter' && <Twitter className="w-4 h-4" />}
                                    {['github', 'linkedin', 'twitter'].indexOf(link.platform.toLowerCase()) === -1 && <Globe className="w-4 h-4" />}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 space-y-6">
                        <Typography className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Links</Typography>
                        <ul className="space-y-3">
                            {navbar?.items.map((item: any) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-xs text-foreground/70 hover:text-accent transition-colors font-bold uppercase tracking-wider">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4 space-y-6">
                        <Typography className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Contact</Typography>
                        <div className="space-y-4">
                            <button
                                onClick={handleCopyEmail}
                                className="group flex items-center gap-2 text-left hover:bg-foreground/5 p-2 -ml-2 rounded-lg transition-colors"
                                title="Click to copy email"
                            >
                                <div className="space-y-1">
                                    <span className="block text-base font-bold text-foreground group-hover:text-accent transition-colors tracking-tight">
                                        {contact.email}
                                    </span>
                                    {isCopied && <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Copied to clipboard!</span>}
                                </div>
                                <div className="text-muted-foreground group-hover:text-accent transition-colors">
                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </div>
                            </button>

                            <Typography className="text-xs text-foreground/60 leading-relaxed font-medium">
                                {about.location}
                            </Typography>
                            <div className="pt-2">
                                <Button size="sm" variant="outline" className="rounded-lg px-4 h-8 font-bold uppercase tracking-widest text-[10px]" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                    Back to Top
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>(c) {new Date().getFullYear()} {name}. All Rights Reserved.</span>
                    <div className="flex gap-6">
                        <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
