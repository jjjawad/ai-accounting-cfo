import { mockIncomeExpenseSeries } from "@/lib/mocks";

export function useMockIncomeExpense() {
  return {
    data: mockIncomeExpenseSeries,
    isLoading: false,
    isError: false,
  } as const;
}
