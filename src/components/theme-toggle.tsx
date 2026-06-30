"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className={cn(
        "border-border text-foreground hover:border-[var(--accent-primary)] hover:bg-accent inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
        className,
      )}
    >
      {/* Icon visibility is driven by the `.dark` class, so it renders
          identically on server and client — no hydration mismatch. */}
      <Sun className="hidden h-[18px] w-[18px] dark:block" />
      <Moon className="h-[18px] w-[18px] dark:hidden" />
    </button>
  );
}
