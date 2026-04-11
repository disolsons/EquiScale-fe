import type { FinancialDatasetResponse } from "../types/financials";

const API_BASE_URL = "http://localhost:8000";

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
    const message = `Failed to fetch dataset for ${normalizedTicker}`;
    throw new Error(message);
  }

  return response.json();
}