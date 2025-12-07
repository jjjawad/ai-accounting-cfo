import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DocumentStatus, DocumentType } from "@/lib/api/documents";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type DocumentRow = {
  id: string;
  name: string;
  type: DocumentType;
  uploadedAt: string;
  vendor?: string | null;
  status: DocumentStatus;
};

type DocumentsTableProps = {
  documents: DocumentRow[];
  onStatusChange?: (id: string, status: DocumentStatus) => void;
};

function StatusBadge({ status }: { status: DocumentStatus }) {
  const labelMap: Record<DocumentStatus, string> = {
    uploaded: "Uploaded",
    processing: "Processing",
    processed: "Processed",
    needs_review: "Needs review",
    error: "Error",
  };

  const colorMap: Record<DocumentStatus, string> = {
    uploaded: "bg-gray-100 text-gray-800 border border-gray-200",
    processing: "bg-blue-50 text-blue-700 border border-blue-200",
    processed: "bg-green-50 text-green-700 border border-green-200",
    needs_review: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${colorMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}

function TypeLabel({ type }: { type: DocumentType }) {
  const labelMap: Record<DocumentType, string> = {
    bank_statement: "Bank Statement",
    invoice: "Invoice",
    receipt: "Receipt",
    pdc: "PDC",
    other: "Other",
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span>{labelMap[type]}</span>
    </span>
  );
}

export default function DocumentsTable({ documents, onStatusChange }: DocumentsTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleReprocess = async (id: string) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/files/${id}/process`, { method: "POST" });
      if (!res.ok) {
        throw new Error(`Failed to reprocess file ${id}`);
      }
      onStatusChange?.(id, "processing");
    } catch (error) {
      console.error("Failed to reprocess file", id, error);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No documents uploaded yet.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <TypeLabel type={doc.type} />
                  </TableCell>
                  <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{doc.vendor ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {(doc.status === "uploaded" || doc.status === "error") && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pendingId === doc.id}
                        onClick={() => handleReprocess(doc.id)}
                      >
                        {pendingId === doc.id ? "Reprocessing..." : "Reprocess"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
