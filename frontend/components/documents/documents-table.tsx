import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DocumentsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell>2025-01-01</TableCell>
              <TableCell>Placeholder Vendor</TableCell>
              <TableCell>Processed</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Receipt</TableCell>
              <TableCell>2025-01-03</TableCell>
              <TableCell>Placeholder Vendor</TableCell>
              <TableCell>Uploaded</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bank Statement</TableCell>
              <TableCell>2025-01-06</TableCell>
              <TableCell>Placeholder Bank</TableCell>
              <TableCell>Processing</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
