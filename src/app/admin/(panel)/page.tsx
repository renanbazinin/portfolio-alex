import { listAllProjects, type Project } from "@/lib/projects";
import { Dashboard } from "@/components/admin/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let projects: Project[] = [];
  let error: string | null = null;
  try {
    projects = await listAllProjects();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load projects";
  }

  return <Dashboard initialProjects={projects} loadError={error} />;
}
