import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client, Pool } from "pg";
import { eq } from "drizzle-orm";
import { projects, siteSettings } from "../src/lib/db/schema";

/**
 * Provisions a local Postgres database that mirrors production:
 *   1. creates the target database if it does not exist
 *   2. runs all drizzle migrations against it
 *   3. copies projects + site settings from the production (Neon) database
 *
 * Env:
 *   DATABASE_URL       local target (e.g. postgresql://postgres:postgres@localhost:5432/alex_portfolio)
 *   PROD_DATABASE_URL  source Neon connection string (read-only copy)
 */
async function ensureDatabaseExists(localUrl: string) {
  const url = new URL(localUrl);
  const dbName = url.pathname.replace(/^\//, "") || "postgres";
  // Connect to the default maintenance DB to issue CREATE DATABASE.
  const adminUrl = new URL(localUrl);
  adminUrl.pathname = "/postgres";

  const admin = new Client({ connectionString: adminUrl.toString() });
  await admin.connect();
  const exists = await admin.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName],
  );
  if (exists.rowCount === 0) {
    // Identifier can't be parameterized; dbName comes from our own config.
    await admin.query(`CREATE DATABASE "${dbName.replace(/"/g, '""')}"`);
    console.log(`created database "${dbName}"`);
  } else {
    console.log(`database "${dbName}" already exists`);
  }
  await admin.end();
}

async function main() {
  const localUrl = process.env.DATABASE_URL;
  const prodUrl = process.env.PROD_DATABASE_URL;
  if (!localUrl) throw new Error("DATABASE_URL (local target) is required.");
  if (!prodUrl) throw new Error("PROD_DATABASE_URL (source) is required.");

  await ensureDatabaseExists(localUrl);

  const pool = new Pool({ connectionString: localUrl });
  const local = drizzlePg(pool, { schema: { projects, siteSettings } });

  console.log("running migrations on local…");
  await migrate(local, { migrationsFolder: "./drizzle" });

  console.log("reading production data…");
  const prod = drizzleNeon(neon(prodUrl), { schema: { projects, siteSettings } });
  const prodProjects = await prod.select().from(projects);
  const prodSettings = await prod
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1));

  console.log(`copying ${prodProjects.length} projects…`);
  await local.delete(projects);
  for (const p of prodProjects) {
    // Drop the serial id so local assigns fresh ids; everything else is copied.
    const { id: _id, ...rest } = p;
    void _id;
    await local.insert(projects).values(rest);
  }

  if (prodSettings[0]) {
    console.log("copying site settings…");
    await local
      .insert(siteSettings)
      .values(prodSettings[0])
      .onConflictDoUpdate({ target: siteSettings.id, set: prodSettings[0] });
  }

  await pool.end();
  console.log("local database ready ✔");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
