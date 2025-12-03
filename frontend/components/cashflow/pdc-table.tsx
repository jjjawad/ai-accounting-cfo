import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PdcTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming PDCs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-01-15</TableCell>
              <TableCell>Sample Vendor</TableCell>
              <TableCell>AED —</TableCell>
              <TableCell>Scheduled</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-28</TableCell>
              <TableCell>Placeholder Client</TableCell>
              <TableCell>AED —</TableCell>
              <TableCell>Pending</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
