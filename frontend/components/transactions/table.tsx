import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TransactionsTable() {
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
          <TableCell>2025-01-01</TableCell>
          <TableCell>Sample transaction</TableCell>
          <TableCell>AED —</TableCell>
          <TableCell>—</TableCell>
          <TableCell>—</TableCell>
          <TableCell>Raw</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2025-01-05</TableCell>
          <TableCell>Another sample transaction</TableCell>
          <TableCell>AED —</TableCell>
          <TableCell>—</TableCell>
          <TableCell>—</TableCell>
          <TableCell>Raw</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
