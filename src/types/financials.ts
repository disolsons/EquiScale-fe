export type FinancialReportResponse = {
  ticker: string;
  report_type: string;
  periods: string[];
  concepts: Record<string, Record<string, number | null>>;
};

export type MetricPeriodValueResponse = {
  period: string;
  value: number | null;
  suppression_code: string | null;
};

export type FinancialMetricsResponse = {
  ticker: string;
  categories: Record<string, Record<string, MetricPeriodValueResponse[]>>;
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
  suppression_reasons: Record<string, string>;
  formula: string;
  dependencies: MetricDependencyResponse[];
};

export type ConceptPeriodSourceTraceResponse = {
  period: string;
  value: number | null;
  selected_raw_tag: string | null;
  selected_raw_label: string | null;
  selected_source_layer: string | null;
  raw_value: number | null;
  is_source_overridden: boolean;
  original_raw_tag: string | null;
  original_raw_label: string | null;
  original_source_layer: string | null;
  original_value: number | null;
  is_derived: boolean;
};

export type ConceptTraceResponse = {
  ticker: string;
  statement_type: string;
  concept: string;
  concept_values: Record<string, number | null>;
  source_selections_by_period: Record<string, ConceptPeriodSourceTraceResponse>;
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

export type CustomFormulaRequest = {
  formula_name: string;
  expression: string;
};

export type CustomFormulaResponse = {
  ticker: string;
  formula_name: string;
  expression: string;
  values: Record<string, number | null>;
  dependencies: string[];
};