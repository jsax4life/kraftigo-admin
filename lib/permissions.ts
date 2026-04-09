import type { AdminUser, AdminRole } from "@/types/auth";

export type Permission =
  | "FULL_ACCESS"
  | "MANAGE_USERS"
  | "MANAGE_SERVICES"
  | "VIEW_USERS"
  | "VIEW_BOOKINGS"
  | "VIEW_ANALYTICS";

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    "FULL_ACCESS",
    "MANAGE_USERS",
    "MANAGE_SERVICES",
    "VIEW_USERS",
    "VIEW_BOOKINGS",
    "VIEW_ANALYTICS"
  ],
  ADMIN: ["MANAGE_USERS", "MANAGE_SERVICES", "VIEW_USERS", "VIEW_ANALYTICS"],
  SUPPORT: ["VIEW_USERS", "VIEW_BOOKINGS"],
  ANALYST: ["VIEW_ANALYTICS"]
};

export function getPermissionsForRole(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function canAccess(
  user: Pick<AdminUser, "role"> | null | undefined,
  permission: Permission
): boolean {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  const rolePermissions = new Set(ROLE_PERMISSIONS[user.role]);
  if (rolePermissions.has("FULL_ACCESS")) return true;
  return rolePermissions.has(permission);
}

