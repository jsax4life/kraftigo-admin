import { z } from "zod";

export const WorkEligibilityStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED"
]);

export type WorkEligibilityStatus = z.infer<
  typeof WorkEligibilityStatusSchema
>;

/** Request body for PATCH .../review */
export type ReviewWorkEligibilityDocumentDto = {
  status: Extract<WorkEligibilityStatus, "APPROVED" | "REJECTED">;
  rejectionReason?: string;
};

const LooseRecord = z.record(z.string(), z.unknown());

const KrafterSummarySchema = z
  .object({
    id: z.string(),
    email: z.string().optional()
  })
  .passthrough();

/**
 * Shape returned by GET /api/admin/work-eligibility (list + detail).
 * Also accepts legacy camelCase fields used in older clients.
 */
export const WorkEligibilitySubmissionApiSchema = z
  .object({
    id: z.string(),
    reviewStatus: WorkEligibilityStatusSchema.optional(),
    status: WorkEligibilityStatusSchema.optional(),
    documentType: z.string().optional(),
    documentTypeLabel: z.string().optional(),
    otherDescription: z.string().nullable().optional(),
    documentUrl: z.string().optional(),
    rejectionReason: z.string().nullable().optional(),
    submittedAt: z.string().optional(),
    reviewedAt: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    userId: z.string().optional(),
    krafter: KrafterSummarySchema.optional(),
    user: LooseRecord.optional(),
    fileUrl: z.string().optional(),
    url: z.string().optional(),
    fileKey: z.string().optional(),
    mimeType: z.string().optional()
  })
  .passthrough();

export type WorkEligibilitySubmissionApi = z.infer<
  typeof WorkEligibilitySubmissionApiSchema
>;

/** Normalized document used in the admin UI */
export const WorkEligibilitySubmissionSchema = z
  .object({
    id: z.string(),
    status: WorkEligibilityStatusSchema,
    userId: z.string().optional(),
    rejectionReason: z.string().nullable().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    reviewedAt: z.string().nullable().optional(),
    documentUrl: z.string().optional(),
    fileUrl: z.string().optional(),
    url: z.string().optional(),
    fileKey: z.string().optional(),
    mimeType: z.string().optional(),
    user: LooseRecord.optional(),
    krafter: LooseRecord.optional()
  })
  .passthrough();

export type WorkEligibilitySubmission = z.infer<
  typeof WorkEligibilitySubmissionSchema
>;

export function normalizeWorkEligibilitySubmission(
  api: WorkEligibilitySubmissionApi
): WorkEligibilitySubmission {
  const status = api.reviewStatus ?? api.status;
  if (!status) {
    throw new Error("Work eligibility document missing reviewStatus/status");
  }

  const createdAt = api.submittedAt ?? api.createdAt;
  const userId = api.userId ?? api.krafter?.id;
  const updatedAt =
    api.reviewedAt != null
      ? api.reviewedAt
      : api.updatedAt != null
        ? api.updatedAt
        : undefined;

  const merged = {
    ...api,
    status,
    userId,
    createdAt,
    updatedAt,
    reviewedAt: api.reviewedAt
  };

  const parsed = WorkEligibilitySubmissionSchema.safeParse(merged);
  if (!parsed.success) {
    console.error("Work eligibility normalize validation error", parsed.error);
    throw new Error("Unexpected work eligibility document shape");
  }
  return parsed.data;
}
