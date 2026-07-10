"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { DURATION, EASE_OUT_SOFT, STAGGER } from "@/components/motion/constants";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // While open: lock scroll, close on Escape, trap focus within the header.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !headerRef.current) return;
      const focusables = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-border/60 bg-background/80 border-b backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-base tracking-tight"
          onClick={() => setOpen(false)}
        >
          Alex
          <span aria-hidden className="text-accent-brand">
            .
          </span>
          <span className="text-muted-foreground font-sans text-sm">
            {" "}
            — portfolio
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-7 sm:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "group relative py-1 text-sm transition-colors duration-200",
                  isActive(item.href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "bg-accent-brand absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-200 ease-out",
                    isActive(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            ))}
          </nav>

          <ThemeToggle />

          <button
            ref={triggerRef}
            type="button"
            className="relative flex size-9 items-center justify-center sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => (open ? close() : setOpen(true))}
          >
            <span
              aria-hidden
              className={cn(
                "bg-foreground absolute h-px w-5 transition-transform duration-300 ease-out",
                open ? "rotate-45" : "-translate-y-[3.5px]",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "bg-foreground absolute h-px w-5 transition-transform duration-300 ease-out",
                open ? "-rotate-45" : "translate-y-[3.5px]",
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu is absolute (not fixed): the header's backdrop-filter
          makes it the containing block, so fixed coordinates would collapse */}
      <AnimatePresence>
        {open ? (
          <motion.nav
            aria-label="Main"
            className="bg-background/95 absolute inset-x-0 top-full flex h-[calc(100svh-100%)] flex-col gap-2 px-6 pt-10 backdrop-blur-md sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            {NAV.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.base,
                  ease: EASE_OUT_SOFT,
                  delay: i * STAGGER,
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "font-display block py-3 text-4xl tracking-tight transition-colors",
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive(item.href) ? (
                    <span aria-hidden className="text-accent-brand">
                      {"· "}
                    </span>
                  ) : null}
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
