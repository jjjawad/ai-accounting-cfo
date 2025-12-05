import { getMockDataForCompany } from "@/lib/mocks";
import { useCompany } from "@/context/company-context";

export function useMockChatHistory() {
  const { companyId } = useCompany();
  const data = getMockDataForCompany(companyId).chatHistory;
  return {
    data,
    isLoading: false,
    isError: false,
  } as const;
}
