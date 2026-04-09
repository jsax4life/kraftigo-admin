import { apiClient } from "@/lib/api-client";
import {
  WorkEligibilityListSchema,
  WorkEligibilitySubmissionSchema,
  type ReviewWorkEligibilityDocumentDto,
  type WorkEligibilityStatus,
  type WorkEligibilitySubmission
} from "@/types/work-eligibility";

function unwrapListPayload(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data;
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.results)) return o.results;
  }
  return [];
}

function unwrapEntityPayload(data: unknown): unknown {
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    if (inner && typeof inner === "object") return inner;
  }
  return data;
}

function parseSubmission(raw: unknown): WorkEligibilitySubmission {
  const parsed = WorkEligibilitySubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("Work eligibility item validation error", parsed.error);
    throw new Error("Unexpected work eligibility document shape");
  }
  return parsed.data;
}

export type WorkEligibilityListParams = {
  status?: WorkEligibilityStatus;
  userId?: string;
};

export const workEligibilityService = {
  async list(params?: WorkEligibilityListParams): Promise<WorkEligibilitySubmission[]> {
    const res = await apiClient.get("/api/admin/work-eligibility", {
      params: {
        ...(params?.status ? { status: params.status } : {}),
        ...(params?.userId ? { userId: params.userId } : {})
      }
    });
    const rows = unwrapListPayload(res.data);
    const parsed = WorkEligibilityListSchema.safeParse(rows);
    if (!parsed.success) {
      console.error("Work eligibility list validation error", parsed.error);
      throw new Error("Unexpected work eligibility list response shape");
    }
    return parsed.data;
  },

  async getById(id: string): Promise<WorkEligibilitySubmission> {
    const res = await apiClient.get(`/api/admin/work-eligibility/${id}`);
    return parseSubmission(unwrapEntityPayload(res.data));
  },

  async review(
    id: string,
    body: ReviewWorkEligibilityDocumentDto
  ): Promise<void> {
    await apiClient.patch(
      `/api/admin/work-eligibility/${id}/review`,
      body
    );
  }
};
