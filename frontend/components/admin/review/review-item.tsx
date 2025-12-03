export default function ReviewItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border rounded-md p-3 cursor-pointer hover:bg-muted">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
