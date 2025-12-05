"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForecastChartPlaceholder from "@/components/cashflow/forecast-chart-placeholder";
import CashflowSummaryCard from "@/components/cashflow/summary-card";
import PdcTable from "@/components/cashflow/pdc-table";
import { useCashflow } from "@/hooks/queries/use-cashflow";
import { useMockCashflow } from "@/hooks/use-mock-cashflow";

export default function Page() {
  useCashflow();
  const { data: cashflow } = useMockCashflow();
  const burnRate = cashflow?.burn_rate_monthly ?? null;
  const runway = cashflow?.runway_days ?? null;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cashflow Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastChartPlaceholder />
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CashflowSummaryCard
            title="Burn Rate"
            value={burnRate !== null ? `AED ${burnRate.toLocaleString()} / month` : "AED -- / month"}
          />
          <CashflowSummaryCard title="Runway" value={runway !== null ? `${runway} days` : "-- days"} />
        </div>

        {/* Upcoming PDCs */}
        <PdcTable />

        {/* Key Cash Drivers */}
        <Card>
          <CardHeader>
            <CardTitle>Key Cash Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              <li>Driver placeholder 1</li>
              <li>Driver placeholder 2</li>
              <li>Driver placeholder 3</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
