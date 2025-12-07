import { NextRequest, NextResponse } from "next/server";
import { MajorRole, MinorRole } from "../app/lib/types/types";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const majorRole = req.cookies.get("majorRole")?.value as MajorRole | undefined;
  const minorRole = req.cookies.get("minorRole")?.value as MinorRole | undefined;

  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith("/dashboard");

  if (!token && isProtected) {
      return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && isProtected) {
      if (majorRole === MajorRole.OWNER) {
          if (!pathname.startsWith("/dashboard/(owner)")) {
              return NextResponse.redirect(new URL("/dashboard/(owner)", req.url));
          }
          return NextResponse.next();
      }

      if (majorRole === MajorRole.KARYAWAN && minorRole === MinorRole.HR) {
          if (!pathname.startsWith("/dashboard/(hr)")) {
              return NextResponse.redirect(new URL("/dashboard/(hr)", req.url));
          }
          return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
