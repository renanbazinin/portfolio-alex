import { NextRequest, NextResponse } from "next/server";
import { reorderProjects } from "@/lib/projects";
import { reorderSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reorderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 422 });
  }

  await reorderProjects(parsed.data.order);
  return NextResponse.json({ ok: true });
}
