import type { MetricTraceResponse } from "../types/financials";
import {
  METRIC_DISPLAY_CONFIG,
  formatCompactNumber,
  formatMetricValue,
} from "../utils/metricFormatting";

type MetricTracePanelContentProps = {
  trace: MetricTraceResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
};

function getSortedPeriods(values: Record<string, number | null>): string[] {
  return Object.keys(values).sort().reverse();
}

function getLatestValue(values: Record<string, number | null>): {
  period: string | null;
  value: number | null;
} {
  const periods = getSortedPeriods(values);

  for (const period of periods) {
    const value = values[period];
    if (value !== null && value !== undefined) {
      return { period, value };
    }
  }

  const latestPeriod = periods[0] ?? null;
  return {
    period: latestPeriod,
    value: latestPeriod ? values[latestPeriod] ?? null : null,
  };
}

export default function MetricTracePanelContent({
  trace,
  isLoading,
  errorMessage,
}: MetricTracePanelContentProps) {
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

  const latestMetricValue = getLatestValue(trace.metric_values);
  const metricDisplayConfig = METRIC_DISPLAY_CONFIG[trace.metric_name];
  const latestSuppressionReason =
    latestMetricValue.period && trace.suppression_reasons
      ? trace.suppression_reasons[latestMetricValue.period] ?? null
      : null;

  const metricPeriods = getSortedPeriods(trace.metric_values);

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Metric
        </div>
        <div style={{ fontSize: "18px", fontWeight: 700 }}>{trace.metric_name}</div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
          Category: {trace.category}
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
          Formula
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {trace.formula}
        </div>
        <div style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
          Metric and dependency values by period are shown below.
        </div>
      </section>

      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
          Latest available metric result
          {latestMetricValue.period ? ` (${latestMetricValue.period})` : ""}
        </div>
        <div style={{ fontSize: "24px", fontWeight: 700 }}>
          {formatMetricValue(
            latestMetricValue.value,
            metricDisplayConfig?.format ?? "number"
          )}
        </div>

        {latestSuppressionReason && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "13px",
              color: "#b45309",
            }}
          >
            {latestSuppressionReason}
          </div>
        )}
      </section>

      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
          Metric values by period
        </div>

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "12px",
            background: "#fff",
            overflow: "hidden",
          }}
        >
          {metricPeriods.map((period, index) => {
            const value = trace.metric_values[period];
            const suppressionReason = trace.suppression_reasons?.[period] ?? null;

            return (
              <div
                key={period}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "12px",
                  padding: "12px 14px",
                  borderTop: index === 0 ? "none" : "1px solid #f1f1f1",
                }}
              >
                <div style={{ fontSize: "13px", color: "#666", fontWeight: 600 }}>
                  {period}
                </div>

                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600 }}>
                    {formatMetricValue(
                      value,
                      metricDisplayConfig?.format ?? "number"
                    )}
                  </div>

                  {suppressionReason && (
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        color: "#b45309",
                      }}
                    >
                      {suppressionReason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div style={{ fontSize: "12px", color: "#777", marginBottom: "10px" }}>
          Dependencies by period
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          {trace.dependencies.map((dependency) => {
            const dependencyPeriods = getSortedPeriods(dependency.values);

            return (
              <div
                key={dependency.concept}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  padding: "14px",
                  background: "#fff",
                }}
              >
                <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px" }}>
                  {dependency.concept}
                </div>

                <div style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>
                  Statement: {dependency.statement_type ?? "Derived / unresolved"}
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {dependencyPeriods.length > 0 ? (
                    dependencyPeriods.map((period) => (
                      <div
                        key={period}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "120px 1fr",
                          gap: "12px",
                          fontSize: "14px",
                        }}
                      >
                        <div style={{ color: "#666", fontWeight: 500 }}>{period}</div>
                        <div style={{ fontWeight: 500 }}>
                          {formatCompactNumber(dependency.values[period])}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "13px", color: "#888" }}>
                      No values available.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}