"use client";

import { motion } from "framer-motion";
import { Typography } from "./layout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function NotFoundScreen() {
    return (
        <div className="relative w-full min-h-screen z-[500] bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            {/* Background & Effects Wrapper */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" />

                {/* Corner Accents */}
                <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-white/10 rounded-tl-3xl opacity-50" />
                <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-white/10 rounded-br-3xl opacity-50" />
            </div>

            <div className="relative flex flex-col items-center gap-8 z-10 max-w-lg">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <Typography className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-white/10 select-none">
                        404
                    </Typography>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Typography className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase">
                            Narrative Lost
                        </Typography>
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <Typography className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
                        The portfolio you&apos;re looking for doesn&apos;t exist or is currently private.
                    </Typography>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-8"
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Return to Hub
                    </Link>
                </motion.div>
            </div>

            <div className="absolute bottom-12 left-0 right-0">
                <Typography className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                    System Response: 404_NOT_FOUND
                </Typography>
            </div>
        </div>
    );
}
