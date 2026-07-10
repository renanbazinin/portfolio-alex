"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/db/schema";
import { SharedElement } from "@/components/motion/view-transition";
import { cn } from "@/lib/utils";

const DEFAULT_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function ProjectCard({
  project,
  sizes = DEFAULT_SIZES,
  preload = false,
  featured = false,
}: {
  project: Project;
  sizes?: string;
  preload?: boolean;
  featured?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-lg"
      aria-label={project.title}
    >
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        {project.thumbnail ? (
          <SharedElement name={`project-image-${project.slug}`}>
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes={sizes}
              preload={preload}
              onLoad={() => setLoaded(true)}
              className={cn(
                "object-cover transition-[opacity,filter,transform] duration-700 ease-out",
                "group-hover:scale-[1.04] group-focus-visible:scale-[1.04]",
                loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
              )}
            />
          </SharedElement>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center font-mono text-xs tracking-widest uppercase">
            No image
          </div>
        )}
        <span
          aria-hidden
          className="bg-background/90 text-foreground absolute right-3 bottom-3 flex size-9 translate-y-2 items-center justify-center rounded-full opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3
          className={cn(
            "truncate font-medium",
            featured ? "font-display text-xl tracking-tight sm:text-2xl" : "text-base",
          )}
        >
          {project.title}
        </h3>
        {project.year ? (
          <span className="text-muted-foreground shrink-0 font-mono text-sm tabular-nums">
            {project.year}
          </span>
        ) : null}
      </div>
      <p className="text-muted-foreground mt-0.5 truncate text-sm">
        {[project.category, project.role].filter(Boolean).join(" · ")}
      </p>
    </Link>
  );
}
