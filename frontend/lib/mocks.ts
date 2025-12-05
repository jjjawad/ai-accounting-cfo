// Centralized front-end-only mock data for Step 6.1
// Local interfaces only; do not export to shared /types.

export interface MockOverviewMetrics {
  cash_balance: number;
  income_this_month: number;
  expenses_this_month: number;
  net_result_this_month: number;
  vat_due_current_period: number;
  runway_days: number;
}

export interface MockIncomeExpensePoint {
  periodLabel: string;
  income: number;
  expenses: number;
}

export type MockTransactionStatus = "raw" | "categorized" | "reconciled";

export interface MockBankTransaction {
  id: string;
  company_id: string;
  bank_account_id: string;
  date: string; // ISO YYYY-MM-DD
  description_raw: string;
  amount: number; // positive = inflow, negative = outflow
  currency: string; // e.g., "AED"
  status: MockTransactionStatus;
  category_id: string | null;
  vat_code_id: string | null;
  vendor_id: string | null;
  confidence_score?: number;
}

export interface MockVatBreakdownItem {
  vat_code: string; // e.g., STANDARD_5 | ZERO | EXEMPT
  output_vat: number;
  input_vat: number;
}

export interface MockVatSummary {
  period_start: string; // ISO date
  period_end: string; // ISO date
  total_output_vat: number;
  total_input_vat: number;
  net_vat_due: number; // output - input
  breakdown: MockVatBreakdownItem[];
}

export type MockPdcType = "issued" | "received";
export type MockPdcStatus = "scheduled" | "cleared";

export interface MockPdcItem {
  id: string;
  company_id: string;
  bank_account_id: string;
  cheque_number: string;
  party_name: string;
  amount: number;
  currency: string; // AED
  issue_date: string; // ISO
  due_date: string; // ISO
  type: MockPdcType;
  status: MockPdcStatus;
  linked_transaction_id: string | null;
}

export interface MockCashflowPoint {
  date: string; // ISO
  projected_balance: number;
}

export interface MockCashflowForecast {
  as_of_date: string; // ISO
  projected_days: number;
  series: MockCashflowPoint[];
  burn_rate_monthly: number;
  runway_days: number;
  assumptions: Record<string, unknown>;
}

export type MockChatRole = "user" | "assistant";

export interface MockChatMessage {
  id: string;
  company_id: string;
  user_id: string | null;
  role: MockChatRole;
  content: string;
  created_at: string; // ISO timestamp
  metadata?: Record<string, unknown>;
}

export const mockOverviewMetrics: MockOverviewMetrics = {
  cash_balance: 185_250,
  income_this_month: 92_800,
  expenses_this_month: 64_300,
  net_result_this_month: 28_500,
  vat_due_current_period: 9_300,
  runway_days: 75,
};

export const mockIncomeExpenseSeries: MockIncomeExpensePoint[] = [
  { periodLabel: "Jul", income: 78_500, expenses: 55_200 },
  { periodLabel: "Aug", income: 81_900, expenses: 57_450 },
  { periodLabel: "Sep", income: 88_250, expenses: 60_800 },
  { periodLabel: "Oct", income: 95_100, expenses: 63_900 },
  { periodLabel: "Nov", income: 97_400, expenses: 66_200 },
  { periodLabel: "Dec", income: 92_800, expenses: 64_300 },
];

