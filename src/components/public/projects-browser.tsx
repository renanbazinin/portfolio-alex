"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group border-border bg-card flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md sm:flex-row"
            >
              <Link
                href={`/projects/${p.slug}`}
                className="bg-muted block w-full shrink-0 overflow-hidden sm:w-[200px]"
              >
                <div className="aspect-video h-full w-full sm:aspect-auto sm:min-h-[150px]">
                  {p.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full min-h-[150px] items-center justify-center text-xs">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="truncate font-medium hover:text-[#646cff]"
                  >
                    {p.title}
                  </Link>
                  {p.year ? (
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {p.year}
                    </span>
                  ) : null}
                </div>

                <p className="text-muted-foreground mt-1 text-sm">
                  {[p.category, p.role].filter(Boolean).join(" • ")}
                </p>

                {p.tools?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tools.slice(0, 5).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                {p.description ? (
                  <p className="text-foreground/80 mt-2 line-clamp-2 text-sm">
                    {p.description}
                  </p>
                ) : null}

                <div className="mt-auto flex items-center gap-3 pt-3">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-xs font-medium text-[#646cff] hover:text-[#535bf2]"
                  >
                    View details →
                  </Link>
                  {p.videoUrl ? (
                    <a
                      href={p.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-[#646cff] hover:text-[#535bf2]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Video ▶
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
