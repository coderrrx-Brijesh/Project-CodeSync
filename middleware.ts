import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  // Check if we're trying to access the verify-email page with justSignedUp param
  // If so, we should allow access regardless of auth state
  if (
    url.pathname.startsWith("/verify-email") &&
    (url.searchParams.get("justSignedUp") === "true" ||
      url.searchParams.get("token"))
  ) {
    return NextResponse.next();
  }

  // If the user is logged in (token exists) and is trying to access signin/signup/verify-email or the home page,
  // redirect them to the homepage.
  if (
    token &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify-email"))
  ) {
    return NextResponse.redirect(new URL("/", url));
  }

  // If the user is not logged in (no token) and trying to access protected pages (e.g. /editor), redirect to signin.
  if (!token && url.pathname.startsWith("/editor")) {
    return NextResponse.redirect(new URL("/signin", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/verify-email", "/editor"],
};
