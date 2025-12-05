"use client";

import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { useCompany } from "@/context/company-context";

type Fetcher<TData> = (ctx: { companyId: string | null }) => Promise<TData>;

export function useApiQuery<TData, TError = unknown>(
  key: QueryKey,
  fetcher: Fetcher<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, "queryKey" | "queryFn">
) {
  const { companyId } = useCompany();
  const baseKey = Array.isArray(key) ? key : [key];
  const queryKey: QueryKey = [...baseKey, companyId ?? null];

  return useQuery<TData, TError>({
    queryKey,
    queryFn: () => fetcher({ companyId }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
