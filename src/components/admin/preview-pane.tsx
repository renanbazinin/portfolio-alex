"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HomeVariant } from "@/lib/site-content";

type PageKey = "home" | "about" | "projects";
type DeviceKey = "desktop" | "tablet" | "mobile";

const PAGES: { key: PageKey; label: string; path: string }[] = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "projects", label: "Projects", path: "/projects" },
];

const DEVICES: { key: DeviceKey; label: string; width: number | null }[] = [
  { key: "desktop", label: "Desktop", width: null },
  { key: "tablet", label: "Tablet", width: 768 },
  { key: "mobile", label: "Mobile", width: 390 },
];

export function PreviewPane({
  variants,
}: {
  variants: { value: HomeVariant; label: string }[];
}) {
  const [page, setPage] = useState<PageKey>("home");
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [variant, setVariant] = useState<HomeVariant>(variants[0].value);
  // Bumped to force the iframe to reload on demand.
  const [nonce, setNonce] = useState(0);

  const current = PAGES.find((p) => p.key === page)!;
  const deviceWidth = DEVICES.find((d) => d.key === device)!.width;

  const src = useMemo(() => {
    const params = new URLSearchParams();
    if (page === "home") params.set("previewVariant", variant);
    params.set("_", String(nonce));
    const qs = params.toString();
    return qs ? `${current.path}?${qs}` : current.path;
  }, [page, variant, nonce, current.path]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Preview</h1>
          <p className="text-muted-foreground text-sm">
            See the live public site. Showing saved content; pick a home layout
            to preview it without saving.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setNonce((n) => n + 1)}>
            Refresh
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={src} target="_blank" rel="noreferrer">
              Open in new tab ↗
            </a>
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Page switcher */}
        <div className="border-border inline-flex rounded-md border p-0.5">
          {PAGES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPage(p.key)}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                page === p.key
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Device switcher */}
        <div className="border-border inline-flex rounded-md border p-0.5">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setDevice(d.key)}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                device === d.key
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Home layout selector (only meaningful on the home page) */}
        <Select
          value={variant}
          onValueChange={(v) => setVariant(v as HomeVariant)}
          disabled={page !== "home"}
        >
          <SelectTrigger className="w-56" aria-label="Home layout">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {variants.map((v) => (
              <SelectItem key={v.value} value={v.value}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Preview frame */}
      <div className="border-border bg-muted/30 overflow-auto rounded-lg border p-4">
        <div
          className="mx-auto bg-background shadow-sm transition-all"
          style={{ width: deviceWidth ? `${deviceWidth}px` : "100%" }}
        >
          <iframe
            // Same-origin iframe of the real public pages. Re-keyed by `src`
            // (which includes the refresh nonce) so changes reload the frame.
            key={src}
            src={src}
            title="Site preview"
            className="h-[70vh] w-full rounded-md border-0 bg-background"
          />
        </div>
      </div>
    </div>
  );
}
