"use client";

import { useState, useEffect } from "react";

export function useDynamicColor(imageSrc: string, options?: { lockBackground?: boolean, theme?: string }) {
    const [color, setColor] = useState<string>("transparent");
    const lockBackground = options?.lockBackground ?? false;
    const theme = options?.theme;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        const root = document.documentElement;
        // Use a temporary class to avoid flash while the image loads
        if (!lockBackground) {
            root.classList.add('theme-loading');
        }

        if (!imageSrc) {
            root.classList.remove('theme-loading');
            setIsLoading(false);
            return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous"; // Capital A for consistency, though 'anonymous' works too
        img.src = imageSrc;

        const applyTheme = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                if (!ctx) {
                    setIsLoading(false);
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // 1. EXTRACT BACKGROUND COLOR (Sample the corners)
                const cornerSamples = [
                    ctx.getImageData(5, 5, 1, 1).data,
                    ctx.getImageData(img.width - 5, 5, 1, 1).data,
                    ctx.getImageData(5, img.height - 5, 1, 1).data,
                    ctx.getImageData(img.width - 5, img.height - 5, 1, 1).data
                ];

                const bgR_raw = Math.round(cornerSamples.reduce((a, b) => a + b[0], 0) / 4);
                const bgG_raw = Math.round(cornerSamples.reduce((a, b) => a + b[1], 0) / 4);
                const bgB_raw = Math.round(cornerSamples.reduce((a, b) => a + b[2], 0) / 4);

                // ENFORCE DARK MODE: 
                // Clamp brightness to a "Deep Theme" level (approx 15-20% lightness).
                // This ensures colorful backgrounds (deep red, deep blue) are visible
                // but avoids the "muddy yellow" or "blinding white" issues.
                const maxAllowedBrightness = 45;
                const currentMax = Math.max(bgR_raw, bgG_raw, bgB_raw);

                let bgR = bgR_raw;
                let bgG = bgG_raw;
                let bgB = bgB_raw;

                if (currentMax > maxAllowedBrightness) {
                    const ratio = maxAllowedBrightness / currentMax;
                    bgR = Math.floor(bgR_raw * ratio);
                    bgG = Math.floor(bgG_raw * ratio);
                    bgB = Math.floor(bgB_raw * ratio);
                } else if (currentMax < 20) {
                    // If it's too dark (pitch black), slightly boost it so it's not void-like
                    // This helps when the image is mostly black but has some color
                    const ratio = 25 / Math.max(currentMax, 1);
                    bgR = Math.min(255, Math.floor(bgR_raw * ratio));
                    bgG = Math.min(255, Math.floor(bgG_raw * ratio));
                    bgB = Math.min(255, Math.floor(bgB_raw * ratio));
                }

                const rgbToHex = (r: number, g: number, b: number) =>
                    `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

                const bgHex = rgbToHex(bgR, bgG, bgB);

                // 2. EXTRACT ACCENT COLOR (Find the most vibrant color in the whole image)
                const samples: Uint8ClampedArray[] = [];
                const step = 20;
                for (let y = 0; y < img.height; y += step) {
                    for (let x = 0; x < img.width; x += step) {
                        samples.push(ctx.getImageData(x, y, 1, 1).data);
                    }
                }

                let accentColor: Uint8ClampedArray = cornerSamples[0];
                let maxVibrancy = -1;

                samples.forEach(s => {
                    const r = s[0], g = s[1], b = s[2], a = s[3];
                    if (a < 128) return; // Skip transparent

                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const saturation = max === 0 ? 0 : (max - min) / max;
                    const brightness = max / 255;
                    const vibrancy = saturation * brightness;

                    if (vibrancy > maxVibrancy) {
                        maxVibrancy = vibrancy;
                        accentColor = s;
                    }
                });

                const accR = accentColor[0], accG = accentColor[1], accB = accentColor[2];
                const accentHex = rgbToHex(accR, accG, accB);

                // 3. APPLY TO CSS VARIABLES
                if (!lockBackground) {
                    root.style.setProperty('--dynamic-bg', bgHex);
                    root.style.setProperty('--dynamic-accent', accentHex);

                    // Contrast handling for Foreground (Text) based on explicit theme or background brightness
                    const bgBrightness = (bgR * 299 + bgG * 587 + bgB * 114) / 1000;
                    const isDarkBg = theme === 'dark' || (theme !== 'light' && bgBrightness < 150);

                    root.style.setProperty('--dynamic-fg', isDarkBg ? '#ffffff' : '#0a0a0b');
                    root.style.setProperty('--dynamic-muted-fg', isDarkBg ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)');
                    root.style.setProperty('--dynamic-border', isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
                    root.style.setProperty('--dynamic-muted', isDarkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)');

                    // Force background color based on explicit theme if provided
                    if (theme === 'dark') {
                        // Enforce dark background if the calculated bg is actually light
                        if (bgBrightness >= 150) {
                            const ratio = 45 / Math.max(bgR, bgG, bgB, 1);
                            root.style.setProperty('--dynamic-bg', rgbToHex(
                                Math.floor(bgR * ratio), Math.floor(bgG * ratio), Math.floor(bgB * ratio)
                            ));
                        }
                    } else if (theme === 'light') {
                        // Enforce light background if the calculated bg is actually dark
                        if (bgBrightness < 150) {
                            const ratio = 240 / Math.max(bgR, bgG, bgB, 1);
                            root.style.setProperty('--dynamic-bg', rgbToHex(
                                Math.min(255, Math.floor(bgR * ratio)),
                                Math.min(255, Math.floor(bgG * ratio)),
                                Math.min(255, Math.floor(bgB * ratio))
                            ));
                        }
                    }

                } else {
                    // Only update the accent, reset background/foreground to CSS defaults
                    const isDarkBg = theme !== 'light'; // Default to dark if auto or dark or undefined
                    root.style.setProperty('--dynamic-accent', accentHex);
                    root.style.removeProperty('--dynamic-bg');
                    root.style.setProperty('--dynamic-fg', isDarkBg ? '#ffffff' : '#0a0a0b');
                    root.style.setProperty('--dynamic-muted-fg', isDarkBg ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)');
                    root.style.setProperty('--dynamic-border', isDarkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
                    root.style.setProperty('--dynamic-muted', isDarkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)');
                }

                setColor(accentHex);
                root.classList.remove('theme-loading');
                setIsLoading(false);
            } catch (e) {
                console.warn("Failed to extract colors from image:", e);
                root.classList.remove('theme-loading');
                setIsLoading(false);
            }
        };

        img.onload = applyTheme;
        img.onerror = () => {
            root.classList.remove('theme-loading');
            setIsLoading(false);
        }
        if (img.complete) applyTheme();
    }, [imageSrc]);

    return { color, isLoading };
}
