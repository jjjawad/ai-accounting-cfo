import { getSupabaseServerClient } from "./server-client";
import type { FileType } from "../../../frontend/types/file";

const DOCUMENTS_BUCKET = "documents";

function sanitizeFilename(originalName: string): string {
  return originalName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-");
}

export function buildStoragePath(params: {
  companyId: string;
  type?: FileType;
  fileId: string;
  originalName: string;
}): string {
  const safeName = sanitizeFilename(params.originalName);
  const folderType = params.type ?? "other";
  return `${params.companyId}/${folderType}/${params.fileId}-${safeName}`;
}

export class StorageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageUploadError";
  }
}

export async function uploadFileToStorage(params: {
  companyId: string;
  type?: FileType;
  fileId: string;
  originalName: string;
  contentType: string;
  fileBody: ArrayBuffer | Uint8Array | Blob | Buffer;
}): Promise<{ storagePath: string }> {
  const supabase = getSupabaseServerClient();

  const storagePath = buildStoragePath({
    companyId: params.companyId,
    type: params.type,
    fileId: params.fileId,
    originalName: params.originalName,
  });

  const { error } = await supabase.storage.from(DOCUMENTS_BUCKET).upload(storagePath, params.fileBody, {
    contentType: params.contentType,
    upsert: false,
  });

  if (error) {
    throw new StorageUploadError(error.message);
  }

  return { storagePath };
}

export { DOCUMENTS_BUCKET, sanitizeFilename };
