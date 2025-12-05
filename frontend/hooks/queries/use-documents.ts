"use client";

import { useApiQuery } from "@/lib/supabase/use-api-query";
import { fetchDocuments } from "@/lib/supabase/fetchers";

export function useDocuments() {
  return useApiQuery(["documents"], async ({ companyId }) => {
    await fetchDocuments({} as any);
    return { companyId, data: null };
  });
}
