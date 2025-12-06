export type DocumentType = "bank_statement" | "invoice" | "receipt" | "pdc" | "other";
export type DocumentStatus = "uploaded" | "processing" | "processed" | "error";

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

  const res = await fetch("/api/files/upload", {
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
