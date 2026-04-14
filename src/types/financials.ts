export type FinancialReportResponse = {
  ticker: string;
  report_type: string;
  periods: string[];
  concepts: Record<string, Record<string, number | null>>;
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

export type MetricDependencyResponse = {
  concept: string;
  statement_type: string | null;
  values: Record<string, number | null>;
  trace_endpoint: string | null;
};

export type MetricTraceResponse = {
  ticker: string;
  category: string;
  metric_name: string;
  metric_values: Record<string, number | null>;
  formula: string;
  dependencies: MetricDependencyResponse[];
};

export type ConceptTraceResponse = {
  ticker: string;
  statement_type: string;
  concept: string;
  concept_values: Record<string, number | null>;
  selected_raw_tag: string | null;
  selected_raw_label: string | null;
  raw_values: Record<string, number | null> | null;
};

export type CompanyProfileResponse = {
  ticker: string;
  company_name: string | null;
  exchange: string | null;
  industry: string | null;
  sic: string | null;
  fiscal_year_end: string | null;
  latest_annual_form: string | null;
  latest_annual_filing_date: string | null;
  latest_annual_filing_url: string | null;
};

export type StockPriceSnapshotResponse = {
  ticker: string;
  close_price: number | null;
  currency: string | null;
  price_date: string | null;
  exchange: string | null;
};