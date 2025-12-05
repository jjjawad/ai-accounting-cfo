import { useApiQuery } from "@/lib/supabase/use-api-query";
import { fetchTransactions } from "@/lib/supabase/fetchers";

export function useTransactions() {
  return useApiQuery(["transactions"], async ({ companyId }) => {
    await fetchTransactions({} as any);
    return { companyId, data: null };
  });
}
