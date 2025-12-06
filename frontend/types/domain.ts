export type JournalSourceType = 'bank_tx' | 'invoice' | 'pdc' | 'manual';

export interface JournalEntry {
  id: string;
  company_id: string;
  date: string;
  description: string;
  source_type: JournalSourceType;
  source_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalLine {
  id: string;
  journal_entry_id: string;
  account_code: string;
  debit: number;
  credit: number;
  vat_code_id: string | null;
  created_at: string;
  updated_at: string;
}

export type { File, FileStatus, FileType } from './file';
