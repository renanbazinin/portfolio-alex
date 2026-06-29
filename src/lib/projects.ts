import { and, asc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, type Project } from "@/lib/db/schema";
import { slugify, type ProjectInput } from "@/lib/validation";

export type { Project };

/** All projects (drafts included) for the admin dashboard. */
export async function listAllProjects(): Promise<Project[]> {
  return db.select().from(projects).orderBy(asc(projects.sortOrder), asc(projects.id));
}

/** Published projects only, for the public site. */
export async function listPublishedProjects(): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .where(eq(projects.publishStatus, "published"))
    .orderBy(asc(projects.sortOrder), asc(projects.id));
}

/** Published + featured projects, for the home showcase. */
export async function listFeaturedProjects(): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.publishStatus, "published"), eq(projects.featured, true)))
    .orderBy(asc(projects.sortOrder), asc(projects.id));
}

export async function getProjectById(id: number): Promise<Project | null> {
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Public detail lookup: only resolves published projects. */
export async function getPublishedProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.publishStatus, "published")))
    .limit(1);
  return rows[0] ?? null;
}

async function ensureUniqueSlug(
  desired: string,
  excludeId?: number,
): Promise<string> {
  const base = slugify(desired) || "project";
  let candidate = base;
  let n = 1;
  // Loop until we find a slug not used by a different row.
  // Small data set, so a simple lookup loop is fine.
  while (true) {
    const rows = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        excludeId === undefined
          ? eq(projects.slug, candidate)
          : and(eq(projects.slug, candidate), ne(projects.id, excludeId)),
      )
      .limit(1);
    if (rows.length === 0) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const slug = await ensureUniqueSlug(input.slug || input.title);
  const rows = await db
    .insert(projects)
    .values({
      slug,
      title: input.title,
      category: input.category,
      year: input.year ?? null,
      role: input.role,
      tools: input.tools,
      description: input.description,
      thumbnail: input.thumbnail,
      images: input.images,
      videoUrl: input.videoUrl,
      publishStatus: input.publishStatus,
      featured: input.featured,
      sortOrder: input.sortOrder,
    })
    .returning();
  return rows[0];
}

export async function updateProject(
  id: number,
  input: ProjectInput,
): Promise<Project | null> {
  const slug = await ensureUniqueSlug(input.slug || input.title, id);
  const rows = await db
    .update(projects)
    .set({
      slug,
      title: input.title,
      category: input.category,
      year: input.year ?? null,
      role: input.role,
      tools: input.tools,
      description: input.description,
      thumbnail: input.thumbnail,
      images: input.images,
      videoUrl: input.videoUrl,
      publishStatus: input.publishStatus,
      featured: input.featured,
      sortOrder: input.sortOrder,
      updatedAt: sql`now()`,
    })
    .where(eq(projects.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteProject(id: number): Promise<boolean> {
  const rows = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });
  return rows.length > 0;
}

/** Persist a new ordering. `order` is an array of project ids in display order. */
export async function reorderProjects(order: number[]): Promise<void> {
  await Promise.all(
    order.map((id, index) =>
      db
        .update(projects)
        .set({ sortOrder: index, updatedAt: sql`now()` })
        .where(eq(projects.id, id)),
    ),
  );
}
