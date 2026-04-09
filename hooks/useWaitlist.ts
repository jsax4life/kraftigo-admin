"use client";

import { useQuery } from "@tanstack/react-query";
import { waitlistService } from "@/services/waitlist.service";
import type { WaitlistEntry } from "@/types/waitlist";

export function useWaitlist() {
  return useQuery<WaitlistEntry[], Error>({
    queryKey: ["waitlist"],
    queryFn: () => waitlistService.getAll()
  });
}

