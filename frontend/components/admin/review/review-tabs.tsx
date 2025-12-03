import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewItem from "@/components/admin/review/review-item";
import ReviewDetail from "@/components/admin/review/review-detail";

export default function ReviewTabs() {
  return (
    <Tabs defaultValue="transactions">
      <TabsList>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
      <TabsContent value="transactions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="md:col-span-1 space-y-3 overflow-y-auto max-h-[70vh] pr-2">
            <ReviewItem title="2025-01-02 — Placeholder Vendor" subtitle="Confidence: 0.42 • AED —" />
            <ReviewItem title="2025-01-03 — Another Vendor" subtitle="Confidence: 0.61 • AED —" />
            <ReviewItem title="2025-01-04 — Third Vendor" subtitle="Confidence: 0.28 • AED —" />
          </div>
          <div className="md:col-span-2">
            <ReviewDetail type="Transaction" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="documents">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="md:col-span-1 space-y-3 overflow-y-auto max-h-[70vh] pr-2">
            <ReviewItem title="2025-01-03 — Invoice" subtitle="Vendor guess: Placeholder Vendor • Conf: 0.55" />
            <ReviewItem title="2025-01-05 — Receipt" subtitle="Vendor guess: Demo Store • Conf: 0.47" />
            <ReviewItem title="2025-01-06 — Bank Statement" subtitle="Pages: 3 • Conf: 0.72" />
          </div>
          <div className="md:col-span-2">
            <ReviewDetail type="Document" />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
