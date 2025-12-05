import { getMockDataForCompany } from "@/lib/mocks";
import { useCompany } from "@/context/company-context";

export function useMockCashflow() {
  const { companyId } = useCompany();
  const data = getMockDataForCompany(companyId).cashflow;
  return {
    data,
    isLoading: false,
    isError: false,
  } as const;
}
