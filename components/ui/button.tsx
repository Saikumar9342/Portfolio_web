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
                    "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg px-8",
                glass:
                    "glass-panel text-foreground px-8",
                outline:
                    "border border-foreground/10 bg-transparent text-foreground hover:bg-foreground/5 px-8",
                ghost: "bg-transparent text-foreground hover:bg-foreground/5",
                link: "text-accent underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-6",
                sm: "h-8 px-3 text-xs",
                lg: "h-14 px-12 text-base",
                icon: "h-10 w-10",
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
