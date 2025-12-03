"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCompaniesQuery } from "@/hooks/queries/use-companies-query";
import { useCompany } from "@/context/company-context";

export function CompanySwitcher() {
  const { data, isLoading, isError } = useCompaniesQuery();
  const { companyId, setCompanyId } = useCompany();

  const displayName = companyId ? data?.find((c) => c.id === companyId)?.name ?? "Select Company" : "Select Company";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{displayName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {isLoading && <div className="px-2 py-1 text-sm">Loading...</div>}
        {isError && <div className="px-2 py-1 text-sm text-red-500">Failed to load</div>}

        {data?.map((c) => (
          <DropdownMenuItem key={c.id} onSelect={() => setCompanyId(c.id)}>
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
