"use client";

import { useQuery } from "@tanstack/react-query";
import { mergeUsersWithProfiles } from "@/lib/merge-profiles";
import { profilesAdminService } from "@/services/profiles-admin.service";
import { usersAdminService } from "@/services/users-admin.service";
import type { AdminUserWithProfile } from "@/types/admin-users";

export function useAdminKrafters() {
  return useQuery<AdminUserWithProfile[], Error>({
    queryKey: ["admin", "krafters"],
    queryFn: async () => {
      const [users, profiles] = await Promise.all([
        usersAdminService.listKrafters(),
        profilesAdminService.listArtisans().catch(() => ({ items: [], meta: {} }))
      ]);
      return mergeUsersWithProfiles(users.items, profiles.items);
    }
  });
}

export function useAdminIntentKrafters() {
  return useQuery<AdminUserWithProfile[], Error>({
    queryKey: ["admin", "intent-krafters"],
    queryFn: async () => {
      const [users, profiles] = await Promise.all([
        usersAdminService.listIntentKrafters(),
        profilesAdminService.listArtisans().catch(() => ({ items: [], meta: {} }))
      ]);
      return mergeUsersWithProfiles(users.items, profiles.items);
    }
  });
}
