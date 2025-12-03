import { ProtectedRoute } from "@/components/protected-route";
import CompanyInfoForm from "@/components/settings/company-info-form";
import AccountingSettingsForm from "@/components/settings/accounting-settings-form";
import InvitationsForm from "@/components/settings/invitations-form";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <CompanyInfoForm />
        <AccountingSettingsForm />
        <InvitationsForm />
      </div>
    </ProtectedRoute>
  );
}
