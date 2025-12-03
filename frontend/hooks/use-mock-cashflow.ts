import { mockCashflowForecast } from "@/lib/mocks";

export function useMockCashflow() {
  return {
    data: mockCashflowForecast,
    isLoading: false,
    isError: false,
  } as const;
}
