import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { uploadFileToStorage, StorageUploadError } from "../lib/supabase/storage";

function usage(): void {
  console.log("Usage: ts-node scripts/test-upload-file-to-storage.ts <filePath> <companyId> [type]");
}

function inferContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

async function main() {
  const [filePath, companyId, type] = process.argv.slice(2);

  if (!filePath || !companyId) {
    usage();
    process.exit(1);
  }

  const fileBody = fs.readFileSync(filePath);
  const fileId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  const originalName = path.basename(filePath);
  const contentType = inferContentType(filePath);

  try {
    const { storagePath } = await uploadFileToStorage({
      companyId,
      type: type as any,
      fileId,
      originalName,
      contentType,
      fileBody,
    });
    console.log("Uploaded to storage path:", storagePath);
  } catch (error) {
    if (error instanceof StorageUploadError) {
      console.error("Storage upload failed:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    process.exit(1);
  }
}

main();
