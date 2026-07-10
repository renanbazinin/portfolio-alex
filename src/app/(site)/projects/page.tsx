import { listPublishedProjects, type Project } from "@/lib/projects";
import { Container } from "@/components/site/container";
import { ProjectsBrowser } from "@/components/public/projects-browser";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
  description: "Browse Alex's full archive of 3D and classic animation work.",
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await listPublishedProjects();
  } catch {
    projects = [];
  }

  return (
    <Container className="py-16">
      <header className="mb-12">
        <p className="anim-rise text-muted-foreground mb-3 font-mono text-xs font-medium tracking-[0.25em] uppercase">
          <span aria-hidden className="text-accent-brand">
            /{" "}
          </span>
          Work
        </p>
        <h1 className="anim-rise anim-delay-1 font-display text-4xl tracking-tight sm:text-6xl">
          Projects
        </h1>
        <p className="anim-rise anim-delay-2 text-muted-foreground mt-4 max-w-xl">
          Browse the full archive. Search or filter by category.
        </p>
      </header>
      <ProjectsBrowser projects={projects} />
    </Container>
  );
}
