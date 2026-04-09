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

export const WorkEligibilityListSchema = z.array(
  WorkEligibilitySubmissionSchema
);
