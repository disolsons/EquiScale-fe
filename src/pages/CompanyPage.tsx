import { useState } from "react";
import { useFinancialDataset } from "../hooks/useFinancialDataset";
import MetricCards from "../components/MetricCards";
import FinancialReportTable from "../components/FinancialReportTable";
import type { FinancialReportResponse } from "../types/financials";

function formatLastUpdated(value: string | null): string {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return (
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(date) + " UTC"
  );
}

function getLatestAnnualReportPeriod(
  report: FinancialReportResponse | null
): string {
  if (!report || !report.periods || report.periods.length === 0) {
    return "N/A";
  }

  const sortedPeriods = [...report.periods].sort().reverse();
  return sortedPeriods[0] ?? "N/A";
}

export default function CompanyPage() {
  const [inputTicker, setInputTicker] = useState("NVDA");
  const [submittedTicker, setSubmittedTicker] = useState("NVDA");

  const { data, isLoading, isError, error } = useFinancialDataset(submittedTicker);

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>EquiScale</h1>
      <p>Company financials viewer</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmittedTicker(inputTicker.trim().toUpperCase());
        }}
        style={{ display: "flex", gap: "12px", marginBottom: "24px" }}
      >
        <input
          value={inputTicker}
          onChange={(e) => setInputTicker(e.target.value)}
          placeholder="Enter ticker, e.g. NVDA"
          style={{ padding: "8px 12px", minWidth: "240px" }}
        />
        <button type="submit">Load</button>
      </form>

      {isLoading && <p>Loading dataset...</p>}

      {isError && (
        <p>
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {data && (
        <div>
          <h2>{data.ticker}</h2>
          <p>
            Latest annual report filed:{" "}
            {getLatestAnnualReportPeriod(data.income_statement)}
          </p>
          <p>Last updated: {formatLastUpdated(data.last_updated)}</p>

          <MetricCards metrics={data.metrics} />

          <FinancialReportTable
            title="Income Statement"
            report={data.income_statement}
          />

          <FinancialReportTable
            title="Balance Sheet"
            report={data.balance_sheet}
          />

          <FinancialReportTable
            title="Cash Flow"
            report={data.cash_flow}
          />
        </div>
      )}
    </div>
  );
}