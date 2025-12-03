import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminCompaniesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Base Currency</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>No. of Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Placeholder LLC</TableCell>
              <TableCell>AED</TableCell>
              <TableCell>2025-01-03</TableCell>
              <TableCell>142</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Demo Company</TableCell>
              <TableCell>USD</TableCell>
              <TableCell>2025-01-01</TableCell>
              <TableCell>87</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sample Trading</TableCell>
              <TableCell>AED</TableCell>
              <TableCell>2024-12-29</TableCell>
              <TableCell>54</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
