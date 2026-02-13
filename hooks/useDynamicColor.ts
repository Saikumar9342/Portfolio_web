"use client";

import { useState, useEffect } from "react";

export function useDynamicColor(imageSrc: string) {
    const [color, setColor] = useState<string>("#ff0000"); // Default to Red

    useEffect(() => {
        if (!imageSrc) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;

        const applyTheme = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const samples: Uint8ClampedArray[] = [];
            const step = 15; // More samples
            for (let y = 0; y < img.height; y += step) {
                for (let x = 0; x < img.width; x += step) {
                    samples.push(ctx.getImageData(x, y, 1, 1).data);
                }
            }

            let bestColor = [255, 0, 0, 255]; // Fallback to Red
            let maxScore = -1;

            samples.forEach(s => {
                const r = s[0], g = s[1], b = s[2], a = s[3];
                if (a < 200) return;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const saturation = max === 0 ? 0 : (max - min) / max;
                const brightness = max / 255;

                // Extremely heavy bias towards red/vibrant colors
                const redBias = (r > g * 1.2 && r > b * 1.2) ? 4.0 : 1.0;
                const score = saturation * brightness * redBias;

                if (score > maxScore) {
                    maxScore = score;
                    bestColor = [r, g, b, a];
                }
            });

            // If we didn't find a very strong color, force any noticeable red
            if (maxScore < 0.2) {
                samples.forEach(s => {
                    const r = s[0], g = s[1], b = s[2];
                    if (r > 150 && r > g * 2 && r > b * 2) {
                        bestColor = [r, g, b, 255];
                    }
                });
            }

            const r = bestColor[0], g = bestColor[1], b = bestColor[2];
            const rgbToHex = (r: number, g: number, b: number) =>
                `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

            const accentHex = rgbToHex(r, g, b);

            // Background is deep version of the color
            const bgHex = rgbToHex(Math.round(r * 0.04), Math.round(g * 0.04), Math.round(b * 0.04));

            const root = document.documentElement;
            root.style.setProperty('--dynamic-bg', bgHex);
            root.style.setProperty('--dynamic-accent', accentHex);
            root.style.setProperty('--dynamic-fg', '#ffffff');
            root.style.setProperty('--dynamic-muted', `rgba(${r}, ${g}, ${b}, 0.1)`);
            root.style.setProperty('--dynamic-muted-fg', `rgba(255, 255, 255, 0.6)`);
            root.style.setProperty('--dynamic-border', `rgba(${r}, ${g}, ${b}, 0.2)`);

            setColor(accentHex);
        };

        img.onload = applyTheme;
        if (img.complete) applyTheme();
    }, [imageSrc]);

    return color;
}
