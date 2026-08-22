import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUBDOMAIN_ROUTES: Record<string, string> = {
  "sudokult-privacy": "/privacy",
  "delete-sudokult-account": "/delete-account",
};

function resolveSubdomainRoute(request: NextRequest): string | undefined {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();

  for (const [subdomain, path] of Object.entries(SUBDOMAIN_ROUTES)) {
    if (hostname === subdomain || hostname.startsWith(`${subdomain}.`)) {
      return path;
    }
  }

  return undefined;
}

export function proxy(request: NextRequest) {
  const route = resolveSubdomainRoute(request);

  if (!route) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Serve the target page directly; let assets and API routes through untouched.
  if (
    pathname === route ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = route;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico).*)"],
};
