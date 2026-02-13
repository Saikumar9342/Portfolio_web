"use client";

import { useState, useEffect } from "react";

export function useDynamicColor(imageSrc: string) {
    const [color, setColor] = useState<string>("transparent");

    useEffect(() => {
        if (!imageSrc) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Sample multiple points from the corners to get the best background match
            const samples = [
                ctx.getImageData(5, 5, 1, 1).data,
                ctx.getImageData(img.width - 5, 5, 1, 1).data,
                ctx.getImageData(5, img.height - 5, 1, 1).data,
                ctx.getImageData(img.width - 5, img.height - 5, 1, 1).data
            ];

            const r = Math.round(samples.reduce((a, b) => a + b[0], 0) / samples.length);
            const g = Math.round(samples.reduce((a, b) => a + b[1], 0) / samples.length);
            const b = Math.round(samples.reduce((a, b) => a + b[2], 0) / samples.length);

            // Set the background color
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            setColor(hex);

            // Sync with root variables
            const root = document.documentElement;
            root.style.setProperty('--dynamic-bg', hex);

            // Auto-adjust foreground based on extracted background brightness
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            const isDark = brightness < 128;
            root.style.setProperty('--foreground', isDark ? '#ffffff' : '#0a0a0b');
            root.style.setProperty('--muted-foreground', isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)');
            root.style.setProperty('--border', isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
            root.style.setProperty('--accent', isDark ? '#ffffff' : '#171717');
        };
    }, [imageSrc]);

    return color;
}
