import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type SummaryCardProps = {
  title: string;
  value: string;
};

export default function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
