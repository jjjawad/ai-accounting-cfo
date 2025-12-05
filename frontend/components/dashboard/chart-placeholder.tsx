"use client";

import { useMockIncomeExpense } from "@/hooks/use-mock-income-expense";
import { useMockCashflow } from "@/hooks/use-mock-cashflow";

export type ChartPlaceholderProps = {
  label: string;
  heightClass?: string;
};

export default function ChartPlaceholder({ label, heightClass = "h-64" }: ChartPlaceholderProps) {
  const { data } = useMockIncomeExpense();
  const { data: cashflow } = useMockCashflow();

  const width = 600;
  const height = 200;
  const padding = { top: 10, right: 16, bottom: 24, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  if (label === "Income vs Expenses") {
    if (!data.length) {
      return (
        <div
          aria-label={label}
          className={`w-full ${heightClass} bg-muted flex items-center justify-center rounded-md text-sm text-muted-foreground`}
        >
          No income/expense data
        </div>
      );
    }

    const n = data.length;
    const values = data.flatMap((d) => [d.income, d.expenses]);
    const maxY = Math.max(...values, 0);
    const minY = 0;
    const scaleX = (i: number) => (n <= 1 ? padding.left : padding.left + (i * innerW) / (n - 1));
    const scaleY = (v: number) => padding.top + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

    const toPath = (key: "income" | "expenses") =>
      data
        .map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(d[key])}`)
        .join(" ");

    const ticks = 4;
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) => Math.round((i * maxY) / ticks));

    return (
      <div className={`w-full ${heightClass} rounded-md bg-white/0`} aria-label={label}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="Income vs Expenses chart">
          <desc>Simple inline chart rendering income and expenses over time.</desc>
          {/* Axes */}
          <g stroke="#e5e7eb">
            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} />
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} />
            {yTicks.map((t, i) => {
              const y = scaleY(t);
              return <line key={`g-${i}`} x1={padding.left} y1={y} x2={width - padding.right} y2={y} strokeOpacity={0.2} />;
            })}
          </g>
          {/* Y tick labels */}
          <g fill="#6b7280" fontSize="10" textAnchor="end">
            {yTicks.map((t, i) => (
              <text key={`yt-${i}`} x={padding.left - 6} y={scaleY(t) + 3}>{`AED ${t.toLocaleString()}`}</text>
            ))}
          </g>
          {/* X labels */}
          <g fill="#6b7280" fontSize="10" textAnchor="middle">
            {data.map((d, i) => (
              <text key={`xt-${i}`} x={scaleX(i)} y={height - padding.bottom + 14}>
                {d.periodLabel}
              </text>
            ))}
          </g>
          {/* Lines */}
          <path d={toPath("income")} fill="none" stroke="#10b981" strokeWidth={2} />
          <path d={toPath("expenses")} fill="none" stroke="#ef4444" strokeWidth={2} />
          {/* Dots */}
          {data.map((d, i) => (
            <circle key={`inc-${i}`} cx={scaleX(i)} cy={scaleY(d.income)} r={2.5} fill="#10b981" />
          ))}
          {data.map((d, i) => (
            <circle key={`exp-${i}`} cx={scaleX(i)} cy={scaleY(d.expenses)} r={2.5} fill="#ef4444" />
          ))}
        </svg>
      </div>
    );
  }

  if (label === "Cashflow Over Time") {
    const series = cashflow.series;
    if (!series.length) {
      return (
        <div
          aria-label={label}
          className={`w-full ${heightClass} bg-muted flex items-center justify-center rounded-md text-sm text-muted-foreground`}
        >
          No cashflow data
        </div>
      );
    }

    const n = series.length;
    const values = series.map((d) => d.projected_balance);
    const maxY = Math.max(...values, 0);
    const minY = Math.min(...values, 0);
    const scaleX = (i: number) => (n <= 1 ? padding.left : padding.left + (i * innerW) / (n - 1));
    const scaleY = (v: number) => padding.top + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

    const pathD = series.map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(d.projected_balance)}`).join(" ");
    const ticks = 4;
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
      Math.round(minY + ((maxY - minY) * i) / ticks)
    );

    return (
      <div className={`w-full ${heightClass} rounded-md bg-white/0`} aria-label={label}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="Cashflow forecast chart">
          <desc>Simple inline chart rendering projected cash balance over time.</desc>
          <g stroke="#e5e7eb">
            <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} />
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} />
            {yTicks.map((t, i) => {
              const y = scaleY(t);
              return <line key={`cf-g-${i}`} x1={padding.left} y1={y} x2={width - padding.right} y2={y} strokeOpacity={0.2} />;
            })}
          </g>
          <g fill="#6b7280" fontSize="10" textAnchor="end">
            {yTicks.map((t, i) => (
              <text key={`cf-yt-${i}`} x={padding.left - 6} y={scaleY(t) + 3}>{`AED ${t.toLocaleString()}`}</text>
            ))}
          </g>
          <g fill="#6b7280" fontSize="10" textAnchor="middle">
            {series.map((d, i) => (
              <text key={`cf-xt-${i}`} x={scaleX(i)} y={height - padding.bottom + 14}>
                {d.date.slice(5)}
              </text>
            ))}
          </g>
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2} />
          {series.map((d, i) => (
            <circle key={`cf-${i}`} cx={scaleX(i)} cy={scaleY(d.projected_balance)} r={2.5} fill="#3b82f6" />
          ))}
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-label={label}
      className={`w-full ${heightClass} bg-muted flex items-center justify-center rounded-md text-sm text-muted-foreground`}
    >
      Chart placeholder
    </div>
  );
}
