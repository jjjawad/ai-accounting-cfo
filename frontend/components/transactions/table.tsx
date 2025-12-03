"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMockTransactions } from "@/hooks/use-mock-transactions";

export default function TransactionsTable() {
  const { data: transactions } = useMockTransactions();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>VAT</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>{tx.date}</TableCell>
            <TableCell>{tx.description_raw}</TableCell>
            <TableCell className={tx.amount < 0 ? "text-red-600" : "text-green-600"}>
              {tx.amount < 0
                ? `- AED ${Math.abs(tx.amount).toLocaleString()}`
                : `AED ${tx.amount.toLocaleString()}`}
            </TableCell>
            <TableCell>{tx.category_id ?? "—"}</TableCell>
            <TableCell>{tx.vat_code_id ?? "—"}</TableCell>
            <TableCell>{tx.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
