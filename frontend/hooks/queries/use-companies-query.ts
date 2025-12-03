import { useQuery } from "@tanstack/react-query";
import type { Company } from "../../../types/company";

async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch("/api/companies");
  if (!res.ok) throw new Error("Failed to fetch companies");
  return res.json();
}

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });
}
