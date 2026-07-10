import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  getPublishedProjectBySlug,
  listPublishedProjects,
  type Project,
} from "@/lib/projects";
import { Container } from "@/components/site/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SharedElement } from "@/components/motion/view-transition";
import { ProjectGallery } from "@/components/public/project-gallery";

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

function PagerCard({
  project,
  direction,
}: {
  project: Project;
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex items-center gap-4 rounded-lg py-6 ${
        direction === "next" ? "flex-row-reverse text-right" : ""
      }`}
    >
      {project.thumbnail ? (
        <span className="bg-muted relative block aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-md">
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes="80px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
          {direction === "prev" ? "← Previous" : "Next →"}
        </span>
        <span className="font-display group-hover:text-accent-brand mt-1 block truncate text-xl tracking-tight transition-colors duration-200">
          {project.title}
        </span>
      </span>
    </Link>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project: Project | null = null;
  let published: Project[] = [];
  try {
    [project, published] = await Promise.all([
      getPublishedProjectBySlug(slug),
      listPublishedProjects(),
    ]);
  } catch {
    project = null;
  }
  if (!project) notFound();

  const index = published.findIndex((p) => p.id === project.id);
  const hasNeighbors = published.length > 1 && index !== -1;
  const prev = hasNeighbors
    ? published[(index - 1 + published.length) % published.length]
    : null;
  const next = hasNeighbors
    ? published[(index + 1) % published.length]
    : null;

  const meta: { label: string; value: string }[] = [
    project.category ? { label: "Category", value: project.category } : null,
    project.year ? { label: "Year", value: String(project.year) } : null,
    project.role ? { label: "Role", value: project.role } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Container className="py-12">
      <Link
        href="/projects"
        className="link-underline text-muted-foreground hover:text-foreground font-mono text-xs tracking-[0.2em] uppercase transition-colors"
      >
        ← All projects
      </Link>

      <header className="anim-rise mt-10 max-w-3xl">
        {project.category ? (
          <p className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-[0.25em] uppercase">
            <span aria-hidden className="text-accent-brand">
              /{" "}
            </span>
            {project.category}
          </p>
        ) : null}
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
          {project.title}
        </h1>
      </header>

      {project.thumbnail ? (
        <div className="anim-rise anim-delay-1 bg-muted relative mt-12 aspect-[16/9] overflow-hidden rounded-xl">
          <SharedElement name={`project-image-${project.slug}`}>
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              preload
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          </SharedElement>
        </div>
      ) : null}

      <div className="mt-14 grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <dl className="border-border/60 divide-border/60 divide-y border-y">
            {meta.map((m) => (
              <div key={m.label} className="flex justify-between gap-4 py-3">
                <dt className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
                  {m.label}
                </dt>
                <dd className="text-sm">{m.value}</dd>
              </div>
            ))}
            {project.tools?.length ? (
              <div className="py-3">
                <dt className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase">
                  Tools
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.tools.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
          {project.videoUrl ? (
            <Button asChild className="mt-6 w-full rounded-full">
              <a href={project.videoUrl} target="_blank" rel="noreferrer">
                Watch video
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </Button>
          ) : null}
        </aside>

        <div>
          {project.description ? (
            <Reveal>
              <p className="max-w-2xl text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </Reveal>
          ) : null}

          {project.images?.length ? (
            <div className={project.description ? "mt-12" : ""}>
              <ProjectGallery title={project.title} images={project.images} />
            </div>
          ) : null}
        </div>
      </div>

      <nav
        aria-label="Project navigation"
        className="border-border/60 mt-20 border-t pt-4"
      >
        {hasNeighbors && prev && next ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-8">
            <PagerCard project={prev} direction="prev" />
            <PagerCard project={next} direction="next" />
          </div>
        ) : (
          <div className="py-6 text-center">
            <Link
              href="/projects"
              className="link-underline text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Back to all projects →
            </Link>
          </div>
        )}
      </nav>
    </Container>
  );
}
