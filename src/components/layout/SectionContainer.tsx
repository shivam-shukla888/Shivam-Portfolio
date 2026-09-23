import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "footer" | "header";
}

export function SectionContainer({
  children,
  className,
  id,
  as: Component = "section",
  ...props
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={cn("w-full max-w-[1360px] mx-auto px-5 md:px-8 lg:px-16", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
