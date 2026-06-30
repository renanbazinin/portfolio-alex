import Link from "next/link";
import type { Project } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  /** When set, the card fades up with a stagger based on its position. */
  index?: number;
}) {
  const animated = index !== undefined;
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn("group block", animated && "animate-fade-up")}
      style={
        animated
          ? { animationDelay: `${Math.min(index, 8) * 60}ms` }
          : undefined
      }
      aria-label={project.title}
    >
      <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
            No image
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="truncate text-base font-medium transition-colors group-hover:text-foreground/70">
          {project.title}
        </h3>
        {project.year ? (
          <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
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