export const mockTransactions: MockBankTransaction[] = [
  {
    id: "txn_001",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-11-28",
    description_raw: "Wio POS deposit",
    amount: 12500,
    currency: "AED",
    status: "reconciled",
    category_id: "cat_sales",
    vat_code_id: "STANDARD_5",
    vendor_id: null,
    confidence_score: 0.98,
  },
  {
    id: "txn_002",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-11-29",
    description_raw: "Meta Ads",
    amount: -4200,
    currency: "AED",
    status: "categorized",
    category_id: "cat_marketing",
    vat_code_id: "STANDARD_5",
    vendor_id: "ven_meta",
    confidence_score: 0.92,
  },
  {
    id: "txn_003",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-01",
    description_raw: "Stripe payout",
    amount: 28500,
    currency: "AED",
    status: "reconciled",
    category_id: "cat_sales",
    vat_code_id: "STANDARD_5",
    vendor_id: null,
    confidence_score: 0.99,
  },
  {
    id: "txn_004",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-01",
    description_raw: "DEWA",
    amount: -1850,
    currency: "AED",
    status: "categorized",
    category_id: "cat_utilities",
    vat_code_id: "STANDARD_5",
    vendor_id: "ven_dewa",
    confidence_score: 0.9,
  },
  {
    id: "txn_005",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-02",
    description_raw: "Office Rent",
    amount: -25000,
    currency: "AED",
    status: "categorized",
    category_id: "cat_rent",
    vat_code_id: "EXEMPT",
    vendor_id: "ven_landlord",
  },
  {
    id: "txn_006",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-02",
    description_raw: "Amazon AWS",
    amount: -3200,
    currency: "AED",
    status: "categorized",
    category_id: "cat_cloud",
    vat_code_id: "STANDARD_5",
    vendor_id: "ven_aws",
  },
  {
    id: "txn_007",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-02",
    description_raw: "Client wire - Project Falcon",
    amount: 46500,
    currency: "AED",
    status: "reconciled",
    category_id: "cat_services",
    vat_code_id: "STANDARD_5",
    vendor_id: null,
  },
  {
    id: "txn_008",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-03",
    description_raw: "Etisalat",
    amount: -950,
    currency: "AED",
    status: "categorized",
    category_id: "cat_telecom",
    vat_code_id: "STANDARD_5",
    vendor_id: "ven_etisalat",
  },
  {
    id: "txn_009",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-03",
    description_raw: "Team lunch",
    amount: -620,
    currency: "AED",
    status: "raw",
    category_id: null,
    vat_code_id: null,
    vendor_id: null,
  },
  {
    id: "txn_010",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-03",
    description_raw: "Fuel - Company Car",
    amount: -210,
    currency: "AED",
    status: "raw",
    category_id: null,
    vat_code_id: "STANDARD_5",
    vendor_id: "ven_adnoc",
  },
  {
    id: "txn_011",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-11-25",
    description_raw: "Refund - Supplier credit",
    amount: 750,
    currency: "AED",
    status: "reconciled",
    category_id: "cat_refunds",
    vat_code_id: "ZERO",
    vendor_id: "ven_supplier_x",
  },
  {
    id: "txn_012",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-11-27",
    description_raw: "Insurance premium",
    amount: -4800,
    currency: "AED",
    status: "categorized",
    category_id: "cat_insurance",
    vat_code_id: "EXEMPT",
    vendor_id: "ven_insurer",
  },
  {
    id: "txn_013",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-11-30",
    description_raw: "Google Workspace",
    amount: -360,
    currency: "AED",
    status: "categorized",
    category_id: "cat_software",
    vat_code_id: "STANDARD_5",
    vendor_id: "ven_google",
  },
  {
    id: "txn_014",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-03",
    description_raw: "Consulting income",
    amount: 12500,
    currency: "AED",
    status: "categorized",
    category_id: "cat_services",
    vat_code_id: "STANDARD_5",
    vendor_id: null,
  },
  {
    id: "txn_015",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    date: "2025-12-03",
    description_raw: "Corporate card payment",
    amount: -5200,
    currency: "AED",
    status: "reconciled",
    category_id: "cat_creditcard",
    vat_code_id: "ZERO",
    vendor_id: "ven_bank",
  },
];

export const mockVatSummary: MockVatSummary = {
  period_start: "2025-10-01",
  period_end: "2025-12-31",
  total_output_vat: 18500,
  total_input_vat: 9200,
  net_vat_due: 18500 - 9200,
  breakdown: [
    { vat_code: "STANDARD_5", output_vat: 17000, input_vat: 8200 },
    { vat_code: "ZERO", output_vat: 0, input_vat: 0 },
    { vat_code: "EXEMPT", output_vat: 1500, input_vat: 1000 },
  ],
};

