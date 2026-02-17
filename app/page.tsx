"use client";

import { AtomLanding } from "@/components/home/AtomLanding";
import { Navbar } from "@/components/layout/Navbar";
import { usePortfolio } from "@/hooks/usePortfolio";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
    // The root page is explicitly hijacked to be the Brand Landing Page (Atom).
    // Subdomains and custom domains are handled by middleware.ts to rewrite to /p/[userId].
    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            <Navbar
                name="Atom"
                data={{
                    items: [
                        { label: "Protocol", href: "#protocol" },
                        { label: "Mobile", href: "#mobile" }
                    ],
                    logoText: "ATOM",
                    ctaText: "Get Atom"
                }}
                contact={{ email: "saikumar.p9342@gmail.com" } as any}
            />

            <AtomLanding />

        </main>
    );
}
