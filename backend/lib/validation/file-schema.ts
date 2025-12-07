import { z } from "zod";
import type { FileStatus, FileType } from "../../../frontend/types/file";

export const FileTypeEnum = z.enum([
  "bank_statement",
  "invoice",
  "receipt",
  "pdc",
  "other",
] satisfies readonly FileType[]);

export const FileStatusEnum = z.enum([
  "uploaded",
  "processing",
  "processed",
  "needs_review",
  "error",
] satisfies readonly FileStatus[]);

export const FileSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  storage_path: z.string(),
  type: FileTypeEnum,
  original_name: z.string(),
  mime_type: z.string(),
  size_bytes: z.number(),
  ocr_text: z.string().nullable(),
  status: FileStatusEnum,
  error_message: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const FileUploadRequestSchema = z.object({
  company_id: z.string().min(1, "company_id is required"),
  type: FileTypeEnum.optional(),
});

export const FileUploadFileGuard = z.custom<unknown>(
  (value) => value !== null && value !== undefined,
  { message: "file is required" }
);

export type File = z.infer<typeof FileSchema>;
