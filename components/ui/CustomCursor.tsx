"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);

    // Smooth movement for the outer ring
    const cursorX = useSpring(0, { damping: 25, stiffness: 120 });
    const cursorY = useSpring(0, { damping: 25, stiffness: 120 });

    // Direct movement for the inner dot
    const dotX = useSpring(0, { damping: 40, stiffness: 400 });
    const dotY = useSpring(0, { damping: 40, stiffness: 400 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            dotX.set(e.clientX);
            dotY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.getAttribute("role") === "button" ||
                target.getAttribute("data-cursor-hover");

            setIsHovering(!!isInteractive);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY, dotX, dotY]);

    return (
        <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
            {/* Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent/50 mix-blend-difference flex items-center justify-center"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    opacity: isHovering ? 0.5 : 1,
                    backgroundColor: isHovering ? "var(--accent)" : "transparent",
                    borderColor: isHovering ? "var(--accent)" : "var(--accent)",
                }}
                transition={{ duration: 0.2 }}
            />
            {/* Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 0.5 : 1,
                }}
            />
        </div>
    );
}
