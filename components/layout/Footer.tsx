"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Github, Linkedin, Twitter, Globe, Copy, Check, Send } from "lucide-react";
import { useState, type MouseEvent, type FormEvent } from "react";
import { Typography, GlassCard } from "@/components/ui/layout";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ContactData, AboutData, NavbarData } from "@/types";
import { BrandLogo } from "../ui/BrandLogo";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "../ui/Toast";

interface FooterProps {
    contact: ContactData;
    about: AboutData;
    navbar: NavbarData;
    name: string;
    targetUserId?: string;
}

export function Footer({ contact, about, navbar, name, targetUserId }: FooterProps) {
    const [isDownloadingResume, setIsDownloadingResume] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { push } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validation Logic
        const name = formData.name.trim();
        const email = formData.email.trim();
        const message = formData.message.trim();
        const newErrors: { [key: string]: string } = {};

        if (name.length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (message.length < 10) {
            newErrors.message = "Message must be at least 10 characters.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            // ADMIN LOGIC: If targetUserId is an admin (or null), use global 'messages'
            // USER LOGIC: If targetUserId is a regular user, use 'users/{uid}/messages'

            const adminUidsString = process.env.NEXT_PUBLIC_ADMIN_UIDS || "";
            const adminUids = adminUidsString.split(",").map(id => id.trim()).filter(Boolean);
            const isAdminTarget = !targetUserId || adminUids.includes(targetUserId);

            const messagesRef = isAdminTarget
                ? collection(db, "messages")
                : collection(db, "users", targetUserId!, "messages");

            await addDoc(messagesRef, {
                ...formData,
                name,
                email,
                message,
                targetUserId: targetUserId || null,
                status: "unread",
                timestamp: serverTimestamp(),
            });

            // Trigger Push Notification via Next.js API
            try {
                // If it's an admin target (global pool), we need to find who to notify.
                // We'll notify the first admin in the list.
                let notifyTarget = targetUserId;
                if (isAdminTarget) {
                    notifyTarget = adminUids.length > 0 ? adminUids[0] : undefined;
                }

                if (notifyTarget) {
                    await fetch("/api/notify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            targetUserId: notifyTarget,
                            title: isAdminTarget ? `🚀 New Lead: ${name}` : `📩 Message from ${name}`,
                            body: `"${message.substring(0, 150)}${message.length > 150 ? "..." : ""}"\n\n📧 ${email}`,
                        }),
                    });
                }
            } catch (notifyError) {
                console.error("Failed to trigger notification:", notifyError);
            }

            setSubmitSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error("Error sending message:", error);
            push("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer id="contact" className="min-h-screen flex flex-col justify-center relative overflow-hidden border-t border-foreground/10 bg-foreground/5">
            {/* Ambient Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_60%)] opacity-[0.03] blur-3xl pointer-events-none"
            />

            <div className="container px-6 mx-auto max-w-6xl relative z-10 flex flex-col justify-center py-12 md:py-24">
                {/* Contact Section */}
                <div className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <Typography element="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase text-foreground leading-[1.1]">
                                    {contact.title}
                                </Typography>
                                <Typography className="text-lg text-muted-foreground leading-relaxed max-w-md font-medium">
                                    {contact.description}
                                </Typography>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-8 w-full">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                                    <a
                                        href={`mailto:${contact.email}?subject=Portfolio Inquiry`}
                                        className={buttonVariants({
                                            size: "lg",
                                            className: "w-full sm:w-auto rounded-xl px-12 h-16 text-sm font-bold uppercase tracking-widest shadow-2xl shadow-accent/10 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                                        })}
                                    >
                                        {contact.cta}
                                    </a>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                                    <a
                                        href={resumeDownloadUrl}
                                        onClick={handleResumeDownload}
                                        download="resume.pdf"
                                        aria-busy={isDownloadingResume}
                                        className={`w-full sm:w-auto rounded-xl px-12 h-16 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest border border-foreground/20 text-foreground transition-all duration-300 hover:bg-foreground/5 ${isDownloadingResume ? "opacity-80 cursor-not-allowed" : ""}`}
                                    >
                                        {isDownloadingResume ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>PROCESSING</span>
                                            </>
                                        ) : (
                                            contact.secondaryCta
                                        )}
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <GlassCard className="form-glass p-8 md:p-12 border border-accent/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-3xl relative bg-black/40 backdrop-blur-3xl overflow-visible">
                                <div className="absolute -top-px -left-px w-12 h-12 border-t-2 border-l-2 border-accent z-20" />
                                <div className="absolute -bottom-px -right-px w-12 h-12 border-b-2 border-r-2 border-accent z-20" />

                                <AnimatePresence mode="wait">
                                    {submitSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                                        >
                                            <div className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center mb-4">
                                                <Check className="w-10 h-10 text-accent" />
                                            </div>
                                            <Typography className="text-xl font-bold uppercase tracking-tight text-foreground">
                                                Message Received
                                            </Typography>
                                            <Typography className="text-sm text-muted-foreground max-w-[280px]">
                                                Thank you for reaching out. I&apos;ve received your inquiry and will get back to you shortly.
                                            </Typography>
                                            <Button
                                                variant="outline"
                                                className="mt-6 rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold"
                                                onClick={() => setSubmitSuccess(false)}
                                            >
                                                Send Another
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleFormSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 px-1">{contact.formNameLabel || "Full Name"}</label>
                                                    <Input
                                                        placeholder={contact.formNamePlaceholder || "John Doe"}
                                                        className={`h-14 !bg-black/20 border-foreground/10 rounded-xl focus:ring-1 focus:ring-accent text-foreground transition-all placeholder:text-muted-foreground/30 ${errors.name ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                    />
                                                    {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider px-1">{errors.name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 px-1">{contact.formEmailLabel || "Email Address"}</label>
                                                    <Input
                                                        type="email"
                                                        placeholder={contact.formEmailPlaceholder || "john@example.com"}
                                                        className={`h-14 !bg-black/20 border-foreground/10 rounded-xl focus:ring-1 focus:ring-accent text-foreground transition-all placeholder:text-muted-foreground/30 ${errors.email ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                    />
                                                    {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider px-1">{errors.email}</p>}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 px-1">{contact.formSubjectLabel || "Subject (Optional)"}</label>
                                                <Input
                                                    placeholder={contact.formSubjectPlaceholder || "Project Inquiry"}
                                                    className="h-14 !bg-black/20 border-foreground/10 rounded-xl focus:ring-1 focus:ring-accent text-foreground transition-all placeholder:text-muted-foreground/30"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 px-1">{contact.formMessageLabel || "Your Message"}</label>
                                                <Textarea
                                                    placeholder={contact.formMessagePlaceholder || "How can I help you?"}
                                                    className={`min-h-[140px] !bg-black/20 border-foreground/10 rounded-xl focus:ring-1 focus:ring-accent text-foreground resize-none transition-all placeholder:text-muted-foreground/30 ${errors.message ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    required
                                                />
                                                {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider px-1">{errors.message}</p>}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full h-16 rounded-xl text-sm font-bold uppercase tracking-[0.4em] shadow-xl shadow-accent/20 flex items-center justify-center gap-3 group bg-accent text-accent-foreground hover:bg-accent/90 transition-all active:scale-[0.98] border border-transparent"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-3">
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>PROCESSING...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        SEND INQUIRY
                                                        <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-foreground/10">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-5 space-y-4"
                    >
                        <Link href={targetUserId ? `/p/${targetUserId}` : "/"} className="flex items-center gap-3 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center justify-center transition-transform"
                            >
                                <BrandLogo className="text-foreground" size={32} />
                            </motion.div>
                            <span className="text-xl font-bold tracking-tighter text-foreground uppercase">{navbar?.logoText || name.charAt(0).toLowerCase()}</span>
                        </Link>
                        <Typography className="text-sm text-muted-foreground leading-relaxed max-w-sm font-medium">
                            {about.title}
                        </Typography>
                        <div className="flex items-center gap-3 pt-2">
                            {about.socialLinks?.map((link: any, idx: number) => (
                                <motion.div
                                    key={link.url}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                >
                                    <Link href={link.url} target="_blank" className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 border border-foreground/5">
                                        {link.platform.toLowerCase() === 'github' && <Github className="w-4 h-4" />}
                                        {link.platform.toLowerCase() === 'linkedin' && <Linkedin className="w-4 h-4" />}
                                        {link.platform.toLowerCase() === 'twitter' && <Twitter className="w-4 h-4" />}
                                        {['github', 'linkedin', 'twitter'].indexOf(link.platform.toLowerCase()) === -1 && <Globe className="w-4 h-4" />}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-3 space-y-6"
                    >
                        <Typography className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Links</Typography>
                        <ul className="space-y-3">
                            {navbar?.items.map((item: any, idx: number) => {
                                let href = item.href;
                                if (targetUserId) {
                                    if (href === '/projects') href = `/p/${targetUserId}/projects`;
                                    else if (href === '/#about') href = `/p/${targetUserId}#about`;
                                    else if (href === '/#skills') href = `/p/${targetUserId}#skills`;
                                    else if (href.startsWith('#')) href = `/p/${targetUserId}${href}`;
                                    else if (href.startsWith('/') && href !== '/') href = `/p/${targetUserId}${href}`;
                                }

                                return (
                                    <motion.li
                                        key={item.label}
                                        whileHover={{ x: 10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Link href={href} className="text-xs text-foreground/70 hover:text-accent transition-colors font-bold uppercase tracking-wider inline-flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {item.label}
                                        </Link>
                                    </motion.li>
                                )
                            })}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-4 space-y-6"
                    >
                        <Typography className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Contact</Typography>
                        <div className="space-y-4">
                            <button
                                onClick={handleCopyEmail}
                                className="group flex items-center gap-2 text-left hover:bg-foreground/5 p-4 -ml-4 rounded-2xl transition-all"
                                title="Click to copy email"
                            >
                                <div className="space-y-1">
                                    <span className="block text-base font-bold text-foreground group-hover:text-accent transition-colors tracking-tight">
                                        {contact.email}
                                    </span>
                                    {isCopied && <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-accent font-bold uppercase tracking-wider block">Copied to clipboard!</motion.span>}
                                </div>
                                <div className="text-muted-foreground group-hover:text-accent transition-colors">
                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </div>
                            </button>

                            <Typography className="text-xs text-foreground/60 leading-relaxed font-medium">
                                {about.location}
                            </Typography>
                            <div className="pt-2">
                                <Button size="sm" variant="outline" className="rounded-xl px-6 h-10 font-bold uppercase tracking-widest text-[10px] hover:bg-accent hover:text-accent-foreground border-foreground/10 transition-all" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                    Back to Top
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-12 pt-6 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <span>(c) {new Date().getFullYear()} {name}. All Rights Reserved.</span>
                        <span className="hidden md:block opacity-20">|</span>
                        <span className="text-accent/60">Powered by Anthrix</span>
                    </div>
                    <div className="flex gap-6">
                        <span className="hover:text-foreground cursor-pointer transition-colors hover:translate-y-[-2px]">Privacy</span>
                        <span className="hover:text-foreground cursor-pointer transition-colors hover:translate-y-[-2px]">Terms</span>
                    </div>
                </div>
            </div>
        </footer >
    );
}
