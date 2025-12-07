import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Accounting Backend",
  description: "Backend API project for AI Accounting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
