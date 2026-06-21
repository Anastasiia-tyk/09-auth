// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  if (!isPrivate && !isPublic) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = !!accessToken;
  let responseWithNewCookies: NextResponse | null = null;

  if (!accessToken && refreshToken) {
    try {
      const refreshResponse = await axios.post(
        "https://notehub-api.goit.study/auth/refresh",
        {},
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      const setCookieHeader = refreshResponse.headers["set-cookie"];
      
      if (setCookieHeader) {
        responseWithNewCookies = NextResponse.next();
        
        setCookieHeader.forEach((cookieStr) => {
          const [fullCookie] = cookieStr.split(";");
          const [name, value] = fullCookie.split("=");
          responseWithNewCookies?.cookies.set(name.trim(), value.trim(), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          });
          if (name.trim() === "accessToken") {
            accessToken = value.trim();
          }
        });
        
        isAuthenticated = true;
      }
    } catch (error) {
      console.error("Middleware refresh token error:", error);
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