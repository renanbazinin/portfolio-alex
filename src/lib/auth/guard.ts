import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./session";

/** Returns true when the current request carries a valid admin session. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
