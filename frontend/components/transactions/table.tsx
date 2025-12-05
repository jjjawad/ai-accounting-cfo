"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MockBankTransaction } from "@/lib/mocks";
import { useMockTransactions } from "@/hooks/use-mock-transactions";

type Props = {
  transactions?: MockBankTransaction[];
};

export default function TransactionsTable({ transactions: override }: Props) {
  const { data: mockData } = useMockTransactions();
  const transactions = override ?? mockData;

  if (!transactions.length) {
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
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No transactions match this filter. Upload a statement to see data later.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
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
