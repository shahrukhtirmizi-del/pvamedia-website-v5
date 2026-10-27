import { NextResponse, type NextRequest } from "next/server";
import { COUNTRY_COOKIE } from "./app/lib/tracking";

/**
 * Hands the visitor's country, from Vercel's edge, to the browser so the
 * Meta Pixel can follow US opt-out or everywhere-else opt-in rules.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const country = request.headers.get("x-vercel-ip-country");
  if (country && request.cookies.get(COUNTRY_COOKIE)?.value !== country) {
    response.cookies.set(COUNTRY_COOKIE, country, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: true,
    });
  }
  return response;
}

export const config = {
  // pages only: skip build assets and anything with a file extension
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
