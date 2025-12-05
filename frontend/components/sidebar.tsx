"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const mainItems: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Transactions", href: "/transactions" },
    { label: "Documents", href: "/documents" },
    { label: "VAT", href: "/vat" },
    { label: "Cashflow", href: "/cashflow" },
    { label: "Chat", href: "/chat" },
    { label: "Settings", href: "/settings" },
  ];

  const adminItems: { label: string; href: string }[] = [{ label: "Admin", href: "/admin" }];

  return (
    <aside className="w-60 border-r bg-white min-h-screen px-4 py-6">
      <nav className="space-y-4">
        <div className="space-y-1">
          {mainItems.map(({ label, href }) => {
            const isActive = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block px-2 py-2 rounded-md text-gray-700 font-medium",
                  isActive && "bg-gray-100 font-semibold"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1 border-t pt-4">
          <div className="px-2 text-xs uppercase tracking-wide text-gray-500">Admin</div>
          {adminItems.map(({ label, href }) => {
            const isActive = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block px-2 py-2 rounded-md text-gray-700 font-medium",
                  isActive && "bg-gray-100 font-semibold"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
