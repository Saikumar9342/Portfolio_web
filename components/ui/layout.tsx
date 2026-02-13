"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    grid?: boolean;
    container?: boolean;
}

export function Section({ children, className, id, grid = false, container = true }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "relative py-20 overflow-hidden transition-colors duration-500",
                grid && "bg-grid bg-transparent",
                className
            )}
        >
            {grid && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
                    <div className="architect-corner top-0 left-0 border-l border-t opacity-40" />
                    <div className="architect-corner bottom-0 right-0 border-r border-b opacity-40" />
                </>
            )}
            <div className={cn(container && "container mx-auto px-4 md:px-8 relative z-10")}>
                {children}
            </div>
        </section>
    );
}

interface TypographyProps {
    children: React.ReactNode;
    className?: string;
    element?: "h1" | "h2" | "h3" | "p" | "span";
    gradient?: boolean;
}

export function Typography({ children, className, element = "p", gradient = false }: TypographyProps) {
    const Component = element;

    const styles = cn(
        element === "h1" && "text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]",
        element === "h2" && "text-2xl md:text-3xl font-semibold tracking-tight leading-snug",
        element === "h3" && "text-base md:text-lg font-medium tracking-tight",
        element === "p" && "text-slate-600 text-base md:text-base leading-relaxed",
        gradient && "text-gradient",
        className
    );

    return <Component className={styles}>{children}</Component>;
}

export function GlassCard({ children, className, hover = true }: { children: React.ReactNode, className?: string, hover?: boolean }) {
    return (
        <div className={cn(
            "glass-panel rounded-3xl p-8",
            hover && "hover:border-white/20 hover:bg-white/5",
            className
        )}>
            {children}
        </div>
    );
}
