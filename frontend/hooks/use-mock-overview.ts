import { getMockDataForCompany } from "@/lib/mocks";
import { useCompany } from "@/context/company-context";

export function useMockOverview() {
  const { companyId } = useCompany();
  const data = getMockDataForCompany(companyId).overview;
  return {
    data,
    isLoading: false,
    isError: false,
  } as const;
}
