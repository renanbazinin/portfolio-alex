/**
 * Centralized environment access with fail-fast validation.
 * Required secrets must be present at runtime; we throw a clear error naming
 * the missing variable instead of failing later in a confusing way.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `See .env.example for the full list.`,
    );
  }
  return value;
}

export const env = {
  get DATABASE_URL() {
    return required("DATABASE_URL");
  },
  get SESSION_SECRET() {
    return required("SESSION_SECRET");
  },
  get ADMIN_PASSWORD_HASH() {
    return required("ADMIN_PASSWORD_HASH");
  },
  get BLOB_READ_WRITE_TOKEN() {
    return required("BLOB_READ_WRITE_TOKEN");
  },
};
