"use client";

import { ProtectedRoute } from "@/components/protected-route";
import SummaryCard from "@/components/dashboard/summary-card";
import ChartPlaceholder from "@/components/dashboard/chart-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockOverviewMetrics } from "@/lib/mocks";
import { useMockOverview } from "@/hooks/use-mock-overview";
import { useMockTransactions } from "@/hooks/use-mock-transactions";

console.log("[Step 6.1] mockOverviewMetrics", mockOverviewMetrics);

export default function Page() {
  const { data: overview } = useMockOverview();
  const { data: transactions } = useMockTransactions();
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <SummaryCard
            title="Cash Balance"
            value={`AED ${overview.cash_balance.toLocaleString()}`}
          />
          <SummaryCard
            title="Income This Month"
            value={`AED ${overview.income_this_month.toLocaleString()}`}
          />
          <SummaryCard
            title="Expenses This Month"
            value={`AED ${overview.expenses_this_month.toLocaleString()}`}
          />
          <SummaryCard
            title="Net Result"
            value={`AED ${overview.net_result_this_month.toLocaleString()}`}
          />
          <SummaryCard
            title="VAT Due"
            value={`AED ${overview.vat_due_current_period.toLocaleString()}`}
          />
          <SummaryCard
            title="Runway"
            value={`${overview.runway_days} days`}
          />
        </div>

        {/* Charts, Breakdown, Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Main content */}
          <div className="xl:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder label="Income vs Expenses" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cashflow Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder label="Cashflow Over Time" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartPlaceholder label="Category Breakdown (Pie/Bar)" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.description_raw}</TableCell>
                        <TableCell className={tx.amount < 0 ? "text-red-600" : "text-green-600"}>
                          {tx.amount < 0
                            ? `- AED ${Math.abs(tx.amount).toLocaleString()}`
                            : `AED ${tx.amount.toLocaleString()}`}
                        </TableCell>
                        <TableCell>{tx.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Insights panel */}
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Insight placeholder 1</li>
                <li>Insight placeholder 2</li>
                <li>Insight placeholder 3</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
