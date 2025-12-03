import { NextResponse } from "next/server";
import { CompaniesSchema } from "@/lib/validation/company-schema";

export async function GET() {
  const MOCK_COMPANIES = [
    { id: "company_1", name: "Company 1" },
    { id: "company_2", name: "Company 2" },
  ];

  const result = CompaniesSchema.safeParse(MOCK_COMPANIES);

  if (!result.success) {
    console.error("Invalid companies response:", result.error);
    return NextResponse.json({ error: "Invalid data" }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
