"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="gradient-text text-lg font-bold tracking-[0.15em]"
        >
          ALEX
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-[var(--accent-primary)] after:transition-all after:duration-300 after:content-['']",
                  isActive(item.href)
                    ? "text-foreground font-medium after:w-full"
                    : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className="text-muted-foreground hover:text-foreground sm:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-border/60 flex flex-col gap-1 border-t px-6 py-3 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-md px-2 py-2 text-sm",
                isActive(item.href)
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
