import SectionCard from "@/components/settings/section-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CompanyInfoForm() {
  return (
    <SectionCard
      title="Company Info"
      footer={<Button disabled>Save Changes</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Company Name</label>
          <Input placeholder="Enter company name" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">VAT Number</label>
          <Input placeholder="Enter VAT number" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Fiscal Year Start</label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Base Currency</label>
          <Input placeholder="AED" disabled />
        </div>
      </div>
    </SectionCard>
  );
}
