"use client";

import { ProtectedRoute } from "@/components/protected-route";
import UploadZone from "@/components/documents/upload-zone";
import DocumentsTable, { type DocumentRow } from "@/components/documents/documents-table";
import { useState } from "react";
import { useCompany } from "@/context/company-context";
import { uploadDocument } from "@/lib/api/documents";
import { useDocuments } from "@/hooks/queries/use-documents";

export default function Page() {
  useDocuments();
  const { companyId } = useCompany();
  const [documents, setDocuments] = useState<DocumentRow[]>([
    {
      id: "doc-1",
      name: "January Invoice.pdf",
      type: "invoice",
      uploadedAt: "2025-01-01T00:00:00.000Z",
      vendor: "Placeholder Vendor",
      status: "processed",
    },
    {
      id: "doc-2",
      name: "Coffee Receipt.jpg",
      type: "receipt",
      uploadedAt: "2025-01-03T00:00:00.000Z",
      vendor: "Placeholder Vendor",
      status: "uploaded",
    },
    {
      id: "doc-3",
      name: "Bank Statement.pdf",
      type: "bank_statement",
      uploadedAt: "2025-01-06T00:00:00.000Z",
      vendor: "Placeholder Bank",
      status: "processing",
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    if (!companyId) {
      console.warn("No company selected; cannot upload documents.");
      return;
    }

    setIsUploading(true);

    for (const file of files) {
      try {
        const { fileId, status } = await uploadDocument({
          file,
          companyId,
        });

        const newDoc: DocumentRow = {
          id: fileId,
          name: file.name,
          type: "other",
          uploadedAt: new Date().toISOString(),
          vendor: null,
          status,
        };

        setDocuments((prev) => [newDoc, ...prev]);
      } catch (error) {
        console.error("Failed to upload document", error);
      }
    }

    setIsUploading(false);
  };

  const handleStatusChange = (id: string, status: DocumentRow["status"]) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status } : doc)));
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <UploadZone onFilesSelected={handleFilesSelected} disabled={isUploading} />
        <DocumentsTable documents={documents} onStatusChange={handleStatusChange} />
      </div>
    </ProtectedRoute>
  );
}
