import { useMemo, useState } from "react";
import type { FinancialReportResponse } from "../types/financials";

type FinancialReportTableProps = {
  title: string;
  report: FinancialReportResponse | null;
};

const PRIORITY_CONCEPTS_BY_REPORT_TYPE: Record<string, string[]> = {
  income_statement: [
    "revenue",
    "gross_profit",
    "operating_income",
    "net_income",
    "diluted_eps",
  ],
  balance_sheet: [
    "cash_and_cash_equivalents",
    "total_assets",
    "total_liabilities",
    "shareholder_equity",
  ],
  cash_flow: [
    "operating_cash_flow",
    "capital_expenditures",
    "free_cash_flow",
  ],
};

function formatStatementValue(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  }).format(value);
}

function formatConceptLabel(concept: string): string {
  return concept
    .split("_")
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === "eps") return "EPS";
      if (lower === "sga") return "SG&A";
      if (lower === "rnd") return "R&D";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function getOrderedConcepts(
  reportType: string,
  allConcepts: string[]
): { featured: string[]; remaining: string[] } {
  const priorities = PRIORITY_CONCEPTS_BY_REPORT_TYPE[reportType] ?? [];

  const featured = priorities.filter((concept) => allConcepts.includes(concept));
  const remaining = allConcepts.filter((concept) => !featured.includes(concept));

  return { featured, remaining };
}

export default function FinancialReportTable({
  title,
  report,
}: FinancialReportTableProps) {
  const [showAll, setShowAll] = useState(false);

  const periods = report?.periods ?? [];
  const concepts = report?.concepts ?? {};

  const conceptNames = useMemo(() => {
    return Object.keys(concepts);
  }, [concepts]);

  const { featured, remaining } = useMemo(() => {
    if (!report) {
      return { featured: [], remaining: [] };
    }

    return getOrderedConcepts(report.report_type, conceptNames);
  }, [report, conceptNames]);

  const displayedConcepts = showAll ? [...featured, ...remaining] : featured;

  if (!report) {
    return null;
  }

  return (
    <section style={{ marginTop: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>

        {remaining.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {showAll ? "Show key rows only" : `Show all rows (${remaining.length} more)`}
          </button>
        )}
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "720px",
            }}
          >
            <thead>
              <tr style={{ background: "#f7f7f7" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    borderBottom: "1px solid #ddd",
                    fontSize: "14px",
                  }}
                >
                  Concept
                </th>

                {periods.map((period) => (
                  <th
                    key={period}
                    style={{
                      textAlign: "right",
                      padding: "14px 16px",
                      borderBottom: "1px solid #ddd",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {period}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {displayedConcepts.map((concept, rowIndex) => (
                <tr
                  key={concept}
                  style={{
                    background: rowIndex % 2 === 0 ? "#fff" : "#fcfcfc",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid #eee",
                      fontSize: "14px",
                      fontWeight: featured.includes(concept) ? 600 : 400,
                    }}
                  >
                    {formatConceptLabel(concept)}
                  </td>

                  {periods.map((period) => (
                    <td
                      key={`${concept}-${period}`}
                      style={{
                        padding: "14px 16px",
                        borderBottom: "1px solid #eee",
                        textAlign: "right",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatStatementValue(report.concepts[concept]?.[period] ?? null)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}