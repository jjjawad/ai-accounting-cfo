import { ProtectedRoute } from "@/components/protected-route";
import ReviewTabs from "@/components/admin/review/review-tabs";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Review Queue</h1>
        </div>

        <ReviewTabs />
      </div>
    </ProtectedRoute>
  );
}
