import { ProtectedRoute } from "@/components/protected-route";
import ReviewTabs from "@/components/admin/review/review-tabs";
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Admin Review Queue</h1>
          </div>

          <ReviewTabs />
        </div>
      )}
    </ProtectedRoute>
  );
}
