import { z } from "zod";

/** Response body from POST /api/admin/bookings/expire-overdue/run */
export const ExpireOverdueSweepResultSchema = z.object({
  scanned: z.coerce.number(),
  expired: z.coerce.number(),
  cutoffIso: z.string(),
  graceHours: z.coerce.number(),
  batchSize: z.coerce.number()
});

export type ExpireOverdueSweepResult = z.infer<
  typeof ExpireOverdueSweepResultSchema
>;
