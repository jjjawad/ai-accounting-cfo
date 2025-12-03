import { ProtectedRoute } from "@/components/protected-route";
import AdminCompaniesTable from "@/components/admin/companies-table";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Admin — Companies</h1>
          <p className="text-muted-foreground">Total companies: X (placeholder)</p>
        </div>

        <AdminCompaniesTable />
      </div>
    </ProtectedRoute>
  );
}
