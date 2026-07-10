"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/site/project-card";
import { DURATION, EASE_OUT_SOFT } from "@/components/motion/constants";

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.tools || []).join(",").toLowerCase().includes(q);
      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [projects, search, category]);

  const hasActiveFilters = search.trim() !== "" || category !== "all";

  function clearFilters() {
    setSearch("");
    setCategory("all");
  }

  if (projects.length === 0) {
    return (
      <div className="border-border rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">
          No projects published yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search title, role, or tools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
          aria-label="Search projects"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger
            className={
              category !== "all" ? "border-accent-brand sm:w-48" : "sm:w-48"
            }
          >
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p
          aria-live="polite"
          className="text-muted-foreground font-mono text-xs tabular-nums sm:ml-auto"
        >
          {filtered.length} of {projects.length} projects
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-16 text-center">
          <p className="font-display text-xl tracking-tight">
            Nothing matches that search.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Try a different term, or start over.
          </p>
          <Button
            variant="outline"
            className="mt-6 rounded-full"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT_SOFT }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasActiveFilters && filtered.length > 0 ? (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={clearFilters}
            className="link-underline text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
