import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED = ["/operator", "/triage", "/my-incidents", "/track", "/act", "/report", "/recover"];
const COOKIE_NAME = "raksha_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      // Invalid or expired token. Continue to the sign-in redirect.
    }
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/operator/:path*",
    "/triage/:path*",
    "/my-incidents/:path*",
    "/track/:path*",
    "/act/:path*",
    "/report/:path*",
    "/recover/:path*",
  ],
};
