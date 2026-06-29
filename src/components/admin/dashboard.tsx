"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Project } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Dashboard({
  initialProjects,
  loadError,
}: {
  initialProjects: Project[];
  loadError: string | null;
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [busyId, setBusyId] = useState<number | null>(null);

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

  async function togglePublish(p: Project) {
    setBusyId(p.id);
    const next = p.publishStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, publishStatus: next }),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as Project;
      setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      toast.success(next === "published" ? "Published" : "Moved to draft");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(p: Project) {
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, featured: !p.featured }),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as Project;
      setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      toast.success(updated.featured ? "Added to featured" : "Removed from featured");
      router.refresh();
    } catch {
      toast.error("Failed to update featured");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p: Project) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
      toast.success("Project deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setBusyId(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const reordered = [...projects];
    const [item] = reordered.splice(index, 1);
    reordered.splice(target, 0, item);
    setProjects(reordered);
    try {
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order saved");
      router.refresh();
    } catch {
      toast.error("Failed to save order");
      setProjects(projects);
    }
  }

  const reorderEnabled = search === "" && category === "all";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">
            {projects.length} total ·{" "}
            {projects.filter((p) => p.publishStatus === "published").length}{" "}
            published
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">New project</Link>
        </Button>
      </div>

      {loadError ? (
        <div className="border-destructive/40 bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm">
          Could not load projects: {loadError}. Check the database connection.
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search…"
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
        <div className="border-border text-muted-foreground rounded-lg border border-dashed p-12 text-center text-sm">
          No projects yet. Create your first one.
        </div>
      ) : (
        <ul className="divide-border border-border divide-y rounded-lg border">
          {filtered.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-3 p-3"
              aria-busy={busyId === p.id}
            >
              <div className="bg-muted h-12 w-16 shrink-0 overflow-hidden rounded">
                {p.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{p.title}</span>
                  <Badge
                    variant={
                      p.publishStatus === "published" ? "default" : "secondary"
                    }
                  >
                    {p.publishStatus}
                  </Badge>
                  {p.featured ? (
                    <Badge variant="outline">★ Featured</Badge>
                  ) : null}
                </div>
                <p className="text-muted-foreground truncate text-sm">
                  {[p.category, p.role, p.year].filter(Boolean).join(" • ")}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!reorderEnabled || i === 0}
                  onClick={() => move(i, -1)}
                  title="Move up"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!reorderEnabled || i === filtered.length - 1}
                  onClick={() => move(i, 1)}
                  title="Move down"
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyId === p.id}
                  onClick={() => toggleFeatured(p)}
                  title={p.featured ? "Remove from featured" : "Add to featured"}
                >
                  {p.featured ? "★" : "☆"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busyId === p.id}
                  onClick={() => togglePublish(p)}
                >
                  {p.publishStatus === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/projects/${p.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  disabled={busyId === p.id}
                  onClick={() => remove(p)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!reorderEnabled ? (
        <p className="text-muted-foreground mt-2 text-xs">
          Clear search/filter to reorder projects.
        </p>
      ) : null}
    </div>
  );
}
