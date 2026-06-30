import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * The app talks to Neon in production (HTTP driver) and a plain local Postgres
 * in development (node-postgres). Both expose the same drizzle query API, so we
 * pick the driver from the connection string and keep a single `db` type.
 */
type Database = NeonHttpDatabase<typeof schema>;

let _db: Database | null = null;

/** Neon connection strings target a neon.tech host; everything else is local. */
export function isNeonUrl(url: string): boolean {
  return /neon\.(tech|build)|\.neon\./i.test(url);
}

function getDb(): Database {
  if (!_db) {
    const url = env.DATABASE_URL;
    if (isNeonUrl(url)) {
      _db = drizzleNeon(neon(url), { schema });
    } else {
      const pool = new Pool({ connectionString: url });
      // node-postgres and neon-http share the query API; cast to one type so
      // call sites stay identical regardless of environment.
      _db = drizzlePg(pool, { schema }) as unknown as Database;
    }
  }
  return _db;
}

/**
 * Lazy drizzle client. The connection is only created on first query, so the
 * app can be built without DATABASE_URL present (pages are dynamic).
 */
export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof typeof instance];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
