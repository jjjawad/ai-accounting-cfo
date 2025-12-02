"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/components/company-provider";

export function CompanySwitcher() {
  const { selectedCompany, setSelectedCompany } = useCompany();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{selectedCompany}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => setSelectedCompany("Company A")}>
          Company A
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelectedCompany("Company B")}>
          Company B
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
