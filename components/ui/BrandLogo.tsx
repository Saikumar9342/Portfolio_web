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
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("drop-shadow-sm", className)}
            role="img"
            aria-label="ATOM Logo"
        >
            <path d="M62 14H80L116 114H98L62 14Z" fill="currentColor" />
            <ellipse
                cx="39"
                cy="66"
                rx="26"
                ry="19"
                transform="rotate(-34 39 66)"
                stroke="currentColor"
                strokeWidth="6"
            />
            <ellipse
                cx="39"
                cy="66"
                rx="18"
                ry="12.5"
                transform="rotate(-34 39 66)"
                stroke="currentColor"
                strokeWidth="6"
            />
            <path
                d="M48 77C58 74 67 66 72 54"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    );
};
