import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CRITICAL: Never intercept Next.js internal routes or static assets
  // Early return for all static assets and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json" ||
    // Static file extensions
    /\.(css|js|map|woff2|woff|ttf|otf|eot|png|jpg|jpeg|webp|svg|ico|gif|json|xml|txt)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Continue with normal request handling
  return NextResponse.next();
}

// Only run middleware on specific paths, excluding static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - static file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|map|woff2|woff|ttf|otf|eot|png|jpg|jpeg|webp|svg|ico|gif|json|xml|txt)).*)",
  ],
};

