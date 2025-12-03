import { ProtectedRoute } from "@/components/protected-route";
import UploadZone from "@/components/documents/upload-zone";
import DocumentsTable from "@/components/documents/documents-table";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <UploadZone />
        <DocumentsTable />
      </div>
    </ProtectedRoute>
  );
}
