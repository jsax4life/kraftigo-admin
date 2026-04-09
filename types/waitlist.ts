import { z } from "zod";

export const WaitlistEntrySchema = z.object({
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

export const WaitlistListSchema = z.array(WaitlistEntrySchema);

export type WaitlistEntry = z.infer<typeof WaitlistEntrySchema>;

