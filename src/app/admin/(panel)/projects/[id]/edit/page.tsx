import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import { ProjectForm } from "@/components/admin/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const project = await getProjectById(numericId);
  if (!project) notFound();

  return <ProjectForm project={project} />;
}
