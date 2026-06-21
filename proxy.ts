// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (!isPrivate && !isPublic) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let newAccessToken: string | null = null;
  let newRefreshToken: string | null = null;

  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await checkSession();
      const setCookieHeader = refreshResponse.headers["set-cookie"];

      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        
        for (const cookieStr of cookieArray) {
          if (cookieStr.includes("accessToken=")) {
            const match = cookieStr.match(/accessToken=([^;]+)/);
            if (match) newAccessToken = match[1];
          }
          if (cookieStr.includes("refreshToken=")) {
            const match = cookieStr.match(/refreshToken=([^;]+)/);
            if (match) newRefreshToken = match[1];
          }
        }

        if (newAccessToken) {
          isAuthenticated = true;
        }
      }
    } catch (error) {
      console.error("Middleware session refresh failed:", error);
      isAuthenticated = false;
    }
  }

  
  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  
  if (isPublic && isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));
    
    
    if (newAccessToken) {
      redirectResponse.cookies.set("accessToken", newAccessToken, { path: "/" });
    }
    if (newRefreshToken) {
      redirectResponse.cookies.set("refreshToken", newRefreshToken, { path: "/" });
    }
    return redirectResponse;
  }

 
  const response = NextResponse.next();

  
  if (newAccessToken) {
    response.cookies.set("accessToken", newAccessToken, { path: "/" });
  }
  if (newRefreshToken) {
    response.cookies.set("refreshToken", newRefreshToken, { path: "/" });
  }

  return response;
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up"
  ],
};