import SectionCard from "@/components/settings/section-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AccountingSettingsForm() {
  return (
    <SectionCard
      title="Accounting Settings"
      footer={<Button disabled>Save Accounting Settings</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Default VAT Behavior</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Rated (5%)</SelectItem>
              <SelectItem value="zero">Zero Rated</SelectItem>
              <SelectItem value="exempt">Exempt</SelectItem>
              <SelectItem value="auto">Auto-detect</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">COA Customization</label>
          <Input placeholder="Enabled via backend" disabled />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Switch disabled />
        <span className="text-sm">Enable Suggested Categories</span>
      </div>
    </SectionCard>
  );
}
