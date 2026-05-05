import { apiClient } from "@/lib/api-client";
import {
  ExpireOverdueSweepResultSchema,
  type ExpireOverdueSweepResult
} from "@/types/bookings-admin";

function unwrapEntityPayload(data: unknown): unknown {
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    if (inner && typeof inner === "object") return inner;
  }
  return data;
}

export const bookingsAdminService = {
  async runExpireOverdueSweep(): Promise<ExpireOverdueSweepResult> {
    const res = await apiClient.post(
      "/api/admin/bookings/expire-overdue/run"
    );
    const raw = unwrapEntityPayload(res.data);
    const parsed = ExpireOverdueSweepResultSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("expire-overdue sweep response validation error", parsed.error);
      throw new Error("Unexpected expire-overdue sweep response shape");
    }
    return parsed.data;
  }
};
