"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  // Placeholder session until Supabase is wired in Step 5+
  const session = null as unknown as null | { userId: string };

  if (!session) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Not logged in.
      </div>
    );
  }

  return <>{children}</>;
}
