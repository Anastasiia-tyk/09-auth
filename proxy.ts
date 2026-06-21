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
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let responseWithNewCookies: NextResponse | null = null;

  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await checkSession();
      const setCookieHeader = refreshResponse.headers["set-cookie"];

      if (setCookieHeader) {
  responseWithNewCookies = NextResponse.next();

  const responseHeaders = new Headers();
  const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  cookieArray.forEach((cookieStr) => {
    responseHeaders.append("set-cookie", cookieStr);
  });

  const tempResponse = new Response(null, {
    headers: responseHeaders,
  });

  const parsedCookies = tempResponse.headers.getSetCookie();

        const headersObject = new Headers();
        parsedCookies.forEach((c) => headersObject.append("set-cookie", c));
        const edgeResponse = NextResponse.next({ headers: headersObject });

        edgeResponse.cookies.getAll().forEach((c) => {
          responseWithNewCookies?.cookies.set(c.name, c.value, {
            path: c.path,
            expires: c.expires,
            maxAge: c.maxAge,
            domain: c.domain,
            sameSite: c.sameSite,
            httpOnly: c.httpOnly,
            secure: c.secure,
          });

          if (c.name === "accessToken") {
            accessToken = c.value;
          }
        });

        isAuthenticated = true;
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
    
    if (responseWithNewCookies) {
      responseWithNewCookies.cookies.getAll().forEach((c) => {
        redirectResponse.cookies.set(c.name, c.value, {
          path: c.path,
          expires: c.expires,
          maxAge: c.maxAge,
          domain: c.domain,
          sameSite: c.sameSite,
          httpOnly: c.httpOnly,
          secure: c.secure,
        });
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