import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string;
    size?: number;
}

export const BrandLogo = ({ className, size = 44 }: BrandLogoProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("drop-shadow-sm", className)}
        >
            <path d="M65 10H85L65 90H45L65 10Z" fill="currentColor" />
            <circle cx="32.5" cy="67.5" r="22.5" fill="currentColor" />
        </svg>
    );
};
