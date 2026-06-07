import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Update session cookies by exchanging/refreshing tokens as needed
  const sessionResult = await updateSession({
    requestCookies: request.cookies as any,
    responseCookies: response.cookies as any,
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
  });

  const path = request.nextUrl.pathname;

  // Define routes requiring authentication
  const protectedRoutes = ["/dashboard", "/profile", "/find-jobs"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(route + "/")
  );

  // Check if we have a valid access token in response cookies, session result, or request cookies
  const hasAccessToken =
    !!sessionResult.accessToken ||
    !!response.cookies.get("insforge_access_token")?.value ||
    !!request.cookies.get("insforge_access_token")?.value;

  if (isProtectedRoute && !hasAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", path);
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Redirect authenticated users away from login page to dashboard
  if (path === "/login" && hasAccessToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, images/ (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.png|images/).*)",
  ],
};
