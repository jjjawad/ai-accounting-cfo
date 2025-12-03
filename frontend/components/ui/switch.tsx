"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Switch({ className, disabled = false, ...props }: SwitchProps) {
  return (
    <label className={cn("inline-flex items-center gap-2 cursor-pointer", disabled && "cursor-not-allowed opacity-50", className)}>
      <input type="checkbox" className="sr-only" disabled={disabled} {...props} />
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border border-input bg-muted transition-colors",
        )}
      >
        <span className="inline-block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform" />
      </span>
    </label>
  );
}
