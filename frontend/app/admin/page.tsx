import { ProtectedRoute } from "@/components/protected-route";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>Admin Home</div>
    </ProtectedRoute>
  );
}
