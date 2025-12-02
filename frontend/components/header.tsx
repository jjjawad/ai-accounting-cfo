import { CompanySwitcher } from "@/components/company-switcher";
import { UserMenu } from "@/components/user-menu";

export function Header() {
  return (
    <header className="h-14 bg-white border-b px-4 flex items-center justify-between">
      <CompanySwitcher />
      <UserMenu />
    </header>
  );
}
