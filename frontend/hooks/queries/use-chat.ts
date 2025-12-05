import { useApiQuery } from "@/lib/supabase/use-api-query";
import { fetchChat } from "@/lib/supabase/fetchers";

export function useChat() {
  return useApiQuery(["chat"], async ({ companyId }) => {
    await fetchChat({} as any);
    return { companyId, data: null };
  });
}
