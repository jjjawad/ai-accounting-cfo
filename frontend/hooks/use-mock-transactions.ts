import { getMockDataForCompany } from "@/lib/mocks";
import { useCompany } from "@/context/company-context";

export function useMockTransactions() {
  const { companyId } = useCompany();
  const data = getMockDataForCompany(companyId).transactions;
  return {
    data,
    isLoading: false,
    isError: false,
  } as const;
}
