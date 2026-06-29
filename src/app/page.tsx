import Link from "next/link";
import { listPublishedProjects, type Project } from "@/lib/projects";
import { ProjectsBrowser } from "@/components/public/projects-browser";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let projects: Project[] = [];
  try {
    projects = await listPublishedProjects();
  } catch {
    projects = [];
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Selected work and case studies.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
        >
          Admin
        </Link>
      </header>

      <ProjectsBrowser projects={projects} />
    </div>
  );
}
