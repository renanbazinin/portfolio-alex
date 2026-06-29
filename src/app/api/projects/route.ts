import { NextRequest, NextResponse } from "next/server";
import { createProject, listAllProjects } from "@/lib/projects";
import { projectInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const all = await listAllProjects();
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = projectInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const created = await createProject(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create project" },
      { status: 500 },
    );
  }
}
