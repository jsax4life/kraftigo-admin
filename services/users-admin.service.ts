import { apiClient } from "@/lib/api-client";
import { parsePaginatedResponse, type PaginatedResult } from "@/lib/admin-api";
import {
  AdminUserRowSchema,
  type AdminUserRow,
  type AdminUsersListParams
} from "@/types/admin-users";

function listParams(params?: AdminUsersListParams) {
  return {
    ...(params?.page != null ? { page: params.page } : {}),
    ...(params?.limit != null ? { limit: params.limit } : {})
  };
}

export const usersAdminService = {
  async listKrafters(
    params?: AdminUsersListParams
  ): Promise<PaginatedResult<AdminUserRow>> {
    const res = await apiClient.get("/api/admin/users/krafters", {
      params: listParams(params)
    });
    return parsePaginatedResponse(AdminUserRowSchema, res.data, "krafters");
  },

  async listCustomers(
    params?: AdminUsersListParams
  ): Promise<PaginatedResult<AdminUserRow>> {
    const res = await apiClient.get("/api/admin/users/customers", {
      params: listParams(params)
    });
    return parsePaginatedResponse(AdminUserRowSchema, res.data, "customers");
  },

  async listIntentKrafters(
    params?: AdminUsersListParams
  ): Promise<PaginatedResult<AdminUserRow>> {
    const res = await apiClient.get("/api/admin/users/intent-krafters", {
      params: listParams(params)
    });
    return parsePaginatedResponse(
      AdminUserRowSchema,
      res.data,
      "intent krafters"
    );
  }
};
