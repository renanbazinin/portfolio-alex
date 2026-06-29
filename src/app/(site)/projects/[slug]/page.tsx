import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug } from "@/lib/projects";
import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let project = null;
  try {
    project = await getPublishedProjectBySlug(slug);
  } catch {
    project = null;
  }
  if (!project) return { title: "Project" };

  const description =
    project.description?.slice(0, 200) ||
    `${project.title} — ${[project.category, project.role].filter(Boolean).join(", ")}`;
  const image = project.thumbnail || "/assets/dragon-1.png";

  return {
    title: project.title,
    description,
    openGraph: {
      type: "article",
      title: `${project.title} — Alex`,
      description,
      images: [{ url: image, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Alex`,
      description,
      images: [image],
    },
  };
}

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
    <Container className="py-16">
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
      >
        ← Back to projects
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          {project.year ? (
            <span className="text-muted-foreground tabular-nums">
              {project.year}
            </span>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-2">
          {[project.category, project.role].filter(Boolean).join(" · ")}
        </p>
        {project.tools?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tools.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      {project.thumbnail ? (
        <div className="bg-muted mt-10 overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full object-cover"
          />
        </div>
      ) : null}

      {project.description ? (
        <div className="mt-10 max-w-2xl">
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>
      ) : null}

      {project.videoUrl ? (
        <a
          href={project.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block text-sm font-medium underline underline-offset-4"
        >
          Watch video ▶
        </a>
      ) : null}

      {project.images?.length ? (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
    </Container>
  );
}
