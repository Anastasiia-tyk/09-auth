// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers"; // Вимога 1: асинхронні кукі
import { checkSession } from "./lib/api/serverApi"; // Вимога 3: наша абстракція checkSession
import { parse } from "cookie"; // Для копіювання оригінальних атрибутів

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
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let responseWithNewCookies: NextResponse | null = null;

  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await checkSession();
      const setCookie = refreshResponse.headers["set-cookie"];

      if (setCookie) {
        responseWithNewCookies = NextResponse.next();
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          };

          if (parsed.accessToken) {
            responseWithNewCookies.cookies.set("accessToken", parsed.accessToken, options);
            accessToken = parsed.accessToken;
          }
          if (parsed.refreshToken) {
            responseWithNewCookies.cookies.set("refreshToken", parsed.refreshToken, options);
          }
        }
        isAuthenticated = true;
      }
    } catch (error) {
      console.error(error);
      isAuthenticated = false;
    }
  }

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublic && isAuthenticated) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));
    
    if (responseWithNewCookies) {
      responseWithNewCookies.cookies.getAll().forEach((c) => {
        redirectResponse.cookies.set(c.name, c.value);
      });
    }
    return redirectResponse;
  }

  if (responseWithNewCookies) {
    return responseWithNewCookies;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up"
  ],
};