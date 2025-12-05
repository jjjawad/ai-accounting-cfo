"use client";

import { ProtectedRoute } from "@/components/protected-route";
import AdminCompaniesTable from "@/components/admin/companies-table";
import { useAdmin } from "@/hooks/queries/use-admin";

export default function Page() {
  // Placeholder admin role flag; set to true to simulate admin access.
  const isAdmin = false;
  useAdmin();

  return (
    <ProtectedRoute>
      {!isAdmin ? (
        <div className="p-6 text-red-600 font-semibold">Access Denied.</div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Admin — Companies</h1>
            <p className="text-muted-foreground">Total companies: X (placeholder)</p>
          </div>

          <AdminCompaniesTable />
        </div>
      )}
    </ProtectedRoute>
  );
}
