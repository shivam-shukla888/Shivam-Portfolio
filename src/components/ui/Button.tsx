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
    "inline-flex items-center justify-center font-sans font-medium text-xs tracking-normal transition-[color,background-color,border-color,transform] duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 select-none min-h-[44px] rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] focus-visible:ring-offset-1 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100";

  const variantStyles = {
    primary:
      "bg-[#2C3480] text-white border border-[#2C3480] hover:bg-[#000000] hover:border-[#000000] hover:text-white",
    secondary:
      "bg-white text-[#000000] border border-[#000000] hover:bg-[#000000] hover:text-white hover:border-[#000000]",
    accent:
      "bg-[#2C3480] text-white border border-[#2C3480] hover:bg-[#1E2560] hover:border-[#1E2560]",
    "dark-inverse":
      "bg-white text-[#000000] border border-white hover:bg-[#2C3480] hover:border-[#2C3480] hover:text-white focus-visible:ring-white",
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
