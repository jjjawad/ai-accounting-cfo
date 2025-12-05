import { useApiQuery } from "@/lib/supabase/use-api-query";
import { fetchVat } from "@/lib/supabase/fetchers";

export function useVatSummary() {
  return useApiQuery(["vat", "summary"], async ({ companyId }) => {
    await fetchVat({} as any);
    return { companyId, data: null };
  });
}
