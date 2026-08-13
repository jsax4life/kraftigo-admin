import { z } from "zod";

import type { AdminProfileRow } from "@/types/admin-profiles";

export const AdminUserRowSchema = z
  .object({
    id: z.string(),
    email: z.string().optional(),
    status: z.string().optional(),
    roles: z.array(z.string()).optional(),
    phone: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    hasStartedArtisanOnboarding: z.boolean().optional()
  })
  .passthrough();

export type AdminUserRow = z.infer<typeof AdminUserRowSchema>;

export type AdminUserWithProfile = AdminUserRow & {
  profile?: AdminProfileRow;
};

export type AdminUsersListParams = {
  page?: number;
  limit?: number;
};
