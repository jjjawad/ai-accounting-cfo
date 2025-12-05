import type { QueryFunction } from "@tanstack/react-query";

export const fetchDashboard: QueryFunction<any, any> = async () => {
  return Promise.resolve({ ok: true, source: "dashboard placeholder" });
};

export const fetchTransactions: QueryFunction<any, any> = async ({ signal }) => {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return Promise.resolve({ ok: true, source: "transactions placeholder" });
};

export const fetchDocuments: QueryFunction<any, any> = async ({ signal }) => {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return Promise.resolve({ ok: true, source: "documents placeholder" });
};

export const fetchVat: QueryFunction<any, any> = async ({ signal }) => {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return Promise.resolve({ ok: true, source: "vat placeholder" });
};

export const fetchCashflow: QueryFunction<any, any> = async ({ signal }) => {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return Promise.resolve({ ok: true, source: "cashflow placeholder" });
};

export const fetchChat: QueryFunction<any, any> = async ({ signal }) => {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return Promise.resolve({ ok: true, source: "chat placeholder" });
};

export const fetchAdmin: QueryFunction<any, any> = async ({ signal }) => {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return Promise.resolve({ ok: true, source: "admin placeholder" });
};
