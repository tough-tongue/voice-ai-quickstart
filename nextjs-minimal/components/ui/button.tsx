/**
 * Button Component - Minimal Design System
 *
 * A minimal button system with 4 variants and 4 sizes.
 * Designed for optimal contrast in both light and dark modes.
 *
 * Variants:
 * - default: Primary teal CTA
 * - outline: Bordered secondary action
 * - ghost: Minimal/icon buttons
 * - destructive: Dangerous actions (delete, clear)
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 cursor-pointer",
  {
    variants: {
      variant: {
        // Primary - teal CTA
        default:
          "bg-teal-600 text-white shadow-sm hover:bg-teal-700 active:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-600",
        // Outline - bordered with hover fill
        outline:
          "border-2 border-border bg-transparent text-foreground shadow-sm hover:bg-accent hover:border-teal-500/50 active:bg-accent/80 dark:hover:border-teal-400/50",
        // Ghost - minimal with hover background
        ghost: "text-foreground hover:bg-accent active:bg-accent/80",
        // Destructive - red for dangerous actions
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/30",
      },
      size: {
        sm: "h-8 rounded-md gap-1.5 px-3 text-xs",
        default: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-6",
        xl: "h-12 rounded-lg px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
