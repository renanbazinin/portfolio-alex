"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { useCallback } from "react";

/**
 * Theme system backed by next-themes (class strategy, system default,
 * no-flash script injected automatically). Exposes the same hook shape the
 * admin panel and sonner were written against (`toggleTheme`,
 * `resolvedTheme`).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return {
    theme: theme ?? "system",
    resolvedTheme: resolvedTheme ?? "light",
    setTheme,
    toggleTheme,
  };
}
