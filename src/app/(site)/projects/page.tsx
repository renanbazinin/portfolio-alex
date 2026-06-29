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
      <header className="mb-10">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.2em] uppercase">
          Work
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Browse the full archive. Search or filter by category.
        </p>
      </header>
      <ProjectsBrowser projects={projects} />
    </Container>
  );
}
