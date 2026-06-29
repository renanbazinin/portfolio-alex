"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/site/project-card";

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
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search title, role, or tools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-48">
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
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          No projects match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
