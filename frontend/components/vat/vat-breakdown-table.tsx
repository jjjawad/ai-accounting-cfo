import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MockVatBreakdownItem } from "@/lib/mocks";

export default function VatBreakdownTable({ breakdown }: { breakdown: MockVatBreakdownItem[] }) {
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
            {breakdown.map((item) => (
              <TableRow key={item.vat_code}>
                <TableCell>{item.vat_code}</TableCell>
                <TableCell>{vatDescriptions[item.vat_code] ?? "—"}</TableCell>
                <TableCell>AED {item.output_vat.toLocaleString()}</TableCell>
                <TableCell>AED {item.input_vat.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const vatDescriptions: Record<string, string> = {
  STANDARD_5: "Standard Rated (5%)",
  ZERO: "Zero Rated",
  EXEMPT: "Exempt",
};
