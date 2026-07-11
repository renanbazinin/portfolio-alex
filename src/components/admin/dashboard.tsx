"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type PendingAction = {
  id: number;
  action: "publish" | "feature" | "delete" | "reorder";
};

export function Dashboard({
  initialProjects,
  loadError,
}: {
  initialProjects: Project[];
  loadError: string | null;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

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

  function isPending(p: Project, action: PendingAction["action"]) {
    return pending?.id === p.id && pending.action === action;
  }
  function rowBusy(p: Project) {
    return pending?.id === p.id;
  }

  async function togglePublish(p: Project) {
    if (pending) return;
    setPending({ id: p.id, action: "publish" });
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
    } catch {
      toast.error("Failed to update status");
    } finally {
      setPending(null);
    }
  }

  async function toggleFeatured(p: Project) {
    if (pending) return;
    setPending({ id: p.id, action: "feature" });
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, featured: !p.featured }),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as Project;
      setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
      toast.success(
        updated.featured ? "Added to featured" : "Removed from featured",
      );
    } catch {
      toast.error("Failed to update featured");
    } finally {
      setPending(null);
    }
  }

  async function confirmDelete() {
    const p = deleteTarget;
    if (!p) return;
    setPending({ id: p.id, action: "delete" });
    try {
      const res = await fetch(`/api/projects/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
      setDeleteTarget(null);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setPending(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    if (pending) return;
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const previous = projects;
    const reordered = [...projects];
    const [item] = reordered.splice(index, 1);
    reordered.splice(target, 0, item);
    setProjects(reordered);
    setPending({ id: item.id, action: "reorder" });
    try {
      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((p) => p.id) }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order saved");
    } catch {
      toast.error("Failed to save order");
      setProjects(previous);
    } finally {
      setPending(null);
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        {!reorderEnabled ? (
          <p className="text-muted-foreground text-xs sm:ml-auto">
            Clear search/filter to reorder.
          </p>
        ) : null}
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
              aria-busy={rowBusy(p)}
            >
              <div className="bg-muted h-12 w-16 shrink-0 overflow-hidden rounded">
                {p.thumbnail ? (
                  <Image
                    src={p.thumbnail}
                    alt=""
                    width={128}
                    height={96}
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
                {reorderEnabled ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={rowBusy(p) || i === 0}
                      onClick={() => move(i, -1)}
                      title="Move up"
                    >
                      {isPending(p, "reorder") ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        "↑"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={rowBusy(p) || i === filtered.length - 1}
                      onClick={() => move(i, 1)}
                      title="Move down"
                    >
                      ↓
                    </Button>
                  </>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={rowBusy(p)}
                  onClick={() => toggleFeatured(p)}
                  title={p.featured ? "Remove from featured" : "Add to featured"}
                >
                  {isPending(p, "feature") ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : p.featured ? (
                    "★"
                  ) : (
                    "☆"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={rowBusy(p)}
                  onClick={() => togglePublish(p)}
                >
                  {isPending(p, "publish") ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      {p.publishStatus === "published"
                        ? "Unpublishing…"
                        : "Publishing…"}
                    </>
                  ) : p.publishStatus === "published" ? (
                    "Unpublish"
                  ) : (
                    "Publish"
                  )}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/projects/${p.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  disabled={rowBusy(p)}
                  onClick={() => setDeleteTarget(p)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete project?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        pendingLabel="Deleting…"
        destructive
        pending={deleteTarget !== null && isPending(deleteTarget, "delete")}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
