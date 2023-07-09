import { getToken } from "next-auth/jwt";

export default async function sessionCheck(path, req) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const protectedList = [
    "/dashboard",
    "/calculator",
    "/converter",
    "/downloader",
    "/expense",
    "/notes",
    "/password",
    "/todo",
    "/settings",
  ];
  const isProtected = protectedList.some((item) => path.includes(item));

  if (!session && isProtected) return { ok: true, to: "/" };
  else if (session && path === "/") return { ok: true, to: "/dashboard" };
  else return { ok: false };
}
