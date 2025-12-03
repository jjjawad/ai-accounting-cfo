import { useCompany } from "@/context/company-context";
import { useCompaniesQuery } from "@/hooks/queries/use-companies-query";
import type { Company } from "@/types/company";

export function useActiveCompany() {
  const { companyId } = useCompany();
  const { data, isLoading, isError } = useCompaniesQuery();

  const company: Company | null = data?.find((c) => c.id === companyId) ?? null;

  return {
    company,
    isLoading,
    isError,
  };
}
