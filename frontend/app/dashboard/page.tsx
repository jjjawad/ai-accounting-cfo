import { ProtectedRoute } from "@/components/protected-route";
import SummaryCard from "@/components/dashboard/summary-card";
import ChartPlaceholder from "@/components/dashboard/chart-placeholder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <SummaryCard title="Cash Balance" value="AED —" />
          <SummaryCard title="Income This Month" value="AED —" />
          <SummaryCard title="Expenses This Month" value="AED —" />
          <SummaryCard title="Net Result" value="AED —" />
          <SummaryCard title="VAT Due" value="AED —" />
          <SummaryCard title="Runway" value="— days" />
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
