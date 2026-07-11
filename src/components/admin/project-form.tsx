"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Project } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUploader } from "@/components/admin/media-uploader";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type FormState = {
  title: string;
  slug: string;
  category: string;
  year: string;
  role: string;
  tools: string;
  description: string;
  thumbnail: string;
  images: string[];
  videoUrl: string;
  publishStatus: "draft" | "published";
  featured: boolean;
};

function fromProject(p?: Project): FormState {
  return {
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    category: p?.category ?? "",
    year: p?.year ? String(p.year) : "",
    role: p?.role ?? "",
    tools: (p?.tools ?? []).join(", "),
    description: p?.description ?? "",
    thumbnail: p?.thumbnail ?? "",
    images: p?.images ?? [],
    videoUrl: p?.videoUrl ?? "",
    publishStatus: p?.publishStatus ?? "draft",
    featured: p?.featured ?? false,
  };
}

/** Shape of `zodError.flatten()` as returned by the write APIs on 422. */
type FlattenedIssues = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
};

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [form, setForm] = useState<FormState>(fromProject(project));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setDirty(true);
    setErrors((e) => {
      if (!(key in e)) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  // Warn on tab close / hard navigation while there are unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function cancel() {
    if (dirty) {
      setConfirmLeave(true);
    } else {
      router.push("/admin");
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (form.slug && !/^[a-z0-9-]*$/.test(form.slug)) {
      next.slug = "Lowercase letters, numbers, and hyphens only";
    }
    if (form.year && !/^\d{4}$/.test(form.year.trim())) {
      next.year = "Enter a 4-digit year";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category.trim(),
      year: form.year.trim() ? Number(form.year.trim()) : null,
      role: form.role.trim(),
      tools: form.tools
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      description: form.description.trim(),
      thumbnail: form.thumbnail,
      images: form.images,
      videoUrl: form.videoUrl.trim(),
      publishStatus: form.publishStatus,
      featured: form.featured,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/projects/${project!.id}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const issues = data?.issues as FlattenedIssues | undefined;
        if (res.status === 422 && issues?.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [field, messages] of Object.entries(issues.fieldErrors)) {
            if (messages?.length) fieldErrors[field] = messages[0];
          }
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            toast.error("Please fix the highlighted fields");
            return;
          }
        }
        throw new Error(data?.error || "Save failed");
      }
      setDirty(false);
      toast.success(isEdit ? "Changes saved" : "Project created");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEdit ? "Edit project" : "New project"}
        </h1>
        <Button variant="ghost" size="sm" type="button" onClick={cancel}>
          Cancel
        </Button>
      </div>

      <div className="space-y-5">
        <Field label="Title" error={errors.title} required>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Project title"
            aria-invalid={Boolean(errors.title)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Slug" error={errors.slug} hint="Leave blank to auto-generate">
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="my-project"
              aria-invalid={Boolean(errors.slug)}
            />
          </Field>
          <Field label="Year" error={errors.year}>
            <Input
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2025"
              inputMode="numeric"
              aria-invalid={Boolean(errors.year)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Category" error={errors.category}>
            <Input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Animation"
              aria-invalid={Boolean(errors.category)}
            />
          </Field>
          <Field label="Role" error={errors.role}>
            <Input
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="e.g. Lead Designer"
              aria-invalid={Boolean(errors.role)}
            />
          </Field>
        </div>

        <Field label="Tools" error={errors.tools} hint="Comma-separated">
          <Input
            value={form.tools}
            onChange={(e) => set("tools", e.target.value)}
            placeholder="Blender, After Effects"
            aria-invalid={Boolean(errors.tools)}
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <Textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={5}
            placeholder="Describe the project…"
            aria-invalid={Boolean(errors.description)}
          />
        </Field>

        <Field label="" error={errors.thumbnail}>
          <MediaUploader
            label="Thumbnail"
            value={form.thumbnail ? [form.thumbnail] : []}
            onChange={(urls) => set("thumbnail", urls[0] ?? "")}
          />
        </Field>

        <Field label="" error={errors.images}>
          <MediaUploader
            label="Gallery images"
            multiple
            value={form.images}
            onChange={(urls) => set("images", urls)}
          />
        </Field>

        <Field label="Video URL" error={errors.videoUrl}>
          <Input
            value={form.videoUrl}
            onChange={(e) => set("videoUrl", e.target.value)}
            placeholder="https://…"
            aria-invalid={Boolean(errors.videoUrl)}
          />
        </Field>

        <Field label="Status" error={errors.publishStatus}>
          <Select
            value={form.publishStatus}
            onValueChange={(v) => set("publishStatus", v as FormState["publishStatus"])}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="border-input size-4 rounded"
          />
          <span className="text-sm font-medium">
            Feature on home page
          </span>
          <span className="text-muted-foreground text-xs">
            (shown in the home showcase)
          </span>
        </label>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </Button>
          <Button type="button" variant="outline" onClick={cancel}>
            Cancel
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        title="Discard changes?"
        description="You have unsaved changes. Leaving now will discard them."
        confirmLabel="Discard and leave"
        destructive
        onConfirm={() => {
          setConfirmLeave(false);
          setDirty(false);
          router.push("/admin");
        }}
      />
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <Label>
          {label}
          {required ? <span className="text-destructive"> *</span> : null}
        </Label>
      ) : null}
      {children}
      {error ? (
        <p className="text-destructive text-xs">{error}</p>
      ) : hint ? (
        <p className="text-muted-foreground text-xs">{hint}</p>
      ) : null}
    </div>
  );
}
