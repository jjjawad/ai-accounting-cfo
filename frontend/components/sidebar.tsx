"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const items: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Transactions", href: "/transactions" },
    { label: "Documents", href: "/documents" },
    { label: "VAT", href: "/vat" },
    { label: "Cashflow", href: "/cashflow" },
    { label: "Chat", href: "/chat" },
    { label: "Settings", href: "/settings" },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <aside className="w-60 border-r bg-white min-h-screen px-4 py-6">
      <nav className="space-y-4">
        {items.map(({ label, href }) => {
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
      </nav>
    </aside>
  );
}
