"use client";

import { useApiQuery } from "@/lib/supabase/use-api-query";
import { fetchCashflow } from "@/lib/supabase/fetchers";

export function useCashflow() {
  return useApiQuery(["cashflow"], async ({ companyId }) => {
    await fetchCashflow({} as any);
    return { companyId, data: null };
  });
}
