import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

/**
 * The stored hash is base64-encoded so it never contains `$`, which dotenv /
 * `@next/env` would otherwise treat as variable expansion and corrupt.
 */
function decodeStoredHash(): string {
  return Buffer.from(env.ADMIN_PASSWORD_HASH, "base64").toString("utf8");
}

/** Verify a submitted password against the stored bcrypt hash. */
export async function verifyPassword(password: string): Promise<boolean> {
  if (!password) return false;
  return bcrypt.compare(password, decodeStoredHash());
}

/** Generate a base64-encoded bcrypt hash for a new password. */
export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 12);
  return Buffer.from(hash, "utf8").toString("base64");
}
