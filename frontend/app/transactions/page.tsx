import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionsTable from "@/components/transactions/table";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <label htmlFor="from" className="block text-xs text-muted-foreground mb-1">
              From
            </label>
            <Input id="from" type="date" className="w-full sm:w-48" />
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="to" className="block text-xs text-muted-foreground mb-1">
              To
            </label>
            <Input id="to" type="date" className="w-full sm:w-48" />
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="category" className="block text-xs text-muted-foreground mb-1">
              Category
            </label>
            <select
              id="category"
              className="h-10 w-full sm:w-56 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>
                All Categories
              </option>
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="status" className="block text-xs text-muted-foreground mb-1">
              Status
            </label>
            <select
              id="status"
              className="h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue=""
            >
              <option value="" disabled>
                All Statuses
              </option>
              <option value="raw">Raw</option>
              <option value="reviewed">Reviewed</option>
              <option value="categorized">Categorized</option>
            </select>
          </div>
          <div className="w-full sm:flex-1">
            <label htmlFor="search" className="block text-xs text-muted-foreground mb-1">
              Search
            </label>
            <Input id="search" type="text" placeholder="Search description…" />
          </div>
        </div>

        {/* Disabled action */}
        <div>
          <Button disabled> Categorize selected </Button>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
