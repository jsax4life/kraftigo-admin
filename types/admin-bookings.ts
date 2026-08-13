import { z } from "zod";

const LooseRecord = z.record(z.string(), z.unknown());

export const AdminBookingSchema = z
  .object({
    id: z.string(),
    status: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    scheduledAt: z.string().nullable().optional(),
    customerId: z.string().optional(),
    artisanId: z.string().optional(),
    categoryId: z.string().optional(),
    customer: LooseRecord.optional(),
    artisan: LooseRecord.optional(),
    krafter: LooseRecord.optional(),
    category: LooseRecord.optional(),
    serviceCategory: LooseRecord.optional()
  })
  .passthrough();

export type AdminBooking = z.infer<typeof AdminBookingSchema>;

export type AdminBookingsListParams = {
  page?: number;
  limit?: number;
  status?: string;
  customerId?: string;
  artisanId?: string;
  categoryId?: string;
};
