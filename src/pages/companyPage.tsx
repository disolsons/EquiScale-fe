import { useState } from "react";
import { useFinancialDataset } from "../hooks/useFinancialDataset";

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
          <p>Last updated: {data.last_updated ?? "N/A"}</p>

          <section style={{ marginTop: "24px" }}>
            <h3>Metrics</h3>
            <pre>{JSON.stringify(data.metrics, null, 2)}</pre>
          </section>

          <section style={{ marginTop: "24px" }}>
            <h3>Income Statement</h3>
            <pre>{JSON.stringify(data.income_statement, null, 2)}</pre>
          </section>

          <section style={{ marginTop: "24px" }}>
            <h3>Balance Sheet</h3>
            <pre>{JSON.stringify(data.balance_sheet, null, 2)}</pre>
          </section>

          <section style={{ marginTop: "24px" }}>
            <h3>Cash Flow</h3>
            <pre>{JSON.stringify(data.cash_flow, null, 2)}</pre>
          </section>
        </div>
      )}
    </div>
  );
}