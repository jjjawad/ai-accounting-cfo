"use client";

export default function SuggestionChips({ items }: { items: string[] }) {
  return (
    <div className="flex gap-2 flex-wrap my-4">
      {items.map((label, idx) => (
        <div
          key={idx}
          className="px-3 py-1 bg-muted rounded-full text-sm cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") e.preventDefault();
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
