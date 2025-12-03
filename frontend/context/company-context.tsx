"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useCompaniesQuery } from "@/hooks/queries/use-companies-query";

type CompanyContextValue = {
  companyId: string | null;
  setCompanyId: (id: string | null) => void;
};

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companyId, setCompanyId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("companyId");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (companyId) {
        localStorage.setItem("companyId", companyId);
      } else {
        localStorage.removeItem("companyId");
      }
    } catch {
      // ignore localStorage errors
    }
  }, [companyId]);

  // Auto-select first company from server if none is selected and nothing persisted
  const { data } = useCompaniesQuery();

  useEffect(() => {
    try {
      if (companyId) return;
      if (!data || data.length === 0) return;

      const stored = localStorage.getItem("companyId");
      if (!stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompanyId(data[0].id);
      }
    } catch {
      // ignore errors
    }
  }, [data, companyId]);

  return (
    <CompanyContext.Provider value={{ companyId, setCompanyId }}>{children}</CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
