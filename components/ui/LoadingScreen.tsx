"use client";

import { motion } from "framer-motion";
import { Typography } from "./layout";

export function LoadingScreen() {
    return (
        <div className="relative w-full min-h-screen z-[500] bg-black text-white flex flex-col items-center justify-center">
            {/* Background & Effects Wrapper */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />

                {/* Corner Accents */}
                <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-3xl opacity-50" />
                <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-3xl opacity-50" />
            </div>

            <div className="relative flex flex-col items-center gap-12 z-10">
                {/* Wave Loader */}
                <div className="flex items-end gap-1.5 h-16">
                    {[...Array(9)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 8 }}
                            animate={{
                                height: [8, 64, 8],
                                backgroundColor: [
                                    "rgba(255,255,255,0.25)",
                                    "#ffffff",
                                    "rgba(255,255,255,0.25)"
                                ]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.1
                            }}
                            className="w-1.5 rounded-full"
                        />
                    ))}
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 text-center">
                            Synchronizing Experience
                        </Typography>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1 h-1 rounded-full bg-white"
                        />
                        <Typography className="text-sm font-bold tracking-tighter text-foreground uppercase">
                            Preparing Narrative
                        </Typography>
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            className="w-1 h-1 rounded-full bg-white"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
