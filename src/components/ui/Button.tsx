import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "dark-inverse";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export interface ButtonStylesProps {
  variant?: "primary" | "secondary" | "accent" | "dark-inverse";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStylesProps = {}) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium text-xs tracking-normal transition-colors duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[44px] rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] focus-visible:ring-offset-1";

  const variantStyles = {
    primary:
      "bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] border border-[var(--color-ink-primary)] hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white",
    secondary:
      "bg-transparent text-[var(--color-ink-primary)] border border-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)]",
    accent:
      "bg-[var(--color-accent)] text-white border border-[var(--color-accent)] hover:bg-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)]",
    "dark-inverse":
      "bg-white text-[var(--color-surface-dark)] border border-white hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] hover:text-white focus-visible:ring-white",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-xs",
    lg: "px-8 py-3 text-xs sm:text-sm",
  };

  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonStyles({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
