"use client";

import { useQuery } from "@tanstack/react-query";
import { mergeUsersWithProfiles } from "@/lib/merge-profiles";
import { profilesAdminService } from "@/services/profiles-admin.service";
import { usersAdminService } from "@/services/users-admin.service";
import type { AdminUserWithProfile } from "@/types/admin-users";

export function useAdminCustomers() {
  return useQuery<AdminUserWithProfile[], Error>({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      const [users, profiles] = await Promise.all([
        usersAdminService.listCustomers(),
        profilesAdminService.listCustomers().catch(() => ({ items: [], meta: {} }))
      ]);
      return mergeUsersWithProfiles(users.items, profiles.items);
    }
  });
}
