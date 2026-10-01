"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Store", href: "/store" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close on Escape key and return focus to toggle button; prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          toggleButtonRef.current?.focus();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Close mobile drawer on route change by adjusting state during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E5E5]">
      <div className="w-full max-w-[1360px] mx-auto px-5 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        {/* Brand Anchor */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans text-sm tracking-tight text-[#000000] hover:text-[#2C3480] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#000000]"
        >
          <span className="w-2 h-2 bg-[#2C3480] inline-block shrink-0" aria-hidden="true" />
          <span className="font-semibold tracking-[0.04em] uppercase text-xs">SHIVSASTRA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-sans tracking-normal">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            const isStore = link.label === "Store";
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative group py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#000000] flex items-center gap-1.5",
                  isActive
                    ? "text-[#2C3480] font-semibold"
                    : "text-[#555555] hover:text-[#000000]"
                )}
              >
                <span className="relative">
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-[1.5px] transition-[width] duration-200 ease-out",
                      isActive
                        ? "w-full bg-[#2C3480]"
                        : "w-0 bg-[#2C3480] group-hover:w-full motion-reduce:transition-none"
                    )}
                  />
                </span>
                {isStore && (
                  <span
                    className="w-1.5 h-1.5 bg-[#2C3480] inline-block shrink-0 transition-transform duration-200 group-hover:scale-125 motion-reduce:group-hover:scale-100"
                    aria-label="Store"
                  />
                )}
              </Link>
            );
          })}

          {/* Editorial Lab Link */}
          <Link
            href="/lab"
            className={cn(
              "text-xs font-mono px-2.5 py-1 border transition-[border-color,color,background-color] duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#000000]",
              pathname === "/lab" || pathname?.startsWith("/lab")
                ? "border-[#2C3480] text-white bg-[#2C3480]"
                : "border-[#E5E5E5] text-[#555555] hover:border-[#2C3480] hover:text-[#2C3480]"
            )}
            title="Lab Experiments"
          >
            /LAB
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 border border-[#E5E5E5] text-[#000000] hover:border-[#2C3480] hover:text-[#2C3480] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#000000]"
        >
          <span
            className={cn(
              "w-5 h-[1.5px] bg-current transition-transform duration-150",
              isOpen && "rotate-45 translate-y-[3px]"
            )}
          />
          <span
            className={cn(
              "w-5 h-[1.5px] bg-current mt-1.5 transition-transform duration-150",
              isOpen && "-rotate-45 -translate-y-[4px]"
            )}
          />
        </button>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/40 z-40 md:hidden"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          <nav
            id="mobile-navigation-menu"
            aria-label="Mobile Navigation"
            className="relative z-50 md:hidden border-t border-[#E5E5E5] bg-white px-5 py-6 flex flex-col gap-2 shadow-lg"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-sm font-sans transition-colors py-2.5 min-h-[44px] border-b border-[#E5E5E5] flex items-center justify-between",
                    isActive
                      ? "text-[#2C3480] font-semibold"
                      : "text-[#000000] hover:text-[#2C3480]"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 bg-[#2C3480]" />}
                </Link>
              );
            })}
            <Link
              href="/lab"
              onClick={() => setIsOpen(false)}
              className="text-xs font-mono text-[#2C3480] font-semibold py-3 min-h-[44px] flex items-center justify-between"
            >
              <span>/LAB (EXPERIMENTS)</span>
              <span>→</span>
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
