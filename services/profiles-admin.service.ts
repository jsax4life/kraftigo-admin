import { apiClient } from "@/lib/api-client";
import { parsePaginatedResponse, type PaginatedResult } from "@/lib/admin-api";
import {
  AdminProfileRowSchema,
  type AdminProfileRow
} from "@/types/admin-profiles";

export const profilesAdminService = {
  async listArtisans(): Promise<PaginatedResult<AdminProfileRow>> {
    const res = await apiClient.get("/api/admin/profiles/artisans");
    return parsePaginatedResponse(
      AdminProfileRowSchema,
      res.data,
      "artisan profiles"
    );
  },

  async listCustomers(): Promise<PaginatedResult<AdminProfileRow>> {
    const res = await apiClient.get("/api/admin/profiles/customers");
    return parsePaginatedResponse(
      AdminProfileRowSchema,
      res.data,
      "customer profiles"
    );
  }
};
