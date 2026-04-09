import { waitlistResponseSchema, type WaitlistEntry } from "./types";

const WAITLIST_URL =
  "https://api.xn--kraftig-g1a.com/api/admin/waitlist" as const;

export async function fetchWaitlist(): Promise<WaitlistEntry[]> {
  const res = await fetch(WAITLIST_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
      // In a real admin environment, this would include auth headers / tokens
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch waitlist (${res.status})`);
  }

  const json = await res.json();
  const parsed = waitlistResponseSchema.safeParse(json);
  if (!parsed.success) {
    // Surface a generic error but log details for observability
    console.error("Waitlist response validation failed", parsed.error);
    throw new Error("Unexpected waitlist response shape");
  }
  return parsed.data;
}

