"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
    "flex w-full rounded-lg border border-input bg-background bg-clip-padding text-sm transition-all outline-none select-none",
    {
        variants: {
            size: {
                default: "h-11 px-3 py-2",
                sm: "h-9 px-2.5 text-xs",
                lg: "h-12 px-4 text-base",
            },
            variant: {
                default:
                    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                subtle:
                    "bg-muted border-transparent focus-visible:ring-3 focus-visible:ring-ring/40",
                ghost:
                    "border-transparent bg-transparent focus-visible:ring-0 focus-visible:border-transparent",
            },
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
);

function Input({
    className,
    size,
    variant,
    type = "text",
    ...props
}: InputPrimitive.Props & VariantProps<typeof inputVariants>) {
    return (
        <InputPrimitive
            data-slot="input"
            type={type}
            className={cn(
                inputVariants({ size, variant }),
                "placeholder:text-muted-foreground",
                "disabled:pointer-events-none disabled:opacity-50",
                "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                className
            )}
            {...props}
        />
    );
}

export { Input, inputVariants };