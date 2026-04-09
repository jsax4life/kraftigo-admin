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
  user: Pick<AdminUser, "roles"> | null | undefined,
  permission: Permission
): boolean {
  if (!user || !user.roles || user.roles.length === 0) return false;
  
  // Check if user has SUPER_ADMIN role (full access)
  if (user.roles.includes("SUPER_ADMIN")) return true;
  
  // Check if any of the user's roles have the required permission
  for (const role of user.roles) {
    const rolePermissions = new Set(ROLE_PERMISSIONS[role]);
    if (rolePermissions.has("FULL_ACCESS")) return true;
    if (rolePermissions.has(permission)) return true;
  }
  
  return false;
}

