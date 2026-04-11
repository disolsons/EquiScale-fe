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

function HeaderItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={{ minWidth: "180px" }}>
      <div
        style={{
          fontSize: "12px",
          color: "#7a7a7a",
          marginBottom: "4px",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function CompanyPage() {
  const [inputTicker, setInputTicker] = useState("NVDA");
  const [submittedTicker, setSubmittedTicker] = useState("NVDA");

  const { data, isLoading, isError, error } = useFinancialDataset(submittedTicker);

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>EquiScale</h1>
      <p style={{ marginTop: 0, color: "#666", marginBottom: "24px" }}>
        Company financials viewer
      </p>

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
          style={{
            padding: "10px 12px",
            minWidth: "240px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Load
        </button>
      </form>

      {isLoading && <p>Loading dataset...</p>}

      {isError && (
        <div
          style={{
            padding: "16px",
            border: "1px solid #f0caca",
            borderRadius: "12px",
            background: "#fff5f5",
            color: "#8a2d2d",
          }}
        >
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {data && (
        <div>
          <section
            style={{
              border: "1px solid #ddd",
              borderRadius: "16px",
              background: "#fff",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#7a7a7a",
                    marginBottom: "6px",
                    fontWeight: 500,
                  }}
                >
                  Company
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "32px",
                    lineHeight: 1.1,
                  }}
                >
                  {data.ticker}
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <HeaderItem
                  label="Latest annual report filed"
                  value={getLatestAnnualReportPeriod(data.income_statement)}
                />
                <HeaderItem
                  label="Last updated"
                  value={formatLastUpdated(data.last_updated)}
                />
              </div>
            </div>
          </section>

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