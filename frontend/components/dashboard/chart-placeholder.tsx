export type ChartPlaceholderProps = {
  label: string;
  heightClass?: string;
};

export default function ChartPlaceholder({ label, heightClass = "h-64" }: ChartPlaceholderProps) {
  return (
    <div
      aria-label={label}
      className={`w-full ${heightClass} bg-muted flex items-center justify-center rounded-md text-sm text-muted-foreground`}
    >
      Chart placeholder
    </div>
  );
}
