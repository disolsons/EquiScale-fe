export type FinancialReportResponse = {
  ticker: string;
  report_type: string;
  periods: string[];
  values: Record<string, Record<string, number | null>>;
};

export type FinancialMetricsResponse = {
  ticker: string;
  categories: Record<string, Record<string, Record<string, number | null>>>;
};

export type FinancialDatasetResponse = {
  ticker: string;
  income_statement: FinancialReportResponse | null;
  balance_sheet: FinancialReportResponse | null;
  cash_flow: FinancialReportResponse | null;
  metrics: FinancialMetricsResponse | null;
  last_updated: string | null;
};