export const mockPdcItems: MockPdcItem[] = [
  {
    id: "pdc_001",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    cheque_number: "000123",
    party_name: "Alpha Trading LLC",
    amount: 15000,
    currency: "AED",
    issue_date: "2025-11-20",
    due_date: "2025-12-05",
    type: "received",
    status: "scheduled",
    linked_transaction_id: null,
  },
  {
    id: "pdc_002",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    cheque_number: "000124",
    party_name: "Office Landlord",
    amount: 25000,
    currency: "AED",
    issue_date: "2025-10-01",
    due_date: "2025-11-01",
    type: "issued",
    status: "cleared",
    linked_transaction_id: "txn_005",
  },
  {
    id: "pdc_003",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    cheque_number: "000125",
    party_name: "Delta Media FZ-LLC",
    amount: 7800,
    currency: "AED",
    issue_date: "2025-11-30",
    due_date: "2025-12-10",
    type: "issued",
    status: "scheduled",
    linked_transaction_id: null,
  },
  {
    id: "pdc_004",
    company_id: "comp_0001",
    bank_account_id: "acct_main",
    cheque_number: "000126",
    party_name: "Client Omega LLC",
    amount: 22000,
    currency: "AED",
    issue_date: "2025-12-01",
    due_date: "2025-12-20",
    type: "received",
    status: "scheduled",
    linked_transaction_id: null,
  },
];

export const mockCashflowForecast: MockCashflowForecast = (() => {
  const asOf = "2025-12-03";
  const projected_days = 30;
  const startBalance = 185250; // roughly aligns with overview cash_balance
  const dailyBurn = 2000; // ~60k monthly
  const series: MockCashflowPoint[] = [];
  for (let i = 0; i <= projected_days; i += 3) {
    const date = new Date(asOf);
    date.setDate(date.getDate() + i);
    const iso = date.toISOString().slice(0, 10);
    const projected_balance = Math.max(0, Math.round(startBalance - i * dailyBurn));
    series.push({ date: iso, projected_balance });
  }
  return {
    as_of_date: asOf,
    projected_days,
    series,
    burn_rate_monthly: 60000,
    runway_days: 75,
    assumptions: {
      seasonality: "moderate",
      hiring_freeze: false,
      notes: "Assumes stable receivables collection and flat opex",
    },
  } satisfies MockCashflowForecast;
})();

export const mockChatHistory: MockChatMessage[] = [
  {
    id: "chat_001",
    company_id: "comp_0001",
    user_id: "user_abc",
    role: "user",
    content: "How much did I spend on marketing in the last 3 months?",
    created_at: "2025-12-03T08:30:00.000Z",
  },
  {
    id: "chat_002",
    company_id: "comp_0001",
    user_id: null,
    role: "assistant",
    content:
      "You spent approximately AED 12,200 on marketing over the last 3 months (Sep–Nov). This includes Meta Ads, Google Ads, and agency fees.",
    created_at: "2025-12-03T08:30:02.000Z",
  },
  {
    id: "chat_003",
    company_id: "comp_0001",
    user_id: "user_abc",
    role: "user",
    content: "What’s our current cash runway?",
    created_at: "2025-12-03T08:31:10.000Z",
  },
  {
    id: "chat_004",
    company_id: "comp_0001",
    user_id: null,
    role: "assistant",
    content:
      "Based on a monthly burn of ~AED 60k and cash of ~AED 185k, your runway is roughly 75 days. This assumes flat expenses and timely receivables.",
    created_at: "2025-12-03T08:31:12.000Z",
  },
];

export type MockDataset = {
  overview: MockOverviewMetrics;
  incomeExpense: MockIncomeExpensePoint[];
  transactions: MockBankTransaction[];
  vatSummary: MockVatSummary;
  pdcItems: MockPdcItem[];
  cashflow: MockCashflowForecast;
  chatHistory: MockChatMessage[];
};

