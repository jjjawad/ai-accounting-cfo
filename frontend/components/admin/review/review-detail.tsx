import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReviewDetail({
  type = "Transaction",
}: {
  type?: "Transaction" | "Document";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {type === "Transaction" ? (
          <>
            <p>
              <strong>Date:</strong> 2025-01-02
            </p>
            <p>
              <strong>Description:</strong> Placeholder transaction description
            </p>
            <p>
              <strong>Amount:</strong> AED —
            </p>
            <p>
              <strong>Suggested Category:</strong> Marketing (AI guess)
            </p>
            <p>
              <strong>Suggested VAT:</strong> STANDARD 5%
            </p>
            <p>
              <strong>Confidence:</strong> 0.42
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Date:</strong> 2025-01-03
            </p>
            <p>
              <strong>Type:</strong> Invoice (guessed)
            </p>
            <p>
              <strong>Vendor Guess:</strong> Placeholder Vendor
            </p>
            <p>
              <strong>Suggested Category:</strong> Utilities (AI guess)
            </p>
            <p>
              <strong>Confidence:</strong> 0.55
            </p>
          </>
        )}
      </CardContent>
      <CardFooter className="space-x-2">
        <Button disabled>Accept</Button>
        <Button disabled variant="secondary">
          Override
        </Button>
      </CardFooter>
    </Card>
  );
}
