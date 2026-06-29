import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project = null;
  try {
    project = await getPublishedProjectBySlug(slug);
  } catch {
    project = null;
  }
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
      >
        ← Back to projects
      </Link>

      <header className="mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {project.title}
          </h1>
          {project.year ? (
            <span className="text-muted-foreground">{project.year}</span>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-1">
          {[project.category, project.role].filter(Boolean).join(" • ")}
        </p>
        {project.tools?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tools.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      {project.thumbnail ? (
        <div className="bg-muted mt-6 overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full object-cover"
          />
        </div>
      ) : null}

      {project.description ? (
        <p className="mt-6 leading-relaxed whitespace-pre-line">
          {project.description}
        </p>
      ) : null}

      {project.videoUrl ? (
        <a
          href={project.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary mt-6 inline-block underline underline-offset-4"
        >
          Watch video ▶
        </a>
      ) : null}

      {project.images?.length ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${src}-${i}`}
              src={src}
              alt={`${project.title} image ${i + 1}`}
              className="bg-muted w-full rounded-lg object-cover"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
