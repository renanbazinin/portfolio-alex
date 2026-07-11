"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  // Dashboard also owns the project create/edit flows.
  { href: "/admin", label: "Dashboard", isActive: (p: string) => p === "/admin" || p.startsWith("/admin/projects") },
  { href: "/admin/settings", label: "Site content", isActive: (p: string) => p.startsWith("/admin/settings") },
  { href: "/admin/preview", label: "Preview", isActive: (p: string) => p.startsWith("/admin/preview") },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex items-center gap-5">
      {NAV.map((item) => {
        const active = item.isActive(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative py-1 text-sm transition-colors",
              active
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
            <span
              aria-hidden
              className={cn(
                "bg-accent-brand absolute inset-x-0 -bottom-0.5 h-px transition-transform duration-200",
                active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </Link>
        );
      })}
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        View site ↗
      </a>
    </nav>
  );
}
