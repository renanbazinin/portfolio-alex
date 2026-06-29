import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects } from "../src/lib/db/schema";

const LEGACY_URL =
  "https://raw.githubusercontent.com/renabazinin/repoForRawThings/refs/heads/main/alexPort/projects.json";

type LegacyProject = {
  slug?: string;
  title?: string;
  category?: string;
  year?: number | string;
  role?: string;
  tools?: string[];
  thumb?: string;
  thumbnail?: string;
  videoUrl?: string;
  images?: string[];
  description?: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed.");
  }

  console.log("Fetching legacy projects from", LEGACY_URL);
  const res = await fetch(LEGACY_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch legacy data: ${res.status}`);
  }
  const legacy = (await res.json()) as LegacyProject[];
  console.log(`Found ${legacy.length} legacy projects.`);

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema: { projects } });

  const seen = new Set<string>();
  let inserted = 0;

  for (let i = 0; i < legacy.length; i++) {
    const p = legacy[i];
    const title = (p.title ?? "Untitled").trim();
    let slug = slugify(p.slug || title) || `project-${i + 1}`;
    while (seen.has(slug)) slug = `${slug}-${i + 1}`;
    seen.add(slug);

    const yearNum =
      typeof p.year === "number"
        ? p.year
        : p.year && /^\d{4}$/.test(String(p.year))
          ? Number(p.year)
          : null;

    const result = await db
      .insert(projects)
      .values({
        slug,
        title,
        category: p.category ?? "",
        year: yearNum,
        role: p.role ?? "",
        tools: Array.isArray(p.tools) ? p.tools : [],
        description: p.description ?? "",
        thumbnail: p.thumbnail ?? p.thumb ?? "",
        images: Array.isArray(p.images) ? p.images : [],
        videoUrl: p.videoUrl ?? "",
        publishStatus: "published",
        sortOrder: i,
      })
      .onConflictDoNothing({ target: projects.slug })
      .returning({ id: projects.id });

    if (result.length > 0) inserted++;
  }

  console.log(`Seed complete. Inserted ${inserted} new projects.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