const baseDataset: MockDataset = {
  overview: mockOverviewMetrics,
  incomeExpense: mockIncomeExpenseSeries,
  transactions: mockTransactions,
  vatSummary: mockVatSummary,
  pdcItems: mockPdcItems,
  cashflow: mockCashflowForecast,
  chatHistory: mockChatHistory,
};

function scaleNumber(n: number, factor: number) {
  return Math.round(n * factor);
}

function buildVariant(companyId: string, factor: number): MockDataset {
  const overview: MockOverviewMetrics = {
    cash_balance: scaleNumber(mockOverviewMetrics.cash_balance, factor),
    income_this_month: scaleNumber(mockOverviewMetrics.income_this_month, factor * 1.05),
    expenses_this_month: scaleNumber(mockOverviewMetrics.expenses_this_month, factor * 0.95),
    net_result_this_month: scaleNumber(mockOverviewMetrics.net_result_this_month, factor),
    vat_due_current_period: scaleNumber(mockOverviewMetrics.vat_due_current_period, factor * 0.9),
    runway_days: Math.max(30, Math.round(mockOverviewMetrics.runway_days * factor)),
  };

  const incomeExpense = mockIncomeExpenseSeries.map((pt) => ({
    ...pt,
    income: scaleNumber(pt.income, factor * 1.05),
    expenses: scaleNumber(pt.expenses, factor * 0.95),
  }));

  const transactions = mockTransactions.map((tx, idx) => ({
    ...tx,
    id: `${tx.id}_${companyId}_${idx}`,
    company_id: companyId,
    amount: scaleNumber(tx.amount, factor * (tx.amount < 0 ? 1 : 1.05)),
    vat_code_id: tx.vat_code_id,
  }));

  const vatSummary: MockVatSummary = {
    ...mockVatSummary,
    total_output_vat: scaleNumber(mockVatSummary.total_output_vat, factor * 1.1),
    total_input_vat: scaleNumber(mockVatSummary.total_input_vat, factor * 0.9),
    net_vat_due: scaleNumber(mockVatSummary.net_vat_due, factor),
    breakdown: mockVatSummary.breakdown.map((b) => ({
      ...b,
      output_vat: scaleNumber(b.output_vat, factor * 1.05),
      input_vat: scaleNumber(b.input_vat, factor * 0.95),
    })),
  };

  const pdcItems = mockPdcItems.map((pdc, idx) => ({
    ...pdc,
    id: `${pdc.id}_${companyId}_${idx}`,
    company_id: companyId,
    amount: scaleNumber(pdc.amount, factor),
  }));

  const cashflow: MockCashflowForecast = {
    ...mockCashflowForecast,
    burn_rate_monthly: scaleNumber(mockCashflowForecast.burn_rate_monthly, factor),
    runway_days: Math.max(30, Math.round(mockCashflowForecast.runway_days * factor)),
    series: mockCashflowForecast.series.map((pt, idx) => ({
      ...pt,
      projected_balance: scaleNumber(pt.projected_balance, factor),
      date: pt.date,
    })),
  };

  const chatHistory = mockChatHistory.map((msg, idx) => ({
    ...msg,
    id: `${msg.id}_${companyId}_${idx}`,
    company_id: companyId,
    content:
      idx % 2 === 0
        ? msg.content.replace("cash", "cash (Company B mock)")
        : msg.content.replace("mock", "mock (Company B)"),
  }));

  return {
    overview,
    incomeExpense,
    transactions,
    vatSummary,
    pdcItems,
    cashflow,
    chatHistory,
  };
}

const mockDataByCompany: Record<string, MockDataset> = {
  comp_0001: baseDataset,
  comp_0002: buildVariant("comp_0002", 0.75),
};

export function getMockDataForCompany(companyId: string | null | undefined): MockDataset {
  if (!companyId) return mockDataByCompany.comp_0001;
  return mockDataByCompany[companyId] ?? mockDataByCompany.comp_0001;
}
