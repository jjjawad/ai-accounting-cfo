"use client";

import { ProtectedRoute } from "@/components/protected-route";
import UploadZone from "@/components/documents/upload-zone";
import DocumentsTable from "@/components/documents/documents-table";
import { useDocuments } from "@/hooks/queries/use-documents";

export default function Page() {
  useDocuments();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <UploadZone />
        <DocumentsTable />
      </div>
    </ProtectedRoute>
  );
}
