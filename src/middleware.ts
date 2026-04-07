export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/my/:path*",
    "/artist/:path*",
  ],
};
