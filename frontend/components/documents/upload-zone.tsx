"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadZone() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => fileRef.current?.click();

  return (
    <Card>
      <CardContent className="p-0">
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          className="border-2 border-dashed border-muted-foreground/40 rounded-lg p-10 flex flex-col items-center justify-center hover:border-muted-foreground cursor-pointer transition text-center"
        >
          {/* Optional icon omitted to avoid extra dependency */}
          <p className="text-lg font-medium">Upload Documents</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-[52ch]">
            Drag and drop bank statements, invoices or receipts here, or click to browse.
          </p>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={() => {
              // Intentionally no processing; UI only
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
