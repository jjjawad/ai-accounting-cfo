"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VatSummaryCard from "@/components/vat/vat-summary-card";
import VatBreakdownTable from "@/components/vat/vat-breakdown-table";
import { useMockVatSummary } from "@/hooks/use-mock-vat-summary";

export default function Page() {
  const { data: vat } = useMockVatSummary();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Period Selector */}
        <div>
          <Select defaultValue="current">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Period</SelectItem>
              <SelectItem value="previous">Previous Period</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VatSummaryCard title="Total Output VAT" value={`AED ${vat.total_output_vat.toLocaleString()}`} />
          <VatSummaryCard title="Total Input VAT" value={`AED ${vat.total_input_vat.toLocaleString()}`} />
          <VatSummaryCard title="Net VAT Due" value={`AED ${vat.net_vat_due.toLocaleString()}`} />
        </div>

        {/* Breakdown Table */}
        <VatBreakdownTable breakdown={vat.breakdown} />

        {/* Export Button */}
        <div className="flex justify-end">
          <Button disabled>Export VAT Filing Pack</Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
