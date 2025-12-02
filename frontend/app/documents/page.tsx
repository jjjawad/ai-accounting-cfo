import { ProtectedRoute } from "@/components/protected-route";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>Documents Page</div>
    </ProtectedRoute>
  );
}
