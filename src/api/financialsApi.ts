import type {
  FinancialDatasetResponse,
  MetricTraceResponse,
} from "../types/financials";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function getFinancialDataset(
  ticker: string
): Promise<FinancialDatasetResponse> {
  const normalizedTicker = ticker.trim().toUpperCase();

  if (!normalizedTicker) {
    throw new Error("Ticker is required");
  }

  const response = await fetch(
    `${API_BASE_URL}/financials/${normalizedTicker}/dataset`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch dataset for ${normalizedTicker}`);
  }

  return response.json();
}

export async function getMetricTrace(
  ticker: string,
  category: string,
  metricName: string
): Promise<MetricTraceResponse> {
  const normalizedTicker = ticker.trim().toUpperCase();

  const response = await fetch(
    `${API_BASE_URL}/financials/${normalizedTicker}/metrics/${category}/${metricName}/trace`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch metric trace for ${metricName} (${normalizedTicker})`
    );
  }

  return response.json();
}