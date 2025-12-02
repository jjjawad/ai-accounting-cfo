import { ProtectedRoute } from "@/components/protected-route";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>Cashflow Page</div>
    </ProtectedRoute>
  );
}
