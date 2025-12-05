"use client";

import { getMockDataForCompany } from "@/lib/mocks";
import { useCompany } from "@/context/company-context";

export function useMockVatSummary() {
  const { companyId } = useCompany();
  const data = getMockDataForCompany(companyId).vatSummary;
  return {
    data,
    isLoading: false,
    isError: false,
  } as const;
}
