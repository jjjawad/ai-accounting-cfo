import { useApiQuery } from "@/lib/supabase/use-api-query";
import { fetchDashboard } from "@/lib/supabase/fetchers";

export function useDashboardOverview() {
  return useApiQuery(["dashboard", "overview"], async ({ companyId }) => {
    await fetchDashboard({} as any);
    return { companyId, data: null };
  });
}
