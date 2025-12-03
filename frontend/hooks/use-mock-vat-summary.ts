import { mockVatSummary } from "@/lib/mocks";

export function useMockVatSummary() {
  return {
    data: mockVatSummary,
    isLoading: false,
    isError: false,
  } as const;
}
