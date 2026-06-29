import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

/** Verify a submitted password against the stored bcrypt hash. */
export async function verifyPassword(password: string): Promise<boolean> {
  if (!password) return false;
  return bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
}

/** Helper used by the hashing script to generate a hash for a new password. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
