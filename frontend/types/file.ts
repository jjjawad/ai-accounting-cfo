export type FileType = 'bank_statement' | 'invoice' | 'receipt' | 'pdc' | 'other';

export type FileStatus = 'uploaded' | 'processing' | 'processed' | 'error';

export interface File {
  id: string;
  company_id: string;
  storage_path: string;
  type: FileType;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  ocr_text: string | null;
  status: FileStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  // Optional FK fields (e.g., source_file_id) can be added here if introduced in the Supabase schema.
}
