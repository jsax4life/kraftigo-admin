"use client";

import { useQuery } from "@tanstack/react-query";
import { workEligibilityService } from "@/services/work-eligibility.service";
import type { WorkEligibilitySubmission } from "@/types/work-eligibility";

export function useWorkEligibilityDocument(id: string | undefined) {
  return useQuery<WorkEligibilitySubmission, Error>({
    queryKey: ["work-eligibility", "detail", id],
    queryFn: () => workEligibilityService.getById(id!),
    enabled: !!id
  });
}
