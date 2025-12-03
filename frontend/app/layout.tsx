import type { Metadata } from "next";
import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { CompanyProvider } from "@/components/company-provider";
import { AppQueryClientProvider } from "@/components/query-client-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Accounting Platform",
  description: "Automated bookkeeping and CFO insights",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AppQueryClientProvider>
          <CompanyProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">
                <Header />
                <div className="p-4">{children}</div>
              </main>
            </div>
          </CompanyProvider>
        </AppQueryClientProvider>
      </body>
    </html>
  );
}
