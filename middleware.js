import { NextResponse } from "next/server";
import { verifications } from "@util/verifications";
import sessionCheck from "@util/sessionCheck";

export async function middleware(req) {
  //registration/login input field verifications
  const path = req.nextUrl.pathname;

  if (path.includes("registration") || path.includes("resetApi")) {
    const response = verifications(await req.json());
    if (!response.ok)
      return NextResponse.json({ message: response.message, ok: false });
  }

  // protect pages from users who are not logged in
  const redirectTo = await sessionCheck(path, req);
  if (redirectTo.ok)
    return NextResponse.redirect(new URL(redirectTo.to, req.url));
  return NextResponse.next();
}
