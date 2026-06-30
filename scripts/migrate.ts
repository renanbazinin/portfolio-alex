import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { migrate as migrateNeon } from "drizzle-orm/neon-http/migrator";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

/**
 * Driver-aware migration runner. Uses the Neon HTTP migrator for neon.tech
 * URLs and node-postgres for everything else (e.g. the local Docker DB). This
 * replaces `drizzle-kit migrate`, whose websocket driver hangs against Neon
 * from this environment.
 */
async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required.");
  const isNeon = /neon\.(tech|build)|\.neon\./i.test(url);

  if (isNeon) {
    await migrateNeon(drizzleNeon(neon(url)), { migrationsFolder: "./drizzle" });
  } else {
    const pool = new Pool({ connectionString: url });
    await migratePg(drizzlePg(pool), { migrationsFolder: "./drizzle" });
    await pool.end();
  }

  console.log(`migrations applied via ${isNeon ? "neon-http" : "node-postgres"}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
