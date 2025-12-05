"use client";

import { useApiQuery } from "@/lib/supabase/use-api-query";
import { fetchAdmin } from "@/lib/supabase/fetchers";

export function useAdmin() {
  return useApiQuery(["admin"], async ({ companyId }) => {
    await fetchAdmin({} as any);
    return { companyId, data: null };
  });
}
