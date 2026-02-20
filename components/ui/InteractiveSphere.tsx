"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function InteractiveSphere() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(smoothY, [-1, 1], [45, -45]);
    const rotateY = useTransform(smoothX, [-1, 1], [-45, 45]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
            mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative w-full h-[400px] flex items-center justify-center pointer-events-none perspective-[1000px]">
            <motion.div
                className="relative w-64 h-64 md:w-80 md:h-80 preserve-3d"
                style={{ rotateX, rotateY }}
            >
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-accent/20 border-r-accent/60 shadow-[0_0_15px_rgba(var(--accent),0.1)]"
                        initial={{ rotateY: 0, rotateZ: 0 }}
                        animate={{
                            rotateY: 360,
                            rotateZ: 360,
                        }}
                        transition={{
                            duration: 20 + (i % 5) * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: -i,
                        }}
                        style={{
                            transform: `rotateY(${(i * 360) / 30}deg) rotateX(${(i * 360) / 30}deg)`,
                        }}
                    />
                ))}
                {/* Core glow */}
                <div className="absolute inset-1/4 rounded-full bg-accent/20 blur-2xl animate-pulse" />
            </motion.div>
        </div>
    );
}
