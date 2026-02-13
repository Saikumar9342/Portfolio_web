"use client";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg",
                glass:
                    "bg-white/60 text-slate-900 border border-solid shadow-sm dark:bg-slate-800/60 dark:text-white dark:border-slate-700",
                outline:
                    "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
                ghost: "bg-transparent text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                link: "text-sky-600 underline-offset-4 hover:underline dark:text-sky-400 dark:hover:text-sky-300",
            },
            size: {
                default: "h-10 px-6",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-full px-10",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
