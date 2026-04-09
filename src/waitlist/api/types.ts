import { z } from "zod";

export const waitlistEntrySchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  country: z.string(),
  city: z.string(),
  role: z.enum(["ARTISAN", "CUSTOMER", "BOTH"]),
  serviceInterest: z.string(),
  agreesToContact: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const waitlistResponseSchema = z.array(waitlistEntrySchema);

export type WaitlistEntry = z.infer<typeof waitlistEntrySchema>;

