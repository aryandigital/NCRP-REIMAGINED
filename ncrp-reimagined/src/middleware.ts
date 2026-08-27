import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED = ["/operator", "/triage", "/check", "/my-incidents", "/track"];
const COOKIE_NAME = "raksha_session";

function getSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET not set");
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      // Token invalid — fall through to redirect
    }
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/operator/:path*", "/triage/:path*", "/check/:path*", "/my-incidents/:path*", "/track", "/track/:path*"],
};
