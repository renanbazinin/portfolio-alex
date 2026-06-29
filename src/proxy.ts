import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Protects the admin area and all content-mutating APIs.
 * Public pages and read-only project GETs are left open.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySession(token);

  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");

  // Mutating API methods require a session (login/logout handled in their routes).
  const isWriteApi =
    pathname.startsWith("/api/projects") || pathname.startsWith("/api/upload");
  const isWriteMethod = request.method !== "GET" && request.method !== "HEAD";

  if (isAdminPage && !isLoginPage && !authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && authed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isWriteApi && isWriteMethod && !authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*", "/api/upload/:path*"],
};
