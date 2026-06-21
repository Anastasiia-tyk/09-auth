// proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

    if (!isPrivate && !isPublic) {
        return NextResponse.next();
    }

    const user = await checkSession();
    const isAuthenticated = !!user;

    if (isPrivate && !isAuthenticated) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (isPublic && isAuthenticated) {
        return NextResponse.redirect(new URL("/profile", request.url));
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