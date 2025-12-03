import { mockOverviewMetrics } from "@/lib/mocks";

export function useMockOverview() {
  return {
    data: mockOverviewMetrics,
    isLoading: false,
    isError: false,
  } as const;
}
