"use client";

import { useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionsTable from "@/components/transactions/table";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { useMockTransactions } from "@/hooks/use-mock-transactions";
import type { MockBankTransaction } from "@/lib/mocks";

type CategoryFilter = "" | "revenue" | "expense" | "transfer" | "other";
type StatusFilter = "" | "raw" | "reviewed" | "categorized";

export default function Page() {
  useTransactions();
  const { data: transactions } = useMockTransactions();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("");
  const [status, setStatus] = useState<StatusFilter>("");

  const filtered = useMemo<MockBankTransaction[]>(() => {
    const mapStatus = (value: StatusFilter) => {
      if (value === "reviewed") return "reconciled";
      return value;
    };

    return transactions.filter((tx) => {
      if (fromDate && tx.date < fromDate) return false;
      if (toDate && tx.date > toDate) return false;

      if (category) {
        if (category === "revenue" && tx.amount <= 0) return false;
        if (category === "expense" && tx.amount >= 0) return false;
        if (category === "transfer" && tx.amount !== 0) return false;
        if (category === "other" && tx.category_id) return false;
      }

      if (status) {
        const target = mapStatus(status);
        if (target && tx.status !== target) return false;
      }

      return true;
    });
  }, [category, fromDate, toDate, status, transactions]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <label htmlFor="from" className="block text-xs text-muted-foreground mb-1">
              From
            </label>
            <Input
              id="from"
              type="date"
              className="w-full sm:w-48"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="to" className="block text-xs text-muted-foreground mb-1">
              To
            </label>
            <Input
              id="to"
              type="date"
              className="w-full sm:w-48"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <label htmlFor="category" className="block text-xs text-muted-foreground mb-1">
              Category
            </label>
            <select
              id="category"
              className="h-10 w-full sm:w-56 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
            >
              <option value="">All Categories</option>
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
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
            >
              <option value="">All Statuses</option>
              <option value="raw">Raw</option>
              <option value="reviewed">Reviewed</option>
              <option value="categorized">Categorized</option>
            </select>
          </div>
          <div className="w-full sm:flex-1">
            <label htmlFor="search" className="block text-xs text-muted-foreground mb-1">
              Search
            </label>
            <Input id="search" type="text" placeholder="Search description…" disabled />
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
            <TransactionsTable transactions={filtered} />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
