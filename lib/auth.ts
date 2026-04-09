import { cookies } from "next/headers";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { AdminRoleSchema } from "@/types/auth";

export const AdminJwtSchema = z.object({
  sub: z.string(),
  role: AdminRoleSchema,
  exp: z.number()
});

export type AdminJwt = z.infer<typeof AdminJwtSchema>;

const TOKEN_COOKIE_NAME = "kraftigo_admin_token";

export async function getAdminFromRequest(): Promise<AdminJwt | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;

  return parseAdminJwt(token);
}

export function getTokenCookieName() {
  return TOKEN_COOKIE_NAME;
}

export function parseAdminJwt(token: string): AdminJwt | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET || "dev-secret"
    ) as unknown;
    const parsed = AdminJwtSchema.parse(decoded);
    return parsed;
  } catch {
    return null;
  }
}

