export type DocumentType = "bank_statement" | "invoice" | "receipt" | "pdc" | "other";
export type DocumentStatus = "uploaded" | "processing" | "processed" | "needs_review" | "error";

// Read backend URL from env (set in .env.local + Vercel frontend env)
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Small helper to get a clean base URL without trailing slash
function getBackendBaseUrl() {
  if (!BACKEND_BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured for the frontend");
  }
  return BACKEND_BASE_URL.replace(/\/$/, "");
}

export async function uploadDocument(params: {
  file: File;
  companyId: string;
  type?: DocumentType;
}): Promise<{ fileId: string; status: DocumentStatus }> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("company_id", params.companyId);
  if (params.type && params.type !== "other") {
    formData.append("type", params.type);
  }

  const baseUrl = getBackendBaseUrl();

  const res = await fetch(`${baseUrl}/api/files/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => "Failed to upload document");
    throw new Error(message || "Failed to upload document");
  }

  const json = (await res.json()) as { file_id: string; status: DocumentStatus };

  return {
    fileId: json.file_id,
    status: json.status,
  };
}
