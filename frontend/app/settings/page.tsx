import { ProtectedRoute } from "@/components/protected-route";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>Settings Page</div>
    </ProtectedRoute>
  );
}
