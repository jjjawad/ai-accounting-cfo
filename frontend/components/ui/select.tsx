"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Minimal client-side Select to match shadcn API surface used here.
// This is a lightweight visual-only select; no portal usage.

type SelectContextType = {
  value?: string;
  setValue: (v?: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SelectContext = React.createContext<SelectContextType | null>(null);

export function Select({ defaultValue, children }: { defaultValue?: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState<string | undefined>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const ctx = React.useMemo(() => ({ value, setValue, open, setOpen }), [value, open]);
  React.useEffect(() => {
    const onDoc = () => setOpen(false);
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);
  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

export function SelectTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used within Select");
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        ctx.setOpen(!ctx.open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) return null;
  return <span className="truncate text-left text-sm">{ctx.value ?? placeholder ?? "Select"}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent must be used within Select");
  if (!ctx.open) return null;
  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="absolute z-50 mt-2 w-full rounded-md border bg-white p-1 shadow-md">
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used within Select");
  return (
    <button
      type="button"
      className="w-full cursor-pointer select-none rounded-sm px-2 py-2 text-left text-sm hover:bg-gray-100"
      onClick={(e) => {
        e.stopPropagation();
        ctx.setValue(value);
        ctx.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}
