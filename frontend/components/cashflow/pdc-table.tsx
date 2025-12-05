import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMockPdc } from "@/hooks/use-mock-pdc";

export default function PdcTable() {
  const { data } = useMockPdc();
  const sorted = [...data].sort((a, b) => a.due_date.localeCompare(b.due_date));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming PDCs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Due Date</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((pdc) => {
              const isScheduled = pdc.status === "scheduled";
              return (
                <TableRow key={pdc.id}>
                  <TableCell>{pdc.due_date}</TableCell>
                  <TableCell>{pdc.party_name}</TableCell>
                  <TableCell className="capitalize">{pdc.type}</TableCell>
                  <TableCell>{`${pdc.currency} ${pdc.amount.toLocaleString()}`}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        isScheduled ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isScheduled ? "Scheduled" : "Cleared"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
