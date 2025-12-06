"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

type UploadZoneProps = {
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
};

export default function UploadZone({ onFilesSelected, disabled }: UploadZoneProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (disabled) return;
    fileRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFilesSelected?.(Array.from(files));
  };

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
          aria-disabled={disabled}
          onDrop={(event) => {
            event.preventDefault();
            if (disabled) return;
            handleFiles(event.dataTransfer.files);
          }}
          onDragOver={(event) => {
            if (disabled) return;
            event.preventDefault();
          }}
        >
          {/* Optional icon omitted to avoid extra dependency */}
          <p className="text-lg font-medium">{disabled ? "Uploading..." : "Upload Documents"}</p>
          <p className="mt-1 text-sm text-muted-foreground max-w-[52ch]">
            Drag and drop bank statements, invoices or receipts here, or click to browse.
          </p>
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
