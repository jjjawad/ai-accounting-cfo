// frontend/app/api/companies/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Simple mock companies for now
  const companies = [
    { id: "company_1", name: "Demo Company 1" },
    { id: "company_2", name: "Demo Company 2" },
  ];

  return NextResponse.json(companies);
}
