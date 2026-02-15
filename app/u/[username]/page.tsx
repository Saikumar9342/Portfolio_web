"use client";

import { useParams } from "next/navigation";
import { usePortfolio } from "@/hooks/usePortfolio";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { NotFoundScreen } from "@/components/ui/NotFoundScreen";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, Typography, GlassCard } from "@/components/ui/layout";
import { motion } from "framer-motion";

// We reuse the PortfolioContent logic or just redirect to our hook-based page
// But to avoid redirecting the URL, we render the mobile-style wrapper here.

const PortfolioContent = ({ data, userId }: { data: any; userId?: string }) => {
    const { contact, hero, about, expertise, skills, name } = data;

    return (
        <main className="relative min-h-screen">
            <div className="relative z-10">
                <Navbar name={name} data={data.navbar} contact={contact} loading={false} userId={userId} />
                <Hero data={hero} role={data.role} name={name} location={about.location} userId={userId} />
                <About about={about} expertise={expertise} contact={contact} />
                <Section id="skills" className="min-h-screen flex items-center py-24 border-t border-border/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
                        <GlassCard className="p-8 space-y-6 self-start">
                            <Typography className="text-sm font-semibold text-accent tracking-widest uppercase">{skills.frameworksTitle || "Toolbox"}</Typography>
                            <Typography element="h2" className="text-4xl md:text-5xl font-bold text-foreground leading-tight">{skills.title || "Technical Expertise"}</Typography>
                            <Typography className="text-lg text-muted-foreground leading-relaxed">{skills.description || "A comprehensive suite of technologies."}</Typography>
                        </GlassCard>
                        <div className="lg:col-span-2 flex flex-wrap gap-4">
                            {/* Simplified skills for the wrapper page */}
                            <Typography className="text-muted-foreground italic">Technical details available in main view.</Typography>
                        </div>
                    </div>
                </Section>
                <Footer contact={contact} about={about} navbar={data.navbar} name={name} targetUserId={userId} />
            </div>
        </main>
    );
};

export default function UsernamePortfolioPage() {
    const params = useParams();
    const username = params?.username as string | undefined;
    const { data, loading, notFound } = usePortfolio(username);

    if (loading) return <LoadingScreen />;
    if (notFound) return <NotFoundScreen />;

    return <PortfolioContent data={data} userId={username} />;
}
