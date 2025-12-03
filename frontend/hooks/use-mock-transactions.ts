import { mockTransactions } from "@/lib/mocks";

export function useMockTransactions() {
  return {
    data: mockTransactions,
    isLoading: false,
    isError: false,
  } as const;
}
