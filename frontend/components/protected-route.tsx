"use client";

import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Mocked auth: always allow rendering during Steps 5–6.
export function ProtectedRoute({ children }: Props) {
  return <>{children}</>;
}
