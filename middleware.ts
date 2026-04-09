import type { NextRequest } from "next/server";
import { authMiddleware } from "./middleware/auth-middleware";

export function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

