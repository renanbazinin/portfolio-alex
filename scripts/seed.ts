import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects } from "../src/lib/db/schema";

/**
 * Alex's real project catalog, consolidated from the alex-portfolio repo.
 * Image paths point at /public/assets (copied into this app); broken
 * /alex-portfolio/assets paths and the test entry have been removed, and
 * references to images that don't exist in the repo are dropped.
 */
const PROJECTS = [
  {
    slug: "fantasy-dragon",
    title: "Fantasy Dragon Flight",
    category: "3D",
    year: 2024,
    role: "Animation Director",
    tools: ["Maya", "Houdini", "Substance Painter"],
    thumbnail: "/assets/dragon-1.png",
    images: ["/assets/dragon-1.png"],
    videoUrl: "",
    description:
      "Epic dragon flight sequence with procedural wing dynamics and particle effects. Created for a AAA game cinematic trailer.",
    publishStatus: "published" as const,
    featured: true,
  },
  {
    slug: "mixer-animation",
    title: "Mixer Animation",
    category: "3D",
    year: 2024,
    role: "Lead Animator",
    tools: ["Maya", "Blender", "After Effects"],
    thumbnail: "/assets/mixer-1.png",
    images: ["/assets/mixer-1.png"],
    videoUrl: "",
    description:
      "A dynamic 3D animation showcasing advanced rigging and motion techniques. This project demonstrates realistic movements and precise timing for product visualization.",
    publishStatus: "published" as const,
    featured: true,
  },
  {
    slug: "classic-character-walk",
    title: "Classic Character Walk",
    category: "Classic",
    year: 2023,
    role: "Animator",
    tools: ["TVPaint", "Photoshop"],
    thumbnail: "/assets/walk-1.png",
    images: ["/assets/walk-1.png", "/assets/walk-2.png"],
    videoUrl: "",
    description:
      "Traditional frame-by-frame animation demonstrating the principles of weight, timing, and personality through a simple walk cycle.",
    publishStatus: "published" as const,
    featured: false,
  },
  {
    slug: "mixer-animation-2",
    title: "Mixer Animation 2",
    category: "Classic",
    year: 2023,
    role: "Lead Animator",
    tools: ["Toon Boom Harmony", "Procreate"],
    thumbnail: "/assets/mixer-1.png",
    images: ["/assets/mixer-1.png"],
    videoUrl: "",
    description:
      "A beautiful hand-drawn animation sequence featuring fluid movements and expressive motion for an independent animated project.",
    publishStatus: "published" as const,
    featured: false,
  },
];

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed.");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema: { projects } });

  console.log("Clearing existing projects…");
  await db.delete(projects);

  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    await db.insert(projects).values({ ...p, sortOrder: i });
    console.log(`  + ${p.title}${p.featured ? " ★" : ""}`);
  }

  console.log(`Seed complete. Inserted ${PROJECTS.length} projects.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
