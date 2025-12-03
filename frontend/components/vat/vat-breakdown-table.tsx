import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VatBreakdownTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>VAT Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>VAT Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Output VAT</TableHead>
              <TableHead>Input VAT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>STANDARD_5</TableCell>
              <TableCell>Standard Rated (5%)</TableCell>
              <TableCell>AED —</TableCell>
              <TableCell>AED —</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ZERO</TableCell>
              <TableCell>Zero Rated</TableCell>
              <TableCell>AED —</TableCell>
              <TableCell>AED —</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>EXEMPT</TableCell>
              <TableCell>Exempt</TableCell>
              <TableCell>AED —</TableCell>
              <TableCell>AED —</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
