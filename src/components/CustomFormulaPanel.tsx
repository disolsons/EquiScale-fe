import { useState } from "react";
import type { CustomFormulaResponse } from "../types/financials";
import { useCalculateCustomFormula } from "../hooks/useCalculateCustomFormula";

type CustomFormulaPanelProps = {
  ticker: string;
};

function formatFormulaValue(value: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

function buildPeriodRows(values: Record<string, number | null>) {
  return Object.keys(values)
    .sort()
    .map((period) => ({
      period,
      value: values[period],
    }));
}

function FormulaResultTable({ result }: { result: CustomFormulaResponse }) {
  const rows = buildPeriodRows(result.values);

  return (
    <div
      style={{
        marginTop: "18px",
        border: "1px solid #eee",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid #eee",
          background: "#fafafa",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: 700 }}>
          {result.formula_name}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#666",
            marginTop: "4px",
            fontFamily: "monospace",
            wordBreak: "break-word",
          }}
        >
          {result.expression}
        </div>
      </div>

      <div style={{ padding: "14px 16px", borderBottom: "1px solid #eee" }}>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "8px" }}>
          Dependencies
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {result.dependencies.map((dependency) => (
            <span
              key={dependency}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#444",
                background: "#f2f4f7",
                border: "1px solid #e5e7eb",
                borderRadius: "999px",
                padding: "4px 8px",
              }}
            >
              {dependency}
            </span>
          ))}
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#f7f7f7" }}>
            <th
              style={{
                textAlign: "left",
                padding: "12px 16px",
                borderBottom: "1px solid #eee",
                fontSize: "13px",
              }}
            >
              Period
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "12px 16px",
                borderBottom: "1px solid #eee",
                fontSize: "13px",
              }}
            >
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.period}
              style={{
                background: index % 2 === 0 ? "#fff" : "#fcfcfc",
              }}
            >
              <td
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {row.period}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #eee",
                  textAlign: "right",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatFormulaValue(row.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CustomFormulaPanel({ ticker }: CustomFormulaPanelProps) {
  const [formulaName, setFormulaName] = useState("Custom FCF Margin");
  const [expression, setExpression] = useState("free_cash_flow / revenue");

  const mutation = useCalculateCustomFormula(ticker);

  return (
    <section
      style={{
        marginTop: "24px",
        border: "1px solid #ddd",
        borderRadius: "16px",
        background: "#fff",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "18px" }}>
        <h3 style={{ margin: 0, fontSize: "20px" }}>Custom formula</h3>
        <p
          style={{
            margin: "6px 0 0",
            color: "#666",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          Calculate an ad hoc metric using normalized concepts or existing
          metrics, such as <code>net_income / revenue</code> or{" "}
          <code>free_cash_flow / revenue</code>.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();

          mutation.mutate({
            formula_name: formulaName.trim(),
            expression: expression.trim(),
          });
        }}
        style={{
          display: "grid",
          gap: "14px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "6px",
              color: "#444",
            }}
          >
            Formula name
          </label>
          <input
            value={formulaName}
            onChange={(event) => setFormulaName(event.target.value)}
            placeholder="e.g. Custom FCF Margin"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "6px",
              color: "#444",
            }}
          >
            Expression
          </label>
          <input
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            placeholder="e.g. (operating_cash_flow - capital_expenditures) / revenue"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              fontSize: "14px",
              fontFamily: "monospace",
            }}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: mutation.isPending ? "#f3f4f6" : "#fff",
              cursor: mutation.isPending ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {mutation.isPending ? "Calculating..." : "Calculate formula"}
          </button>
        </div>
      </form>

      {mutation.isError ? (
        <div
          style={{
            marginTop: "18px",
            padding: "14px",
            border: "1px solid #f0caca",
            borderRadius: "12px",
            background: "#fff5f5",
            color: "#8a2d2d",
            fontSize: "14px",
          }}
        >
          {mutation.error.message}
        </div>
      ) : null}

      {mutation.data ? <FormulaResultTable result={mutation.data} /> : null}
    </section>
  );
}