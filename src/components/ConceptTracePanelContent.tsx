import type { ConceptTraceResponse } from "../types/financials";
import { formatCompactNumber } from "../utils/metricFormatting";

type ConceptTracePanelContentProps = {
  trace: ConceptTraceResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
  title: string;
};

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

function buildPeriodRows(values: Record<string, number | null> | null) {
  if (!values) {
    return [];
  }

  return Object.keys(values)
    .sort()
    .map((period) => ({
      period,
      value: values[period] ?? null,
    }));
}

function ValuesBlock({
  title,
  values,
}: {
  title: string;
  values: Record<string, number | null> | null;
}) {
  const rows = buildPeriodRows(values);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "16px",
        background: "#fff",
      }}
    >
      <div style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
        {title}
      </div>

      <div style={{ display: "grid", gap: "8px" }}>
        {rows.map((row) => (
          <div
            key={row.period}
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr",
              columnGap: "10px",
              fontSize: "14px",
              color: "#444",
            }}
          >
            <div style={{ fontWeight: 500 }}>{row.period}</div>
            <div style={{ fontWeight: 500 }}>
              {formatCompactNumber(row.value)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ConceptTracePanelContent({
  trace,
  isLoading,
  errorMessage,
  title,
}: ConceptTracePanelContentProps) {
  if (isLoading) {
    return <p>Loading trace...</p>;
  }

  if (errorMessage) {
    return (
      <div
        style={{
          padding: "14px",
          border: "1px solid #f0caca",
          borderRadius: "12px",
          background: "#fff5f5",
          color: "#8a2d2d",
        }}
      >
        {errorMessage}
      </div>
    );
  }

  if (!trace) {
    return <p>No trace data available.</p>;
  }

  const rawValuesDiffer =
    trace.raw_values &&
    JSON.stringify(trace.raw_values) !== JSON.stringify(trace.concept_values);

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Normalized concept
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          Statement: {formatConceptLabel(trace.statement_type)}
        </div>
      </section>

      <section
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "16px",
          background: "#fafafa",
        }}
      >
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Filing line item used
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {trace.selected_raw_label ?? "No filing label available"}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#777",
            marginTop: "12px",
            marginBottom: "6px",
          }}
        >
          SEC tag
        </div>
        <div
          style={{
            fontSize: "14px",
            fontFamily: "monospace",
            color: "#444",
            wordBreak: "break-word",
          }}
        >
          {trace.selected_raw_tag ?? "No raw tag available"}
        </div>
      </section>

      <ValuesBlock title="Values used" values={trace.concept_values} />

      {rawValuesDiffer ? (
        <ValuesBlock title="Source values available" values={trace.raw_values} />
      ) : null}

      <section
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "16px",
          background: "#fafafa",
        }}
      >
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Note
        </div>
        <div style={{ fontSize: "14px", color: "#444", lineHeight: 1.5 }}>
          These values were selected by the pipeline as the source for the
          normalized concept <code>{trace.concept}</code>.
        </div>
      </section>
    </div>
  );
}