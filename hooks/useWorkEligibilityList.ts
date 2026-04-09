"use client";

import { useQuery } from "@tanstack/react-query";
import {
  workEligibilityService,
  type WorkEligibilityListParams
} from "@/services/work-eligibility.service";
import type { WorkEligibilitySubmission } from "@/types/work-eligibility";

export function useWorkEligibilityList(params?: WorkEligibilityListParams) {
  return useQuery<WorkEligibilitySubmission[], Error>({
    queryKey: ["work-eligibility", "list", params?.status ?? "all", params?.userId ?? ""],
    queryFn: () => workEligibilityService.list(params)
  });
}
