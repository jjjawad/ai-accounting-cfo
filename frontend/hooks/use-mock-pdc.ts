import { getMockDataForCompany } from "@/lib/mocks";
import { useCompany } from "@/context/company-context";

export function useMockPdc() {
  const { companyId } = useCompany();
  const data = getMockDataForCompany(companyId).pdcItems;
  return {
    data,
    isLoading: false,
    isError: false,
  } as const;
}
