"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type DropdownContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <DropdownContext.Provider value={value}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactElement<{ onClick?: React.MouseEventHandler }>
}) {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  const { setOpen, open } = ctx;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        handleClick(e);
      },
    });
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
}

export function DropdownMenuContent({
  children,
  align = "start",
}: {
  children: React.ReactNode;
  align?: "start" | "end";
}) {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownMenuContent must be used within DropdownMenu");
  const { open } = ctx;

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 w-48 rounded-md border bg-white p-1 shadow-md",
        align === "end" ? "right-0" : "left-0"
      )}
      role="menu"
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownMenuItem must be used within DropdownMenu");
  const { setOpen } = ctx;

  return (
    <button
      type="button"
      onClick={() => {
        onSelect?.();
        setOpen(false);
      }}
      className="w-full cursor-pointer select-none rounded-sm px-2 py-2 text-left text-sm hover:bg-gray-100"
      role="menuitem"
    >
      {children}
    </button>
  );
}
