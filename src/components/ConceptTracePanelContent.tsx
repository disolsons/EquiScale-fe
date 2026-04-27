import type {
  ConceptPeriodSourceTraceResponse,
  ConceptTraceResponse,
} from "../types/financials";
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

function formatSourceLayer(sourceLayer: string | null): string {
  if (!sourceLayer) return "No source layer available";

  const labels: Record<string, string> = {
    entity_facts_statement: "Entity facts statement",
    financials_rendered_statement: "Rendered financial statement",
    derived: "Derived",
  };

  return labels[sourceLayer] ?? sourceLayer;
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

function buildSourceRows(
  sourceSelectionsByPeriod:
    | Record<string, ConceptPeriodSourceTraceResponse>
    | null
    | undefined
) {
  if (!sourceSelectionsByPeriod) {
    return [];
  }

  return Object.keys(sourceSelectionsByPeriod)
    .sort()
    .map((period) => sourceSelectionsByPeriod[period]);
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

function SourceByPeriodBlock({
  rows,
}: {
  rows: ConceptPeriodSourceTraceResponse[];
}) {
  if (rows.length === 0) {
    return (
      <section
        style={{
          border: "1px solid #eee",
          borderRadius: "12px",
          padding: "16px",
          background: "#fafafa",
        }}
      >
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Filing line items used
        </div>
        <div style={{ fontSize: "14px", color: "#444" }}>
          No filing source information available.
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        border: "1px solid #eee",
        borderRadius: "12px",
        padding: "16px",
        background: "#fafafa",
      }}
    >
      <div style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
        Filing line items used by period
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {rows.map((row) => (
          <div
            key={row.period}
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "12px",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr",
                columnGap: "10px",
                marginBottom: "10px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {row.period}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {formatCompactNumber(row.value)}
              </div>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#777",
                    marginBottom: "4px",
                  }}
                >
                  Source
                </div>
                <div style={{ fontSize: "14px", color: "#444" }}>
                  {formatSourceLayer(row.selected_source_layer)}
                  {row.is_derived ? " · Derived" : ""}
                  {row.is_source_overridden ? " · Overridden" : ""}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#777",
                    marginBottom: "4px",
                  }}
                >
                  Filing line item
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {row.selected_raw_label ?? "No filing label available"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#777",
                    marginBottom: "4px",
                  }}
                >
                  SEC tag
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: "#444",
                    wordBreak: "break-word",
                  }}
                >
                  {row.selected_raw_tag ?? "No raw tag available"}
                </div>
              </div>

              {row.raw_value !== null ? (
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      marginBottom: "4px",
                    }}
                  >
                    Source value available
                  </div>
                  <div style={{ fontSize: "14px", color: "#444" }}>
                    {formatCompactNumber(row.raw_value)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function OriginalSourceBlock({
  rows,
}: {
  rows: ConceptPeriodSourceTraceResponse[];
}) {
  const rowsWithOriginalSource = rows.filter(
    (row) =>
      row.original_raw_tag ||
      row.original_raw_label ||
      row.original_source_layer ||
      row.original_value !== null
  );

  if (rowsWithOriginalSource.length === 0) {
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

  const sourceRows = buildSourceRows(trace.source_selections_by_period);

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

      <ValuesBlock title="Values used" values={trace.concept_values} />

      <SourceByPeriodBlock rows={sourceRows} />

      <OriginalSourceBlock rows={sourceRows} />

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
          normalized concept <code>{trace.concept}</code>. Source information is
          now shown per period because a concept can use different tags or source
          layers across fiscal years.
        </div>
      </section>
    </div>
  );
}